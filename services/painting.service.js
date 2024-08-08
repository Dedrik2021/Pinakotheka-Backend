import createHttpError from 'http-errors';
import validator from 'validator';

import PaintingModel from '../models/paintingModel.js';

export const createPainting = async ({
	authorId,
	name,
	description,
	price,
	image,
	material,
    authorName,
	style,
	sale,
	category,
	size,
}) => {
	if (!name && !price && !description && !image && !material && !size)
		throw createHttpError.BadRequest(
			'Title, price, description, image, material, style, size fields are required',
		);

	if (!name) throw createHttpError.BadRequest('Title is required');

	if (!validator.isLength(name, { min: 2 })) {
		throw createHttpError.BadRequest('Title must be from 2 characters long');
	}

	if (!description) throw createHttpError.BadRequest('Description is required');
	if (!validator.isLength(description, { min: 20 })) {
		throw createHttpError.BadRequest('Description must be from 20 characters long');
	}

	if (!category) throw createHttpError.BadRequest('category is required');
	if (!price) throw createHttpError.BadRequest('Price is required');
	if (!image) throw createHttpError.BadRequest('Image is required');
	if (!material) throw createHttpError.BadRequest('Material is required');
	if (!style) throw createHttpError.BadRequest('Style is required');
	if (!size) throw createHttpError.BadRequest('Size is required');
	
	const painting = await new PaintingModel({
		authorId,
        authorName,
		name,
		description,
		price,
		image,
        path: "/single-art/",
		material,
		category,
		style,
		sale,
		size,
	}).save();

	return painting;
};
