import { IGetUserRequest } from '../../core/interfaces/user-request.interface';
import asyncWrapper from '../../core/utils/asyncWrapper.util';
import { Response } from 'express';
import * as ShoppingListService from './shopping.service';
import httpStatus from 'http-status';
import { IShoppingList } from './shopping.interface';

export const getMyLists = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const lists = await ShoppingListService.getAllLists(userId);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'Shopping list fetched successfully',
		data: lists,
	});
});

export const createNewList = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const data: IShoppingList = req.body;
	const lists = await ShoppingListService.createNewList(userId, data);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'Shopping list created successfully',
		data: lists,
	});
});

export const destoryList = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const { id } = req.params;
	const deletedList = await ShoppingListService.deleteList(userId, id);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'Shopping list deleted successfully',
		data: deletedList,
	});
});

export const modifyList = asyncWrapper(async (req: IGetUserRequest, res: Response) => {
	const { userId } = req;
	const { id } = req.params;
	const data: IShoppingList = req.body;
	const editedList = await ShoppingListService.editList(userId, id, data);
	res.status(httpStatus.OK).json({
		ok: true,
		message: 'Shopping list modify successfully',
		data: editedList,
	});
});
