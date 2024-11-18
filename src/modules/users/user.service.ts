import mongoose from 'mongoose';
import AppError from '../../core/utils/error.util';
import User from '../users/user.model';
import httpStatus from 'http-status';
import { IChangePassword, IUser } from './user.interface';
import * as bcryptUtil from '../../core/utils/bcrypt.util';
import { deleteFile } from '../../core/utils/file.util';

export const getUserProfile = async (userId: string) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new AppError(httpStatus.NOT_FOUND, `User with id=${userId} not found`);
		}
		return user;
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};

export const updatePassword = async (userId: string, body: IChangePassword) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new AppError(httpStatus.NOT_FOUND, `User with id=${userId} not found`);
		}

		// Check is oldpassword matches
		if (bcryptUtil.comparePassword(body.oldPassword, user.password)) {
			user.password = body.newPassword;
			await user.save();
			return user;
		} else {
			throw new AppError(httpStatus.BAD_REQUEST, "Old password doesn't match current password");
		}
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};

export const updateUserAvatar = async (userId: string, path: string) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new AppError(httpStatus.NOT_FOUND, `User with id=${userId} not found`);
		}

		if (user.image) {
			deleteFile(user.image);
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				image: path,
			},
			{ new: true, runValidators: true }
		);
		return updatedUser;
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};

export const updateUserProfile = async (userId: string, body: IUser) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new AppError(httpStatus.NOT_FOUND, `User with id=${userId} not found`);
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				firstName: body.firstName,
				lastName: body.lastName,
				contactNumber: body.contactNumber,
				profileSetup: true,
			},
			{ new: true, runValidators: true }
		);
		return updatedUser;
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};

export const searchUsers = async (userId: string, regex: RegExp) => {
	try {
		const users = await User.find({
			$and: [
				{ _id: { $ne: userId } },
				{
					$or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
				},
			],
		});
		return users;
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};

export const getUsersFromDMList = async (userID: string) => {
	const userId = new mongoose.Types.ObjectId(userID);
	try {
		const users = await User.aggregate([
			{
				$match: {
					$or: [{ sender: userId }, { recipient: userId }],
				},
			},
			{
				$sort: { timestamp: -1 },
			},
			{
				$group: {
					_id: {
						$cond: {
							if: { $eq: ['sender', userId] },
							then: '$recipient',
							else: '$sender',
						},
					},
					lastMessageTime: { $first: '$timestamp' },
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: '_id',
					foreignField: '_id',
					as: 'contactInfo',
				},
			},
			{
				$unwind: '$contactInfo',
			},
			{
				$project: {
					_id: 1,
					lastMessageTime: 1,
					email: '$contactInfo.email',
					firstName: '$contactInfo.firstName',
					lastName: '$contactInfo.lastName',
					image: '$contactInfo.image',
					color: '$contactInfo.color',
				},
			},
			{
				$sort: {
					lastMessageTime: -1,
				},
			},
		]);
		return users;
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};
