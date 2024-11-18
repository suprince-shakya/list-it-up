import { Request, Response } from 'express';
import * as AuthService from './auth.service';
import httpStatus from 'http-status';
import asyncWrapper from '../../core/utils/asyncWrapper.util';
import { IChangePassword } from '../users/user.interface';
import { IGetUserRequest } from '../../core/interfaces/user-request.interface';

export const signUp = asyncWrapper(async (req: Request, res: Response) => {
	const { user, token } = await AuthService.handleSignup(req.body);
	res.status(httpStatus.CREATED).json({ ok: true, message: 'Signup successfully', data: user, token });
});

export const login = asyncWrapper(async (req: Request, res: Response) => {
	const { user, token } = await AuthService.handleLogin(req.body);
	res.status(httpStatus.OK).json({ ok: true, message: 'User logged in sucessfully', data: user, token });
});

export const forgotPassword = asyncWrapper(async (req: Request, res: Response) => {
	const { email } = req.body;
	await AuthService.handleForgotPassword(email);
	res.status(httpStatus.OK).json({ ok: true, message: 'Email sent sucessfully' });
});

export const verifyOTP = asyncWrapper(async (req: Request, res: Response) => {
	const { otp } = req.body;
	const { token } = await AuthService.handleVerifyOTP(otp);
	res.status(httpStatus.OK).json({ ok: true, message: 'OTP verified sucessfully', token });
});

export const changePassword = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const body: IChangePassword = req.body;
	await AuthService.resetPassword(userId, body);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'Password reset successfully',
	});
});
