import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ISocketMessage } from '../core/interfaces/socket-message.interface';
import Message from '../modules/message/message.model';

export const setUpSocket = (server: HttpServer) => {
	const io = new SocketIOServer(server, {
		cors: {
			origin: process.env.ORIGIN,
			methods: ['GET', 'POST'],
			credentials: true,
		},
	});

	const userSocketMap = new Map();

	const disconnect = (socket: Socket) => {
		console.log(`Client Disconnected: ${socket.id}`);
		for (const [userId, socketId] of userSocketMap.entries()) {
			if (socketId === socket.id) {
				userSocketMap.delete(userId);
				break;
			}
		}
	};

	const sendMessage = async (message: ISocketMessage) => {
		const sendSocketId = userSocketMap.get(message.sender);
		const recipientSocketId = userSocketMap.get(message.recipient);

		const createMessage = await Message.create(message);

		const messageData = await Message.findById(createMessage._id)
			.populate('sender', 'id email firstName lastName image color')
			.populate('recipient', 'id email firstName lastName image color');

		if (recipientSocketId) {
			io.to(recipientSocketId).emit('receiveMessage', messageData);
		}
		if (sendSocketId) {
			io.to(sendSocketId).emit('receiveMessage', messageData);
		}
	};

	io.on('connection', (socket: Socket) => {
		const userId = socket.handshake.query.userId;

		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
		} else {
			console.log('User Id not provided during connection.');
		}
		socket.on('sendMessage', sendMessage);
		socket.on('disconnect', () => disconnect(socket));
	});
};
