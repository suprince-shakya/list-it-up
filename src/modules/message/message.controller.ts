import asyncWrapper from '../../core/utils/asyncWrapper.util';
import { Response } from 'express';
import { IGetUserRequest } from '../../core/interfaces/user-request.interface';
import httpStatus from 'http-status';
import * as MessageService from './message.service';

export const handleGetMessages = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const user1 = req.userId;
	const user2 = req.params.userId;

	const messages = await MessageService.getMessages(user1, user2);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'Messages fetched successfully',
		data: messages,
	});
});
