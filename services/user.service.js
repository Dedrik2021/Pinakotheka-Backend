import createHttpError from "http-errors";

import UserModel from '../models/index.js';

export const findUser = async (userId) => {
    const user = await UserModel.findById(userId);

    return user
}