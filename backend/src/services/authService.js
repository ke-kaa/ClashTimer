import User from '../models/User.js';
import * as tokenUtil from '../utils/tokenUtil.js';
import bcrypt from 'bcryptjs';

export async function regitrationService({ username, email, password }) {
    const emailNorm = email.trim().toLowerCase();
    const usernameNorm = username.trim();

    const existingUser = await User.findOne({ $or: [{ email: emailNorm }, { username }] });
    if (existingUser) {
        const err = new Error('User already exists');
        err.status = 400;
        throw err
    };

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User.create({
        username: usernameNorm, 
        email: emailNorm,
        password: hashedPassword,
    });

    const accessToken = tokenUtil.signAccessToken(newUser);
    const refreshTokenPlain = tokenUtil.generateRefreshTokenOpaque();
    const refreshTokenHashed = tokenUtil.hashToken(refreshTokenPlain);
    const refreshExpiresAt = tokenUtil.refreshTokenExpiryDate();

    newUser.refershTokens = Array.isArray(newUser.refershTokens) ? newUser.refreshTokens : [];
    newUser.refershTokens.push({ token: refreshTokenHashed, expiresAt: refreshExpiresAt });
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
    if (!user) throw { status: 401, message: 'Invalid credentials' };

    if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({ message: 'Account locked due to failed login attempts. Try later.' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

        const allowedLoginAttempts = 5;
        const lockTime = 360000 // milliseconds -> 1 hr
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
