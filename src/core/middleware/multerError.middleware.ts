import AppError from '../utils/error.util';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { MulterError } from 'multer';

const handleMulterErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof MulterError) {
		throw new AppError(httpStatus.UNAUTHORIZED, err.message);
	}
	next(err);
};

export default handleMulterErrors;
