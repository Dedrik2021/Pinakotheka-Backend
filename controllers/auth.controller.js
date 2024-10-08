import createHttpError from 'http-errors';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

import {
	createUser,
	signUser,
	verifyToken,
	passwordForgot,
	removeUnreadMessage,
} from '../services/auth.service.js';
import { generateToken } from '../services/token.service.js';
import { findUser } from '../services/user.service.js';
import PasswordResetToken from '../models/passwordResetTokenModel.js';
import { generateRandomByte } from '../utils/helper.js';
import { transport } from '../utils/mail.js';
import UserModel from '../models/index.js';
import logger from '../configs/logger.config.js';

const email_service = process.env.EMAIL;

export const register = async (req, res, next) => {
	try {
		const { name, email, image, phone, author, customer, politics, password } = req.body;

		const emailVerificationToken = crypto.randomBytes(32).toString('hex');
		const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 1 day

		const newUser = await createUser({
			name,
			email,
			image,
			phone,
			author,
			customer,
			politics,
			password,
			emailVerificationExpires,
			emailVerificationToken,
		});

		const emailVerificationLink = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}&id=${newUser._id}`;

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

		transport.sendMail({
			from: `Pinakotheka <${email_service}>`,
			to: newUser.email,
			subject: 'Email Verification Link',
			html: ` 
            <p>Thank you for registering with Pinakotheka. Please click the link below to verify your email address:</p>
            <a href="${emailVerificationLink}">Verify Email</a>
        `,
		});

		res.status(201).json({
			message: 'Registration successful. Please check your email for verification link.',
			access_token,
			user: {
				_id: newUser._id,
				name: newUser.name,
				phone: newUser.phone,
				email: newUser.email,
				author: newUser.author,
				customer: newUser.customer,
				politics: newUser.politics,
				image: newUser.image,
				isEmailVerified: newUser.isEmailVerified,
				token: '',
				categories: newUser.categories,
				rating: newUser.rating,
				path: newUser.path,
				about: newUser.about,
				facebook: newUser.facebook,
				twitter: newUser.twitter,
				instagram: newUser.instagram,
				unreadMessages: newUser.unreadMessages,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const getUsers = async (req, res, next) => {
	try {
		const users = await UserModel.find().sort({ createdAt: -1 });
		if (!users) throw createHttpError.NotFound('No users.');
		res.status(201).json(users);
	} catch (error) {
		next(error);
	}
};

export const refreshUser = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const user = await UserModel.findById(userId);
		if (!user) throw createHttpError.NotFound('No user.');

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
				isEmailVerified: user.isEmailVerified,
				token: access_token,
				rating: user.rating,
				path: user.path,
				about: user.about,
				facebook: user.facebook,
				twitter: user.twitter,
				instagram: user.instagram,
				unreadMessages: user.unreadMessages,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const verifyEmail = async (req, res, next) => {
	try {
		const { token, id } = req.query;

		if (!token || !id) {
			throw createHttpError.BadRequest('Invalid request');
		}

		const user = await UserModel.findById(id);
		if (!user) {
			throw createHttpError.NotFound('User not found');
		}

		if (user.emailVerificationToken !== token || user.emailVerificationExpires < Date.now()) {
			throw createHttpError.BadRequest('Invalid or expired token');
		}

		user.emailVerificationToken = undefined;
		user.emailVerificationExpires = undefined;
		user.isEmailVerified = true;
		await user.save();

		transport.sendMail({
			from: `Pinakotheka <${email_service}>`,
			to: user.email,
			subject: 'Email Verified',
			html: 'Thank you. Your email has been verified successfully',
		});

		res.status(200).json({ message: 'Email verified successfully' });
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
				isEmailVerified: user.isEmailVerified,
				token: access_token,
				rating: user.rating,
				path: user.path,
				about: user.about,
				facebook: user.facebook,
				twitter: user.twitter,
				instagram: user.instagram,
				unreadMessages: user.unreadMessages,
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
				phone: user.phone,
				email: user.email,
				author: user.author,
				customer: user.customer,
				token: access_token,
				politics: user.politics,
				picture: user.picture,
				isEmailVerified: user.isEmailVerified,
				rating: user.rating,
				path: user.path,
				about: user.about,
				facebook: user.facebook,
				twitter: user.twitter,
				instagram: user.instagram,
				unreadMessages: user.unreadMessages,
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

		const access_token = await generateToken(
			{ userId: user._id },
			'7d',
			process.env.ACCESS_TOKEN,
		);

		const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
		if (alreadyHasToken)
			throw createHttpError.BadRequest(
				'Only after one hour you can request for another token!',
			);

		const token = await generateRandomByte();
		const newPasswordResetToken = await PasswordResetToken({ owner: user._id, token });
		await newPasswordResetToken.save();

		const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user._id}`;

		transport.sendMail({
			from: `Pinakotheka <${email_service}>`,
			to: user.email,
			subject: 'Reset Password Link',
			html: `
            <p>Click here to reset Password</p>
            <a href='${resetPasswordUrl}'>Change Password</a>
        `,
		});

		res.status(201).json({
			message: 'Link sent to your email!',
			access_token,
			user: {
				_id: user._id,
				name: user.name,
				phone: user.phone,
				email: user.email,
				author: user.author,
				customer: user.customer,
				token: '',
				politics: user.politics,
				picture: user.picture,
				isEmailVerified: user.isEmailVerified,
				rating: user.rating,
				path: user.path,
				about: user.about,
				facebook: user.facebook,
				twitter: user.twitter,
				instagram: user.instagram,
				unreadMessages: user.unreadMessages,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const resetPassword = async (req, res, next) => {
	try {
		const { newPassword, userId, token } = req.body;

		if (!newPassword) throw createHttpError.BadRequest('Password is required!');

		const user = await UserModel.findById(userId);
		if (!user) throw createHttpError.NotFound('User not found!');

		const matched = await user.comparePassword(newPassword);

		if (matched)
			throw createHttpError.BadRequest(
				'The new password must be different from the old one!',
			);

		const resetToken = await PasswordResetToken.findOne({ owner: user._id });

		const resetTokenMatched = await resetToken.compareToken(token);
		if (!resetTokenMatched)
			throw createHttpError.BadRequest('Invalid or expired password reset token!');

		user.password = newPassword;
		await user.save();

		const access_token = await generateToken(
			{ userId: user._id },
			'7d',
			process.env.ACCESS_TOKEN,
		);

		transport.sendMail({
			from: `Pinakotheka <${email_service}>`,
			to: user.email,
			subject: 'Password reset successfully!',
			html: `
			<h1>Your password has been reset successfully</h1>
			<p>Now you can use new password!</p>
            `,
		});

		await PasswordResetToken.findOneAndDelete({ token: resetToken.token });

		res.status(201).json({
			message: 'Password reset successfully! Now you can use new password!',
			access_token,
			user: {
				_id: user._id,
				name: user.name,
				phone: user.phone,
				email: user.email,
				author: user.author,
				customer: user.customer,
				token: '',
				politics: user.politics,
				picture: user.picture,
				isEmailVerified: user.isEmailVerified,
				rating: user.rating,
				path: user.path,
				about: user.about,
				facebook: user.facebook,
				twitter: user.twitter,
				instagram: user.instagram,
				unreadMessages: user.unreadMessages,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const testAuthMiddleware = async (req, res) => {
	res.status(201).json(req.user);
};

export const get_author_by_id = async (req, res, next) => {
	try {
		const { authorId } = req.params;

		if (!authorId) {
			throw createHttpError.BadRequest('AuthorId is missing');
		}
		const author = await UserModel.findById(authorId);
		res.status(201).json(author);
	} catch (error) {
		next(error);
	}
};

export const updateUnreadMessages = async (req, res, next) => {
	try {
		const { userId, senderId } = req.params;
		console.log('........................', userId, senderId);
		const user = await removeUnreadMessage(userId, senderId);

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
				phone: user.phone,
				email: user.email,
				author: user.author,
				customer: user.customer,
				token: '',
				politics: user.politics,
				picture: user.picture,
				isEmailVerified: user.isEmailVerified,
				rating: user.rating,
				path: user.path,
				about: user.about,
				facebook: user.facebook,
				twitter: user.twitter,
				instagram: user.instagram,
				unreadMessages: user.unreadMessages,
			},
		});
	} catch (error) {
		next(error);
	}
};
