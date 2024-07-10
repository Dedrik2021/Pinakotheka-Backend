import createHttpError from 'http-errors';

import { createUser, signUser, verifyToken, passwordForgot } from '../services/auth.service.js';
import { generateToken } from '../services/token.service.js';
import { findUser } from '../services/user.service.js';

export const register = async (req, res, next) => {
	try {
		const { name, email, picture, phone, author, customer, politics, password } = req.body;
		const newUser = await createUser({
			name,
			email,
			picture,
			phone,
			author,
			customer,
			politics,
			password,
		});

		const access_token = await generateToken(
			{ userId: newUser._id },
			'7d',
			process.env.ACCESS_TOKEN,
		);
		const refresh_token = await generateToken(
			{ userId: newUser._id },
			'30d',
			process.env.REFRESH_TOKEN,
		);

		res.cookie('refreshtoken', refresh_token, {
			httpOnly: true,
			path: '/api/v1/auth/refreshtoken',
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		res.status(201).json({
			message: 'register successfully',
			access_token,
			user: {
				_id: newUser._id,
				name: newUser.name,
				phone: newUser.phone,
				email: newUser.email,
                author: newUser.author,
                customer: newUser.customer,
                politics: newUser.politics,
				picture: newUser.picture,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await signUser(email, password);

		const access_token = await generateToken(
			{ userId: user._id },
			'7d',
			process.env.ACCESS_TOKEN,
		);
		const refresh_token = await generateToken(
			{ userId: user._id },
			'30d',
			process.env.REFRESH_TOKEN,
		);

		res.cookie('refreshtoken', refresh_token, {
			httpOnly: true,
			path: '/api/v1/auth/refreshtoken',
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		res.status(201).json({
			message: 'register successfully',
			access_token,
			user: {
				_id: user._id,
				name: user.name,
				phone: user.phone,
				email: user.email,
                author: user.author,
                customer: user.customer,
                politics: user.politics,
				picture: user.picture,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const logout = async (req, res, next) => {
	try {
		res.clearCookie('refreshtoken', { path: '/api/v1/auth/refreshtoken' });
		res.status(201).json({
			message: 'Logged out.',
		});
	} catch (error) {
		next(error);
	}
};

export const refreshToken = async (req, res, next) => {
	try {
		const refresh_token = req.cookies.refreshtoken;
		if (!refresh_token) throw createHttpError.Unauthorized('Please login');

		const check = await verifyToken(refresh_token, process.env.REFRESH_TOKEN);

		const user = await findUser(check.userId);

		const access_token = await generateToken(
			{ userId: user._id },
			'7d',
			process.env.ACCESS_TOKEN,
		);

		res.status(201).json({
			access_token,
			user: {
				_id: user._id,
				name: user.name,
				phone: newUser.phone,
				email: user.email,
                author: user.author,
                customer: user.customer,
                politics: user.politics,
				picture: user.picture,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await passwordForgot(email);
        res.status(201).json({ email: user.email });
    } catch (error) {
        next(error);
    }
};

export const testAuthMiddleware = async (req, res) => {
	res.status(201).json(req.user);
};
