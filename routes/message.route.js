import express from 'express'
import trimRequest from 'trim-request'

import { sendMessage, getMessagesByUserId, getMessagesByUserIdAndAuthorId } from '../controllers/message.controller.js'

const router = express.Router()

router.route('/create-message').post(trimRequest.all, sendMessage)
router.route('/get-messages-by-user-id/:userId').get(trimRequest.all, getMessagesByUserId)
router.route('/get-messages-by-user-and-author-id/:userId/:authorId').get(trimRequest.all, getMessagesByUserIdAndAuthorId)

export default router