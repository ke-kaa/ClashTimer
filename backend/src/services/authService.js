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
}