import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide your name'],
		},
		path: {
			type: String,
			required: true,
			default: '/singleUser/',
		},
		categories: {
			type: String,
			required: true,
			default: 'User',
		},
		about: {
			type: String,
			required: [true, 'Please provide your about'],
		},
		facebook: {
			type: String,
			required: false,
		},
		twitter: {
			type: String,
			required: false,
		},
		instagram: {
			type: String,
			required: false,
		},
		rating: {
			type: Number,
			required: false,
		},
		email: {
			type: String,
			required: [true, 'Please provide your email'],
			unique: true,
			lowercase: true,
			validator: [validator.isEmail, 'Please provide a valid email'],
		},
		phone: {
			type: String,
			required: [true, 'Please provide your phone number'],
			minLength: [9, 'Minimum password length is 9 characters'],
			maxLength: [9, 'Maximum password length is 9 characters'],
		},
		image: {
			type: String,
			default:
				'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
		},
		author: {
			type: Boolean,
			default: false,
		},
		customer: {
			type: Boolean,
			default: false,
		},
		politics: {
			type: Boolean,
			default: false,
		},
		password: {
			type: String,
			required: [true, 'Please provide your password'],
			minLength: [6, 'Minimum password length is 6 characters'],
			validate: [
				{
					validator: (value) =>
						validator.isStrongPassword(value, {
							minLength: 6,
							minLowercase: 1,
							minUppercase: 1,
							minNumbers: 1,
							minSymbols: 1,
						}),
					message:
						'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
				},
			],
		},
		emailVerificationToken: {
			type: String,
			required: false,
		},
		emailVerificationExpires: {
			type: Date,
			required: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		unreadMessages: {
			type: Map,
			of: Number,
			default: {},
		},
	},
	{
		collection: 'users',
		timestamps: true,
	},
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.models.UserModel || mongoose.model('UserModel', userSchema);

export default UserModel;
