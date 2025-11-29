import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import crypto from 'crypto';

export function signAccessToken(user) {
    const payload = { sub: user._id.toString(), role: user.role };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

export function verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.secret);
};

export function generateRefreshTokenOpaque() {
    const len = Number(config.jwt.refreshTokenBytes || 40);
    return crypto.randomBytes(len).toString('hex');
};

export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
};

export  function refreshTokenExpiryDate() {
    // config.jwt.refreshExpiresIn: e.g. '7d', '12h'
    const ms = parseExpiresToMs(config.jwt.refreshExpiresIn || '7d');
    return new Date(Date.now() + ms);
};

function parseExpiresToMs(v) {
    const m = String(v).match(/^(\d+)\s*(ms|s|m|h|d)?$/i);
    if (!m) return 7 * 24 * 60 * 60 * 1000;
    const n = Number(m[1]);
    const u = (m[2] || 's').toLowerCase();
    return u === 'ms' ? n
        : u === 's' ? n * 1000
        : u === 'm' ? n * 60 * 1000
        : u === 'h' ? n * 60 * 60 * 1000
        : n * 24 * 60 * 60 * 1000; // 'd'
};
