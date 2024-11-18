import asyncWrapper from '../../core/utils/asyncWrapper.util';
import { Response } from 'express';
import * as UserService from './user.service';
import httpStatus from 'http-status';
import { IGetUserRequest } from '../../core/interfaces/user-request.interface';
import { IChangePassword } from './user.interface';
import { saveFile } from '../../core/utils/file.util';

export const getProfile = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const user = await UserService.getUserProfile(userId);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'User profiled fetched successfully',
		data: user,
	});
});

export const changePassword = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const body: IChangePassword = req.body;
	await UserService.updatePassword(userId, body);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'Password updated successfully',
	});
});

export const updateAvatar = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const { avatar } = req.files as { avatar: Express.Multer.File[] };
	const data = await saveFile(avatar, 'avatars');
	const user = await UserService.updateUserAvatar(userId, data[0]);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'Avatar updated successfully',
		data: user,
	});
});

export const updateProfile = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const body = req.body;
	const user = await UserService.updateUserProfile(userId, body);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'Profile updated successfully',
		data: user,
	});
});

export const searchContacts = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const { searchTerm } = req.params;

	const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regex = new RegExp(sanitizedSearchTerm, 'i');
	const users = await UserService.searchUsers(userId, regex);
	res.status(200).json({
		ok: true,
		message: 'Searched users fetched successfully',
		data: users,
	});
});

export const handleGetContactsFromDMList = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const users = await UserService.getUsersFromDMList(userId);
	res.status(200).json({
		ok: true,
		message: 'Contacts fetched successfully',
		data: users,
	});
});
