import createHttpError from 'http-errors';
import validator from 'validator';
import bcrypt from 'bcrypt';

import UserModel from '../models/index.js';
import { verify } from '../utils/token.utils.js';

const { DEFAULT_PICTURE } = process.env;

export const createUser = async ({
	name,
	email,
	picture,
	phone,
	author,
	customer,
	politics,
	password,
}) => {
	if (!customer) {
        if (!author) {
            throw createHttpError.BadRequest('You must be an author or a customer');
        }
	}

	// if (!name || !email || !password || !phone) {
	// 	throw createHttpError.BadRequest('Name, email, phone and password are required');
	// }

    if (!name) throw createHttpError.BadRequest('Name is required');
    if (!phone) throw createHttpError.BadRequest('Phone is required');
    if (!email) throw createHttpError.BadRequest('Email is required');
    if (!password) throw createHttpError.BadRequest('Password is required');

	if (!validator.isLength(name, { min: 2, max: 16 })) {
		throw createHttpError.BadRequest('Name must be between 2 and 16 characters');
	}

    if (!validator.isLength(phone, { min: 9, max: 9 })) {
        throw createHttpError.BadRequest('Phone number must be 9 characters long');
    }

	if (!validator.isEmail(email)) {
		throw createHttpError.BadRequest('Invalid email');
	}

	const existingUser = await UserModel.findOne({ email });
	if (existingUser) {
		throw createHttpError.Conflict(`${email} already exists`);
	}

	if (!validator.isLength(password, { min: 6, max: 20 })) {
		throw createHttpError.BadRequest('Password must be between 6 and 20 characters');
	}

    if (!politics) {
        throw createHttpError.BadRequest('You must agree with our privacy policy');
    }


	const user = await new UserModel({
		name,
		email,
		picture: picture || DEFAULT_PICTURE,
		phone,
		author,
		customer,
		politics,
		password,
	}).save();

	return user;
};

export const signUser = async (email, password) => {
	const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
	if (!user) throw createHttpError.NotFound('Invalid credentials.');

	const passwordMatches = await bcrypt.compare(password, user.password);
	if (!passwordMatches) throw createHttpError.NotFound('Invalid credentials.');

	return user;
};

export const verifyToken = async (token, secret) => {
	return await verify(token, secret);
};
