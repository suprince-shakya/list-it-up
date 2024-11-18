import * as Joi from 'joi';

export const signUpValidation = {
	body: Joi.object().keys({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().required().email(),
		password: Joi.string().required(),
		confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
			'any.only': 'Password and Confirm Password must match',
			'any.required': 'Confirm Password is required',
		}),
	}),
};

export const loginValidation = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	}),
};

export const accountRecovery = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
	}),
};

export const otpValidation = {
	body: Joi.object().keys({
		otp: Joi.number().required(),
	}),
};

export const resetPasswordValidation = {
	body: Joi.object().keys({
		newPassword: Joi.string().required(),
		confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
			'any.only': 'New Password and Confirm Password must match',
			'any.required': 'Confirm Password is required',
		}),
	}),
};
