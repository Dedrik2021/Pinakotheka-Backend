import express from 'express'
import trimRequest from 'trim-request'

import { sendMessage, getMessagesByUserId, getMessagesByUserIdAndAuthorId, updateAndRemoveDeletedMessageById, deleteConversationByUserIdAndAuthorId } from '../controllers/message.controller.js'

const router = express.Router()

router.route('/create-message').post(trimRequest.all, sendMessage)
router.route('/get-messages-by-user-id/:userId').get(trimRequest.all, getMessagesByUserId)
router.route('/get-messages-by-user-and-author-id/:userId/:authorId').get(trimRequest.all, getMessagesByUserIdAndAuthorId)
router.route('/update-and-remove-deleted-message-by-id/:messageId').put(trimRequest.all, updateAndRemoveDeletedMessageById)
router.route('/delete-conversation/:userId/:authorId').put(trimRequest.all, deleteConversationByUserIdAndAuthorId)

export default router