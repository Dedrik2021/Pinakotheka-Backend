import createHttpError from 'http-errors';
import dotenv from 'dotenv';
import { isValidObjectId } from 'mongoose';
dotenv.config();

import { createUser, signUser, verifyToken, passwordForgot } from '../services/auth.service.js';
import { generateToken } from '../services/token.service.js';
import { findUser } from '../services/user.service.js';
import PasswordResetToken from '../models/passwordResetTokenModel.js';
import { generateRandomByte } from '../utils/helper.js';
import { transport } from '../utils/mail.js';
import UserModel from '../models/index.js';

const email_service = process.env.EMAIL;

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

        // transport.sendMail({
		// 	from: `Pinakotheka <${email_service}>`,
		// 	to: user.email,
		// 	subject: 'Reset Password Link',
		// 	html: ` 
        //     <p>Thank you for registering with Pinakotheka</p>
        // `,
		// });

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

		const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
		if (alreadyHasToken)
			throw createHttpError.BadRequest(
				'Only after one hour you can request for another token!',
			);

		const token = await generateRandomByte();
		const newPasswordResetToken = await PasswordResetToken({ owner: user._id, token });
		await newPasswordResetToken.save();

		const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

		transport.sendMail({
			from: `Pinakotheka <${email_service}>`,
			to: user.email,
			subject: 'Reset Password Link',
			html: `
            <p>Click here to reset Password</p>
            <a href='${resetPasswordUrl}'>Change Password</a>
        `,
		});

		res.status(201).json({ message: 'Link sent to your email!' });
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
    if (!resetTokenMatched) throw createHttpError.BadRequest('Invalid or expired password reset token!');

    user.password = newPassword;
    await user.save();
        
	await PasswordResetToken.findOneAndDelete({token: resetToken.token});

		// transport.sendMail({
		// 	from: `Pinakotheka <${email_service}>`,
		// 	to: user.email,
		// 	subject: 'Password reset successfully!',
		// 	html: `
        //         <h1>Password Reset Successfully</h1>
        //         <p>Now You Can Use New Password!</p>
        //     `,
		// });

		res.status(201).json({
			message: 'Password Reset Successfully! Now You Can Use New Password!',
		});
	} catch (error) {
		next(error);
	}
};

export const testAuthMiddleware = async (req, res) => {
	res.status(201).json(req.user);
};
