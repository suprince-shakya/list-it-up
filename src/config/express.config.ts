import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoute from '../modules/auth/auth.route';
import userRoute from '../modules/users/user.route';
import messageRoute from '../modules/message/message.route';
import shoppingListRoute from '../modules/shopping-list/shopping.route';
import http from 'http';
import errorHandlerUtil from '../core/utils/error-handler.util';
import errorHandling from '../core/middleware/errorHandling.middleware';
import { corsOption } from './cors.config';
import { setUpSocket } from './socket.config';
import { setupRedisClient } from './redis.config';
import * as path from 'path';

const app: Application = express();
const databaseURL = process.env.DATABASE_URI;

// Specifying public path
const publicPath = path.join(__dirname, '../', '../', 'public');
app.use(express.static(publicPath));

// Registering Middlewares
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(errorHandling);

// Defining routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/message', messageRoute);
app.use('/api/shopping-list', shoppingListRoute);

// Mongoose connection
mongoose
	.connect(databaseURL)
	.then(() => {
		console.log(`DB Connected successfully`);
	})
	.catch((err) => {
		console.error(err.message);
	});

const server = http.createServer(app);
setUpSocket(server);

setupRedisClient();

const exitHandler = (): void => {
	if (app) {
		server.close(() => {
			console.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: Error): void => {
	errorHandlerUtil.handleError(error);
	if (!errorHandlerUtil.isTrustedError(error)) {
		exitHandler();
	}
};

process.on('uncaughtException', unexpectedErrorHandler);

process.on('unhandledRejection', (reason: Error) => {
	console.error('Unhandled rejection !!!!!!');
	throw reason;
});

export default server;
