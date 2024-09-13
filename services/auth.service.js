import createHttpError from 'http-errors';
import validator from 'validator';
import bcrypt from 'bcrypt';

import UserModel from '../models/index.js';
import { verify } from '../utils/token.utils.js';

const { DEFAULT_PICTURE } = process.env;

export const createUser = async ({
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
}) => {
	if (!author && !customer && !name && !phone && !email && !politics && !password)
		throw createHttpError.BadRequest('All fields are required');

	if (!customer) {
		if (!author) {
			throw createHttpError.BadRequest('You must be an author or a customer');
		}
	}

	if (!name) throw createHttpError.BadRequest('Name is required');

	if (!validator.isLength(name, { min: 2, max: 16 })) {
		throw createHttpError.BadRequest('Name must be between 2 and 16 characters');
	}

	if (!phone) throw createHttpError.BadRequest('Phone is required');
	if (!validator.isLength(phone, { min: 9, max: 9 })) {
		throw createHttpError.BadRequest('Phone number must be 9 characters long');
	}

	if (!email) throw createHttpError.BadRequest('Email is required');
	if (!validator.isEmail(email)) {
		throw createHttpError.BadRequest('Invalid Email');
	}
	const existingUser = await UserModel.findOne({ email });
	if (existingUser) {
		throw createHttpError.Conflict(`Email ${email} already exists`);
	}

	if (!password) throw createHttpError.BadRequest('Password is required');
	if (!validator.isLength(password, { min: 6, max: 20 })) {
		throw createHttpError.BadRequest('Password must be between 6 and 20 characters');
	}

	if (!politics) {
		throw createHttpError.BadRequest('You must agree with our privacy policy');
	}

	const user = await new UserModel({
		name,
		email,
		image: image || DEFAULT_PICTURE,
		phone,
		author,
		customer,
		politics,
		password,
		about: `Hi this is ${name}`,
		path: '/single-user/',
		categories: 'User',
		rating: 0,
		emailVerificationExpires,
		emailVerificationToken,
		facebook: '',
		twitter: '',
		instagram: '',
	}).save();

	return user;
};

export const signUser = async (email, password) => {
	if (!email && !password) throw createHttpError.BadRequest('All fields are required');

	if (!email) throw createHttpError.BadRequest('Email is required');

	const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
	if (!user) throw createHttpError.NotFound('Invalid Email');

	if (!password) throw createHttpError.BadRequest('Password is required');

	const passwordMatches = await bcrypt.compare(password, user.password);
	if (!passwordMatches) throw createHttpError.NotFound('Invalid Password');

	if (!user.isEmailVerified) throw createHttpError.BadRequest('Please verify your email');

	return user;
};

export const passwordForgot = async (email) => {
	if (!email) throw createHttpError.BadRequest('Email is required');
	const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
	if (!user) throw createHttpError.NotFound('Invalid Email');
	return user;
};

export const verifyToken = async (token, secret) => {
	return await verify(token, secret);
};

export const removeUnreadMessage = async (userId, messageIdToRemove) => {
	try {
		// Use the $unset operator to remove the specific key from unreadMessages
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ $unset: { [`unreadMessages.${messageIdToRemove}`]: 1 } }, // Dynamically remove the messageId
			{ new: true }, // Return the updated document
		);

		return updatedUser; // Return the updated user object
	} catch (error) {
		console.error('Error removing unread message:', error);
		throw error;
	}
};
