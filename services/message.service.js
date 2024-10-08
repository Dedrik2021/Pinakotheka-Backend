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

export const deleteMessagesByUser = async (userId, authorId) => {
    try {
        const result = await MessageModel.deleteMany({
            userId,
            authorId
        });

        console.log(`${result.deletedCount} messages deleted after 24 hours.`);
    } catch (error) {
        console.error('Error deleting messages:', error);
    }
};

export const updateDeletedMessagesByUser = async (userId, authorId) => {
    try {
        const result = await MessageModel.updateMany({
            userId,
            authorId
        }, { $set: { message: 'This message has been deleted' } } );

        console.log(`${result.deletedCount} messages deleted after 24 hours.`);
    } catch (error) {
        console.error('Error deleting messages:', error);
    }
};
