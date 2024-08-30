import express from 'express'
import trimRequest from 'trim-request'

import { get_products, add_product, delete_product } from '../controllers/product.controller.js'

const router = express.Router()

router.route('/add-product').post(trimRequest.all, add_product)
router.route('/get-products/:userId').get(trimRequest.all, get_products)
router.route('/delete-product/:productId').delete(trimRequest.all, delete_product)

export default router