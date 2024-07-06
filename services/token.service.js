import { sign } from '../utils/token.utils.js';

export const generateToken = async (payload, expiresIn, secret) => {
    return sign(payload, expiresIn, secret);
}