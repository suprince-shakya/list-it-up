import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/error.util';
import httpStatus from 'http-status';
import { IToken, verifyToken } from '../utils/jwt.util';
import { IGetUserRequest } from '../interfaces/user-request.interface';
import asyncWrapper from '../utils/asyncWrapper.util';

export const isAuthenticated = asyncWrapper(async (req: IGetUserRequest, res: Response, next: NextFunction) => {
	const bearerToken = req.headers['authorization'];
	if (!bearerToken) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
	}
	try {
		const token = bearerToken.split(' ')[1];
		const payload: IToken = await verifyToken(token);
		req['userId'] = payload.userId;
		next();
	} catch (e) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
	}
});
