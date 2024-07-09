import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide your name'],
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
		picture: {
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
			maxLength: [20, 'Maximum password length is 20 characters'],
			// validate: [
			// 	validator.isStrongPassword,
			// 	'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			// ],
		},
	},
	{
		collection: 'users',
		timestamps: true,
	},
);

userSchema.pre('save', async function (next) {
	try {
		if (this.isNew) {
			const salt = await bcrypt.genSalt(12);
			const hashedPassword = await bcrypt.hash(this.password, salt);
			this.password = hashedPassword;
		}
	} catch (error) {
		next(error);
	}
});

const UserModel = mongoose.models.UserModel || mongoose.model('UserModel', userSchema);

export default UserModel;
