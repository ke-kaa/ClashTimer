import { verifyAccessToken } from '../utils/tokenUtil.js';
import { config } from '../config/config.js';

// Extracts Bearer token from Authorization header or cookie named 'access_token'
function getTokenFromRequest(req) {
	const auth = req.headers['authorization'] || req.headers['Authorization'];
	if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
		return auth.slice(7).trim();
	}
	if (req.cookies && req.cookies.access_token) {
		return req.cookies.access_token;
	}
	return null;
}

export function optionalAuth(req, res, next) {
	const token = getTokenFromRequest(req);
	if (!token) return next();
	try {
		const decoded = verifyAccessToken(token);
		req.user = { id: decoded.sub, role: decoded.role };
	} catch (e) {
		// Ignore invalid token for optional auth
	}
	return next();
}

export function requireAuth(req, res, next) {
	const token = getTokenFromRequest(req);
	if (!token) {
		return res.status(401).json({ error: 'Authentication required' });}
	try {
		const decoded = verifyAccessToken(token);
		req.user = { id: decoded.sub, role: decoded.role };
		return next();
	} catch (e) {
		// More helpful diagnostics in non-production
		if (config.env !== 'production') {
			if (e.name === 'TokenExpiredError') {
				return res.status(401).json({ error: 'Token expired', expiredAt: e.expiredAt });
			}
			if (e.name === 'JsonWebTokenError') {
				return res.status(401).json({ error: 'Invalid token', message: e.message });
			}
			return res.status(401).json({ error: 'Invalid or expired token', message: e.message });
		}
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
}

export function requireRole(roles = []) {
	const allowed = Array.isArray(roles) ? roles : [roles];
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'Authentication required' });
		if (allowed.length && !allowed.includes(req.user.role)) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		next();
	};
}

