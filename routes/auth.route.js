import express from 'express'
import trimRequest from 'trim-request'

import { register, login, logout, refreshToken, testAuthMiddleware, forgotPassword } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route("/register").post(trimRequest.all, register)
router.route("/login").post(trimRequest.all, login)
router.route("/logout").post(trimRequest.all, logout)
router.route("/forgot-password").post(trimRequest.all, forgotPassword)
router.route("/refreshtoken").post(trimRequest.all, refreshToken)
router.route("/testing-auth-middleware").get(trimRequest.all, authMiddleware, testAuthMiddleware)

export default router