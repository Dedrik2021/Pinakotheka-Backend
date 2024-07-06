import createHttpError from 'http-errors';
import validator from 'validator';

import { UserModel } from '../models/index.js';

const { DEFAULT_PICTURE } = process.env;

export const createUser = async ({ name, email, picture, password }) => {
	if (!name || !email || !password) {
		throw createHttpError.BadRequest('All fields are required');
	}

    if (!validator.isLength(name, { min: 2, max: 16 })) {
		throw createHttpError.BadRequest('Name must be between 2 and 16 characters');
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

	const user = await new UserModel({
		name,
		email,
		picture: picture || DEFAULT_PICTURE,
		password,
	}).save();

	return user;
};
