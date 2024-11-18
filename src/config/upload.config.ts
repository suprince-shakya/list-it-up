import multer, { MulterError } from 'multer';
import httpStatus from 'http-status';
import AppError from '../core/utils/error.util';
import { UPLOAD_FILE_SIZE, UPLOAD_MIN_NO_FILE_ALLOWED } from '../core/constant/const.constant';

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: {
		fileSize: UPLOAD_FILE_SIZE,
	},
	fileFilter: (req, file, cb) => {
		// Allow only images
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new MulterError('LIMIT_FIELD_VALUE', 'Invalid file type. Only images are allowed.'));
		}
	},
}).fields([
	{
		name: 'avatar',
		maxCount: UPLOAD_MIN_NO_FILE_ALLOWED,
	},
	{
		name: 'products',
		maxCount: UPLOAD_MIN_NO_FILE_ALLOWED,
	},
]);

export { upload };
