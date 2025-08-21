import { Router } from 'express';
import {
	registerUserController,
	loginController,
	refreshTokenController,
	logoutController,
	forgotPasswordController,
	resetPasswordController,
} from '../controllers/authController.js';

const router = Router();

// POST /api/auth/register
router.post('/register', registerUserController);

// POST /api/auth/login
router.post('/login', loginController);

// POST /api/auth/refresh
router.post('/refresh', refreshTokenController);

// POST /api/auth/logout
router.post('/logout', logoutController);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordController);

// POST /api/auth/reset-password
router.post('/reset-password', resetPasswordController);

export default router;
