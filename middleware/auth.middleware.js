import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose"

import PasswordResetToken from "../models/passwordResetTokenModel.js";

export const authMiddleware = async (req, res, next) => {
    const bearerToken = req.headers.authorization
    if (!bearerToken) return next(createHttpError.Unauthorized())

    const token = bearerToken.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
        if (err) return next(createHttpError.Unauthorized())
        req.user = payload
        next()
    })
}

export const isValidPassResetToken = async (req, res, next) => {
    const {token, userId} = req.body

    console.log(req.body);

    if (!token.trim() || !isValidObjectId(userId)) throw createHttpError.BadRequest('Invalid request!')

    const resetToken = await PasswordResetToken.findOne({owner: userId})
    if (!resetToken) throw createHttpError.Unauthorized('Unauthorized access, invalid request!')

    const matched = await resetToken.compareToken(token)
    if (!matched) throw createHttpError.Unauthorized('Unauthorized access, invalid request!')

    req.resetToken = resetToken

    next()
}