import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from './app.js';
import logger from '../configs/logger.config.js';

dotenv.config();
const { DATABASE_URL } = process.env;

const PORT = process.env.PORT || 8080;
let server;

if (process.env.NODE_ENV !== 'production') {
	mongoose.set('debug', true);
}

mongoose
	.connect(DATABASE_URL)
	.then(() => {
		logger.info('Database connected');
	})
	.catch((err) => {
		logger.error(err);
		process.exit(1);
	});

server = app.listen(PORT, () => {
	logger.info(`Server is running on port http://localhost:${PORT}`);
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	if (server) {
		logger.info('SIGTERM received');
		process.exit(1);
	}
});
