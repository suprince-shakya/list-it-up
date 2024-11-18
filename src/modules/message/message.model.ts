import mongoose from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
			required: true,
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
			required: false,
		},
		messageType: {
			type: String,
			enum: ['text', 'file'],
			required: true,
		},
		content: {
			type: String,
			required: function () {
				return this.messageType === 'text';
			},
		},
		fileUrl: {
			type: String,
			required: function () {
				return this.messageType === 'file';
			},
		},
	},
	{ timestamps: true }
);

const Message = mongoose.model<IMessage>('Messages', messageSchema);

export default Message;