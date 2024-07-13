import express from 'express';
import trimRequest from 'trim-request';

import {
	register,
	login,
	logout,
	refreshToken,
	testAuthMiddleware,
	forgotPassword,
	resetPassword,
	verifyEmail
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/register').post(trimRequest.all, register);
router.route('/login').post(trimRequest.all, login);
router.route('/logout').post(trimRequest.all, logout);
router.route('/forgot-password').post(trimRequest.all, forgotPassword);
router.route('/reset-password').post(trimRequest.all, resetPassword);
router.route('/verify-email').get(trimRequest.all, verifyEmail);

router.route('/refreshtoken').post(trimRequest.all, refreshToken);
router.route('/testing-auth-middleware').get(trimRequest.all, authMiddleware, testAuthMiddleware);

export default router;
