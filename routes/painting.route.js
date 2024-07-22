import express from 'express'
import trimRequest from 'trim-request'

import { add_painting, get_paintings, get_painting_by_id, get_paintings_by_author_id } from '../controllers/painting.controller.js'

const router = express.Router()

router.route('/add-painting').post(trimRequest.all, add_painting)
router.route('/get-all-paintings').get(trimRequest.all, get_paintings)
router.route('/get-author-paintings').get(trimRequest.all, get_paintings_by_author_id)
router.route('/get-by-id-painting').get(trimRequest.all, get_painting_by_id)

export default router