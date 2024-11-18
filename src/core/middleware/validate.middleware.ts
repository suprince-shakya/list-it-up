import { NextFunction, Request, Response } from 'express';
import { ValidationSchema } from '../interfaces/validation.interface';
import httpStatus from 'http-status';
import AppError from '../utils/error.util';
import * as Joi from 'joi';
import asyncWrapper from '../utils/asyncWrapper.util';

const validate = (schema: ValidationSchema) =>
	asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
		const pickObjectKeysWithValue = (object: Record<string, any>, keys: string[]) => {
			return keys.reduce((o, k) => {
				if (object[k] !== undefined) {
					o[k] = object[k];
				}
				return o;
			}, {} as Record<string, any>);
		};

		const definedSchemaKeys = Object.keys(schema);
		const acceptableSchemaKeys: string[] = ['params', 'query', 'body'];
		const filterOutNotValidSchemaKeys: string[] = definedSchemaKeys.filter((k) => acceptableSchemaKeys.includes(k));

		if (filterOutNotValidSchemaKeys.length !== definedSchemaKeys.length) {
			const e = `Wrongly defined validation schema keys: [${definedSchemaKeys}], allowed keys: [${acceptableSchemaKeys}]`;
			throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, e, false);
		}

		const validSchema = pickObjectKeysWithValue(schema, filterOutNotValidSchemaKeys);
		const object = pickObjectKeysWithValue(req, Object.keys(validSchema));

		const { value, error } = Joi.compile(validSchema)
			.prefs({ errors: { label: 'key' } })
			.validate(object);

		if (error) {
			const errorMessage = error.details.map((details) => details.message).join(', ');
			throw new AppError(httpStatus.BAD_REQUEST, errorMessage);
		}

		Object.assign(req, value);
		return next();
	});

export default validate;
