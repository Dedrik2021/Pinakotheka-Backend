import MessageModel from '../models/messageModel.js';
import { createMessage, deleteMessagesByUser, updateDeletedMessagesByUser } from '../services/message.service.js';
import UserModel from '../models/userModel.js';
import { io } from '../src/index.js';

export const sendMessage = async (req, res, next) => {
	try {
		const { message, authorId, userId } = req.body;
		const newMessage = await createMessage({ message, authorId, userId });

		await UserModel.updateOne({ _id: authorId }, { $inc: { [`unreadMessages.${userId}`]: 1 } });
		io.to(authorId).emit('newMessage', { userId });

		res.status(201).json(newMessage);
	} catch (error) {
		next(error);
	}
};

export const getMessagesByUserId = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const messages = await MessageModel.find({
			$or: [{ userId }, { authorId: userId }],
		}).sort({ createdAt: 1 });
		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const getMessagesByUserIdAndAuthorId = async (req, res, next) => {
	try {
		const { userId, authorId } = req.params;
		const messages = await MessageModel.find({
			$or: [
				{ userId, authorId },
				{ userId: authorId, authorId: userId },
			],
		}).sort({ createdAt: 1 });
		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const updateAndRemoveDeletedMessageById = async (req, res, next) => {
	try {
		const { messageId } = req.params;

		let message = await MessageModel.findById(messageId);
		if (!message) {
			return res.status(404).json({ error: 'Message not found' });
		}

		message.message = 'This message has been deleted';
		await message.save();

		res.status(200).json(message);
		setTimeout(async () => {
			await MessageModel.findByIdAndDelete(messageId);
		}, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
	} catch (error) {
		next(error);
	}
};

export const deleteConversationByUserIdAndAuthorId = async (req, res, next) => {
	try {
		const { userId, authorId } = req.params;

		const result = await updateDeletedMessagesByUser(userId, authorId);

		const deleteAfter = 24 * 60 * 60 * 1000;
		setTimeout(async () => {
			await deleteMessagesByUser(userId, authorId);
		}, deleteAfter);

		res.status(200).json({
			message: `${result.modifiedCount} messages deleted.`,
		});
	} catch (error) {
		next(error);
	}
};
