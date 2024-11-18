export interface IShoppingList {
	_id?: string;
	userId?: string;
	title: string;
	sharedUsers?: [
		{
			userId: string;
		}
	];
	products: [
		{
			name: string;
			quantity: string;
			price: string;
			note: string;
		}
	];
}
