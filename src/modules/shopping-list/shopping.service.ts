import AppError from '../../core/utils/error.util';
import { IShoppingList } from './shopping.interface';
import ShoppingList from './shopping.model';
import httpStatus from 'http-status';

export const getAllLists = async (userId: string) => {
	try {
		const shoppingLists = await ShoppingList.find({
			userId: userId,
		});

		return shoppingLists;
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};

export const createNewList = async (userId: string, data: IShoppingList) => {
	console.log(data);
	try {
		const newList = await ShoppingList.create({
			userId: userId,
			title: data.title,
			products: data.products,
		});

		return newList;
	} catch (e) {
		throw new AppError(httpStatus.BAD_REQUEST, e);
	}
};

export const deleteList = async (userId: string, id: string) => {
	const oldList = await ShoppingList.findById(id);
	if (!oldList) {
		throw new AppError(httpStatus.NOT_FOUND, `No shopping list of id=${id} not found`);
	}
	if (oldList.userId != userId) {
		throw new AppError(httpStatus.UNAUTHORIZED, `You don't have permission to perform this action`);
	}
	await oldList.deleteOne();
	return oldList;
};

export const editList = async (userId: string, id: string, data: IShoppingList) => {
	const oldList = await ShoppingList.findById(id);
	if (!oldList) {
		throw new AppError(httpStatus.NOT_FOUND, `No shopping list of id=${id} not found`);
	}
	if (oldList.userId != userId) {
		throw new AppError(httpStatus.UNAUTHORIZED, `You don't have permission to perform this action`);
	}
	const updatedList = await ShoppingList.findByIdAndUpdate(id, {
		products: data.products,
		title: data.title,
		sharedUsers: data.sharedUsers,
	});
	return updatedList;
};
