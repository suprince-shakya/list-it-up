import mongoose from 'mongoose';
import { IShoppingList } from './shopping.interface';

const shoppingListSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		sharedUsers: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Users',
				},
			},
		],
		products: [
			{
				name: {
					type: String,
					required: true,
				},
				quantity: {
					type: String,
				},
				price: {
					type: String,
				},
				note: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const ShoppingList = mongoose.model<IShoppingList>('Shopping-list', shoppingListSchema);

export default ShoppingList;
