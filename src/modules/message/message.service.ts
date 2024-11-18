import Message from './message.model';
import AppError from '../../core/utils/error.util';
import httpStatus from 'http-status';

export const getMessages = async (user1: string, user2: string) => {
	try {
		const messages = await Message.find({
			$or: [
				{ sender: user1, recipient: user2 },
				{ sender: user2, recipient: user1 },
			],
		}).sort({ timestamp: 1 });
		return messages;
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};
