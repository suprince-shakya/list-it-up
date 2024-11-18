import { IAuthDTO, IResetPassword } from './auth.interface';
import User from '../users/user.model';
import AppError from '../../core/utils/error.util';
import httpStatus from 'http-status';
import { createToken } from '../../core/utils/jwt.util';
import * as bcrypt from 'bcryptjs';
import { sendMail } from '../../config/email.config';
import { capitalizeFirstLetter, generateOTP } from '../../core/utils/js.util';
import { getValue, setValue } from '../../config/redis.config';

export const handleSignup = async (data: IAuthDTO) => {
	try {
		const checkUser = await User.findOne({ email: data.email });
		if (checkUser) {
			throw new AppError(httpStatus.FORBIDDEN, `Email already taken`);
		}
		const user = await User.create({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
		});
		const token: string = createToken(user);
		return { user: user.toJSON(), token };
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};

export const handleLogin = async (data: IAuthDTO) => {
	const user = await User.findOne({ email: data.email });
	if (!user) {
		throw new AppError(httpStatus.UNAUTHORIZED, `Invalid credentials`);
	}
	if (!bcrypt.compareSync(data.password, user.password)) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
	}
	const token = createToken(user);
	return { user: user.toJSON(), token };
};

export const handleForgotPassword = async (email: string) => {
	const user = await User.findOne({ email: email });
	if (!user) {
		throw new AppError(httpStatus.UNAUTHORIZED, `Given email not found`);
	}
	const otp: number = generateOTP();
	await setValue(String(otp), user.email, 300);
	const data = {
		name: capitalizeFirstLetter(user.firstName),
		otp: otp,
	};
	await sendMail('forgotPassword', [email], data);
};

export const handleVerifyOTP = async (otp: number) => {
	const userEmail = await getValue(String(otp));
	if (!userEmail) {
		throw new AppError(httpStatus.NOT_FOUND, `No OTP found`);
	}
	const user = await User.findOne({ email: userEmail });
	if (!user) {
		throw new AppError(httpStatus.UNAUTHORIZED, `Given email not found`);
	}
	const token = createToken(user);
	return { token };
};

export const resetPassword = async (userId: string, body: IResetPassword) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new AppError(httpStatus.NOT_FOUND, `User with id=${userId} not found`);
		}

		user.password = body.newPassword;
		await user.save();
		return user;
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};
