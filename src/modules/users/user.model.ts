import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IUser } from './user.interface';
import * as url from 'url';

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: false,
		},
		lastName: {
			type: String,
			required: false,
		},
		image: {
			type: String,
			default: '',
			required: false,
		},
		contactNumber: {
			type: String,
			required: false,
			default: '',
		},
		profileSetup: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
			},
		},
		timestamps: true,
	}
);

// Pre save hook
userSchema.pre('save', async function (next) {
	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
	next();
});

// Post findOne hook
userSchema.post('findOne', function (result: IUser | null) {
	if (result?.image) {
		const parsedUrl = url.parse(result.image);
		if (parsedUrl.host == null) {
			result.image = `${process.env.APP_HOST}${result.image}`;
		}
	}
});

// Post findOneAndUpdate hook
userSchema.post('findOneAndUpdate', function (result: IUser | null) {
	if (result?.image) {
		const parsedUrl = url.parse(result.image);
		if (parsedUrl.host == null) {
			result.image = `${process.env.APP_HOST}${result.image}`;
		}
	}
});

const User = mongoose.model<IUser>('Users', userSchema);

export default User;
