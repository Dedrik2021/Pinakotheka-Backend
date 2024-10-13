import logger from '../configs/logger.config.js';
import {
	createMessage,
	populateMessage,
	getConvoMessages,
} from '../services/messageConvo.service.js';
import { updatedLatestMessage } from '../services/conversation.service.js';
import UserModel from '../models/userModel.js';

export const send_message = async (req, res, next) => {
	try {
		const user_id = req.user.userId;
		const { message, convo_id, receiver_id } = req.body;

		if (!convo_id || !message) {
			logger.error('Please provider a conversation id and message body');
			res.sendStatus(400);
		}
		await UserModel.updateOne(
			{ _id: receiver_id },
			{ $inc: { [`unreadMessages.${user_id}`]: 1 } },
		);

		const newMsgData = {
			sender: user_id,
			message,
			conversation: convo_id,
		};

		let newMessage = await createMessage(newMsgData);
		let populatedMessage = await populateMessage(newMessage._id);
		await updatedLatestMessage(convo_id, newMessage);
		res.json(populatedMessage);
	} catch (error) {
		next(error);
	}
};

export const get_messages = async (req, res, next) => {
	try {
		const { convo_id } = req.params;
		if (!convo_id) {
			logger.error('Please add a conversation id in params');
			res.sendStatus(400);
		}
		const messages = await getConvoMessages(convo_id);
		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};
