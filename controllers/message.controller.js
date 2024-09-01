import MessageModel from "../models/messageModel.js"
import { createMessage } from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { message, authorId, userId, chatId } = req.body
        const newMessage = await createMessage({ message, authorId, userId, chatId });

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
                { userId }
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