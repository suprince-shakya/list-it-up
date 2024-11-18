import * as Joi from 'joi';

export const profileValidation = {
	body: Joi.object().keys({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		contactNumber: Joi.string().required(),
	}),
};

export const changePasswordValidation = {
	body: Joi.object().keys({
		oldPassword: Joi.string().required(),
		newPassword: Joi.string().required(),
		confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
			'any.only': 'New Password and Confirm Password must match',
			'any.required': 'Confirm Password is required',
		}),
	}),
};

export const searchTermValidation = {
	params: Joi.object().keys({
		searchTerm: Joi.string().required(),
	}),
};

export const userIdValidation = {
	params: Joi.object().keys({
		userId: Joi.string().required(),
	}),
};
