import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Robust .env loading regardless of current working directory (CWD)
// Keep the implicit dotenv/config import for CLI/dev, but if critical vars are missing,
// attempt to load a .env file relative to this file's location.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.JWT_SECRET) {
    const candidates = [
        // project root .env (../../ from src/config/config.js → backend/.env)
        path.resolve(__dirname, '../../.env'),
        // fallback: one level up (in case structure changes)
        path.resolve(__dirname, '../.env'),
        // last resort: CWD .env
        path.resolve(process.cwd(), '.env'),
    ];

    for (const p of candidates) {
        try {
            const before = process.env.JWT_SECRET;
            dotenv.config({ path: p });
            if (process.env.JWT_SECRET && process.env.JWT_SECRET !== before) {
                break;
            }
        } catch {
            // ignore and try next candidate
        }
    }
}

const {
    NODE_ENV,
    CORS_ORIGIN,
    APP_NAME,
    PORT,
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_BYTES,
    LOG_LEVEL,
    TRUST_PROXY,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_FROM,
    CLASH_EMAIL,
    CLASH_PASSWORD,
    CLASH_API_KEY,
    CLASH_API_KEYNAME,
} = process.env;

export const config = {
    env: NODE_ENV,
    port: PORT,
    appName: APP_NAME,

    corsOrigin: CORS_ORIGIN,
    trustProxy: TRUST_PROXY === 'true',

    db: {
        uri: MONGODB_URI ,
    },

    jwt: {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
        refreshSecret: REFRESH_TOKEN_SECRET,
        refreshExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
        refreshTokenBytes: Number(REFRESH_TOKEN_BYTES),
    },

    logLevel: LOG_LEVEL || 'info',

    mail: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        user: SMTP_USER,
        pass: SMTP_PASS,
        from: EMAIL_FROM,
        enabled: Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS),
    },

    clash: {
        email: CLASH_EMAIL,
        password: CLASH_PASSWORD,
        api: CLASH_API_KEY,
        keyName: CLASH_API_KEYNAME
    }
};


// Fail fast for production-only required envs
if (config.env === 'production') {
    if (config.corsOrigin === '*') {
        throw new Error("CORS_ORIGIN must be set explicitly in production");
    }
    if (!config.jwt.secret || config.jwt.secret === 'changeme') {
        throw new Error("JWT_SECRET must be set in production");
    }
    if (!config.db.uri) {
        throw new Error("MONGODB_URI must be set in production");
    }
}