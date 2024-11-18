import { Request } from 'express';

export interface IGetUserRequest extends Request {
	userId: string;
}
