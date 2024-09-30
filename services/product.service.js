import createHttpError from 'http-errors';

import ProductModel from '../models/productModel.js';

export const addProduct = async ({ userId, authorId, productId }) => {

	if (!userId) throw createHttpError.BadRequest('UserId is required');
    if (!authorId) throw createHttpError.BadRequest('AuthorId is required');
    if (!productId) throw createHttpError.BadRequest('ProductId is required');

	const product = await new ProductModel({
        userId,
        authorId,
        productId
    }).save();

	return product;
};
