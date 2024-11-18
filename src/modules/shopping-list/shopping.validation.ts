import * as Joi from 'joi';

const productValidation = Joi.object().keys({
	name: Joi.string().required(),
	quantity: Joi.string().optional(),
	price: Joi.string().optional(),
	note: Joi.string().optional(),
});

export const createShoppingListValidation = {
	body: Joi.object().keys({
		title: Joi.string().required(),
		products: Joi.array().items(productValidation),
	}),
};
