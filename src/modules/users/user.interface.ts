export interface IUser {
	_id?: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	image: string;
	contactNumber: number;
	profileSetup: boolean;
}

export interface IChangePassword {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}
