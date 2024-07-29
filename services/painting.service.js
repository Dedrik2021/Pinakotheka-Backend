import createHttpError from 'http-errors';
import validator from 'validator';

import PaintingModel from '../models/paintingModel.js';

export const createPainting = async ({
	authorId,
	title,
	description,
	price,
	image,
	material,
    author,
	style,
	size,
}) => {
	if (!title && !price && !description && !image && !material && !size)
		throw createHttpError.BadRequest(
			'Title, price, description, image, material, style, size fields are required',
		);

	if (!title) throw createHttpError.BadRequest('Title is required');

	if (!validator.isLength(title, { min: 2 })) {
		throw createHttpError.BadRequest('Title must be from 2 characters long');
	}

	if (!description) throw createHttpError.BadRequest('Description is required');
	if (!validator.isLength(description, { min: 20 })) {
		throw createHttpError.BadRequest('Description must be from 20 characters long');
	}

	if (!price) throw createHttpError.BadRequest('Price is required');
	if (!image) throw createHttpError.BadRequest('Image is required');
	if (!material) throw createHttpError.BadRequest('Material is required');
	if (!style) throw createHttpError.BadRequest('Style is required');
	if (!size) throw createHttpError.BadRequest('Size is required');
	
	const painting = await new PaintingModel({
		authorId,
        author,
		title,
		description,
		price,
		image,
        path: "/painting/",
		material,
		style,
		size,
	}).save();

	return painting;
};
