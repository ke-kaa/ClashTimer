import User from '../models/User.js';
import * as tokenUtil from '../utils/tokenUtil.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/emailUtil.js';
import { config } from '../config/config.js';
import crypto from 'crypto';

export async function regitrationService({ username, email, password }) {
    const emailNorm = email.trim().toLowerCase();
    const usernameNorm = username.trim();

    const existingUser = await User.findOne({ $or: [{ email: emailNorm }, { username }] });
    if (existingUser) {
        const err = new Error('User already exists');
        err.status = 400;
        throw err
    };

    // IMPORTANT: Do NOT hash here — let the UserSchema pre('save') hook hash it once.
    const newUser = new User({
        username: usernameNorm,
        email: emailNorm,
        password: password,
    });

    const accessToken = tokenUtil.signAccessToken(newUser);
    const refreshTokenPlain = tokenUtil.generateRefreshTokenOpaque();
    const refreshTokenHashed = tokenUtil.hashToken(refreshTokenPlain);
    const refreshExpiresAt = tokenUtil.refreshTokenExpiryDate();

    newUser.refreshTokens = Array.isArray(newUser.refreshTokens) ? newUser.refreshTokens : [];
    newUser.refreshTokens.push({ token: refreshTokenHashed, expiresAt: refreshExpiresAt });
    await newUser.save();

    return {
        user: {
            id: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        },
        tokens: {
            accessToken,
            refreshToken: refreshTokenPlain,
            refreshTokenExpiresAt: refreshExpiresAt, 
        },
    };
};

export async function loginService({ email, username, password }) {
    const id = (email || username || '').trim();
    if (!id || !password) throw { status: 400, message: 'email/username and password are required' };

    const isEmail = id.includes('@');
    const query = isEmail ? { email: id.toLowerCase() } : { username: id };
    const user = await User.findOne(query).select('+password');
    if (!user){
        throw { status: 401, message: 'Invalid credentials' };
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
        const err = new Error('Account locked due to failed login attempts. Try later.');
        err.status = 403;
        throw err;
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

        const allowedLoginAttempts = 5;
        const lockTime = 60 * 60 * 1000; // 1 hour in ms
        if (user.failedLoginAttempts >= allowedLoginAttempts) {
            user.lockUntil = Date.now() + lockTime; 
        }

        await user.save();
        throw { status: 401, message: 'Invalid credentials' };
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;

    const accessToken = tokenUtil.signAccessToken(user);
    const refreshTokenPlain = tokenUtil.generateRefreshTokenOpaque();
    const refreshTokenHashed = tokenUtil.hashToken(refreshTokenPlain);
    const refreshExpiresAt = tokenUtil.refreshTokenExpiryDate();

    user.refreshTokens = Array.isArray(user.refreshTokens) ? user.refreshTokens : [];
    user.refreshTokens.push({ token: refreshTokenHashed, expiresAt: refreshExpiresAt });
    await user.save();

    return {
        user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
        },
        tokens: {
            accessToken,
            refreshToken: refreshTokenPlain,
            refreshTokenExpiresAt: refreshExpiresAt,
        },
    };
};

export async function refreshTokenService({ refreshTokenPlain }) {
    if (!refreshTokenPlain) {
        const err = new Error('No refresh token');
        err.status = 401;
        throw err;
    };

    const hashed = tokenUtil.hashToken(refreshTokenPlain);

    const user = await User.findOne({ 'refreshTokens.token': hashed });
    if (!user) {
        const err = new Error('Invalid refresh token');
        err.status = 403;
        throw err;
    };
    

    const tokenEntry = user.refreshTokens.find(r => r.token === hashed);
    if (!tokenEntry || tokenEntry.expiresAt.getTime() < Date.now()) {
        user.refreshTokens = user.refreshTokens.filter((r) => r.token !== hashed);
        await user.save();
        const err = new Error('Refresh token expired');
        err.status = 403;
        throw err;
    }

    user.refreshTokens = user.refreshTokens.filter((r) => r.token !== hashed);
    const newRefreshPlain = tokenUtil.generateRefreshTokenOpaque();
    const newHashed = tokenUtil.hashToken(newRefreshPlain);
    const newExpiresAt = tokenUtil.refreshTokenExpiryDate();
    user.refreshTokens.push({ token: newHashed, expiresAt: newExpiresAt });
    await user.save();

    const accessToken = tokenUtil.signAccessToken(user);

    return {
        user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
        },
        tokens: {
            accessToken,
            refreshToken: newRefreshPlain,
            refreshTokenExpiresAt: newExpiresAt,
        },
    };
};

export async function logoutService({ refreshTokenPlain }) {
    if (!refreshTokenPlain) {
        return { revoked: false };
    }

    const hashed = tokenUtil.hashToken(refreshTokenPlain);

    const result = await User.updateOne(
        { 'refreshTokens.token': hashed },
        { $pull: { refreshTokens: { token: hashed } } }
    );

    return { revoked: (result.modifiedCount || result.nModified || 0) > 0 };
}

export async function forgotPasswordService({ email }) {
    const emailNorm = (email || '').trim().toLowerCase();
    if (!emailNorm) {
        const err = new Error('Email is required');
        err.status = 400;
        throw err;
    }

    const user = await User.findOne({ email: emailNorm });
    if (!user) {
        return { ok: true };
    }

    // Create reset token (store hashed, send plaintext)
    const resetPlain = crypto.randomBytes(32).toString('hex');
    const resetHashed = crypto.createHash('sha256').update(resetPlain).digest('hex');

    user.passwordResetToken = resetHashed;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const base = (config?.clientUrl);
    const clientBase = String(base).replace(/\/$/, '');
    const resetUrl = `${clientBase}/reset-password?token=${resetPlain}&email=${encodeURIComponent(emailNorm)}`;

    // Send email (do not throw if mail fails to avoid info leak)
    try {
        await sendEmail({
        to: emailNorm,
        subject: 'Password reset',
        text: `Reset here: ${resetUrl}`,
        html: `<p>Reset your password <a href="${resetUrl}">here</a></p>`
        });
    } catch (e) {
        console.error('Failed to send password reset email:', e);
    }

    return { ok: true };
}

export async function resetPasswordService({ token, email, newPassword }) {
    const emailNorm = (email || '').trim().toLowerCase();
    const tokenPlain = (token || '').trim();
    const pwd = (newPassword || '').trim();

    if (!emailNorm || !tokenPlain || !pwd) {
        const err = new Error('email, token and newPassword are required');
        err.status = 400;
        throw err;
    }

    const hashed = crypto.createHash('sha256').update(tokenPlain).digest('hex');

    const user = await User.findOne({
        email: emailNorm,
        passwordResetToken: hashed,
        passwordResetExpires: { $gt: new Date() }
    });
    if (!user) {
        const err = new Error('Invalid or expired token');
        err.status = 400;
        throw err;
    }

    // Update password (pre-save hook hashes it)
    user.password = pwd;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Force logout everywhere
    user.refreshTokens = [];

    await user.save();

    return { ok: true };
}
