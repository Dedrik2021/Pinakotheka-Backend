import MessageModel from "../models/messageModel.js"
import { createMessage } from "../services/message.service.js";
import UserModel from "../models/userModel.js";
import { io } from "../src/index.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { message, authorId, userId } = req.body
        const newMessage = await createMessage({ message, authorId, userId });

        await UserModel.updateOne({ _id: authorId }, { $inc: { [`unreadMessages.${userId}`]: 1 } })
        io.to(authorId).emit('newMessage', { userId });

        res.status(201).json(newMessage)
    } catch (error) {
        next(error)
    }
}

export const getMessagesByUserId = async (req, res, next) => {
    
    try {
        const {userId } = req.params
        const messages = await MessageModel.find({
            $or: [
                { userId },
                { authorId: userId }
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json(messages)
    } catch (error) {
        next(error)
    }
}

export const getMessagesByUserIdAndAuthorId = async (req, res, next) => {
    
    try {
        const { userId, authorId } = req.params
        const messages = await MessageModel.find({
            $or: [
                { userId, authorId },
                { userId: authorId, authorId: userId }
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json(messages)
    } catch (error) {
        next(error)
    }
}