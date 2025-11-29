import { regitrationService, loginService, refreshTokenService ,logoutService, forgotPasswordService, resetPasswordService } from "../services/authService.js";
import { config } from "../config/config.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
};

export async function registerUserController(req, res) {
    const { username, email, password, confirm_password } = req.body || {};

    if (!username || !email || !password || !confirm_password) {
        return res.status(400).json({ error: 'username, email, password and confirm_password are required' });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ error: 'Passwords do not match' });
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
        return res.status(400).json({ error: 'email/username and password are required' });
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
            console.error(error)
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

export async function logoutController(req, res) {
    try {
        const refreshTokenPlain =
            req.cookies?.refreshToken ||
            req.get('x-refresh-token') ||
            req.body?.refreshToken;

        await logoutService({ refreshTokenPlain });

        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return res.status(204).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export async function forgotPasswordController(req, res) {
    const { email } = req.body || {};
    try {
        await forgotPasswordService({ email });
        // Uniform response to avoid user enumeration
        return res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
        if (error.status === 400) {
        return res.status(400).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export async function resetPasswordController(req, res) {
    const { token, email, newPassword } = req.body || {};
    if (!token || !email || !newPassword) {
        return res.status(400).json({ error: 'email, token and newPassword are required' });
    }

    try {
        await resetPasswordService({ token, email, newPassword });

        // Clear refresh token cookie so client must re-authenticate
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || 'Internal server error' });
    }
};
