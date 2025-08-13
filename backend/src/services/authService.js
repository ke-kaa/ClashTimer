import User from '../models/User';
import { hash, compare } from 'bcrypt';
import { sign } from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export async function regsitrationService({ username, email, password }) {
    const emailNorm = email.trim().toLowerCase();

    const existingUser = await User.findOne({ $or: [{ email: emailNorm }, { username }] });
    if (existingUser) {
        const err = new Error('User already exists');
        err.status = 400;
        throw err
    };

    const hashedPassword = await hash(password, 12);
    const newUser = new User.create({
        username, 
        email: emailNorm,
        password: hashedPassword,
    });

    const payload = { sub: newUser._id.toString(), role: newUser.role }; 
    const accessToken = sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn} );
    const refreshToken = sign({ sub: payload.sub, type: 'refresh' }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn} );

    return {
        user: {
            id: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };
};

export async function loginService({ email, username, password }) {
    const id = (email || username || '').trim();
    if (!id || !password) throw { status: 400, message: 'identifier/email/username and password are required' };

    const isEmail = id.includes('@');
    const query = isEmail ? { email: id.toLowerCase() } : { username: id };
    const user = await User.findOne(query);
    if (!user) throw { status: 401, message: 'Invalid credentials' };

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw { status: 401, message: 'Invalid credentials' };

    const payload = { sub: user._id.toString(), role: user.role };
    const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    const refreshToken = jwt.sign(
        { sub: payload.sub, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
    );

    return {
        user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
        },
        tokens: { accessToken, refreshToken }
    };
}
