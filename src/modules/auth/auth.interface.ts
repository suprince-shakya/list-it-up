export interface IAuthDTO {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface IResetPassword {
	newPassword: string;
	confirmPassword: string;
}