import { regitrationService, loginService, refreshTokenService } from "../services/authService.js";
import { config } from "../config/config.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
};


export async function registerUserController(req, res) {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email and password are required' });
    }

    try {
        const result = await regitrationService({username, email, password});

        res.cookie('refreshToken', result.tokens.refreshToken, {
            ...COOKIE_OPTIONS,
            expires: result.tokens.refreshTokenExpiresAt,
        });

        return res.status(201).json({
            user: result.user,
            tokens: { accessToken: result.tokens.accessToken },
        });
    }
    catch (error) {
        if (error.status === 400 || error.status === 409 || error.message === 'User already exists'){
            return res.status(error.status || 400).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export async function loginController(req, res) {
    const { email, username, password } = req.body || {};
    if (!(email || username) || !password) {
        return res.status(400).json({ error: 'identifier/email/username and password are required' });
    }
    try {
        const result = await loginService({ email, username, password });

        res.cookie('refreshToken', result.tokens.refreshToken, {
            ...COOKIE_OPTIONS,
            expires: result.tokens.refreshTokenExpiresAt,
        });

        return res.json({
            user: result.user,
            tokens: { accessToken: result.tokens.accessToken },
        });
    } catch (error) {
        if (error.status === 400 || error.status === 401) {
        return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export async function refreshTokenController(req, res) {
    const refreshTokenPlain = req.cookies?.refreshToken || req.get('x-refresh-token') || req.body?.refreshToken;

    try {
        const result = await refreshTokenService({ refreshTokenPlain });

        res.cookie('refreshToken', result.tokens.refreshToken, {
            ...COOKIE_OPTIONS,
            expires: result.tokens.refreshTokenExpiresAt,
        });

        return res.json({ tokens: { accessToken: result.tokens.accessToken } });
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || 'Internal server error' });
    }
};
