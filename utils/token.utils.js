import jwt from 'jsonwebtoken';

import logger from '../configs/logger.config.js';

export const sign = async (payload, expiresIn, secret) => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, secret, { expiresIn }, (err, token) => {
			if (err) {
				logger.error(err);
				reject(err);
			} else {
				resolve(token);
			}
		});
	});
};
