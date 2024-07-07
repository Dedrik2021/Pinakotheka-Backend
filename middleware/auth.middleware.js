import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

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