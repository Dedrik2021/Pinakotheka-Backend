import createHttpError from 'http-errors';

import MessageModel from '../models/messageModel.js';

export const createMessage = async ({ userId, authorId, message }) => {

	if (!userId) throw createHttpError.BadRequest('UserId is required');
    if (!authorId) throw createHttpError.BadRequest('AuthorId is required');
    if (!message) throw createHttpError.BadRequest('Message is required');

	const product = await new MessageModel({
        userId,
        authorId,
        message
    }).save();

	return product;
};
