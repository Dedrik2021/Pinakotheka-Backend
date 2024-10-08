import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const passwordResetTokenSchema = mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserModel',
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	createAt: {
		type: Date,
		expires: 3600,
		default: Date.now(),
	},
});

passwordResetTokenSchema.pre('save', async function (next) {
	if (this.isModified('token')) {
		this.token = await bcrypt.hash(this.token, 10);
	}
	next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
	const result = await bcrypt.compare(token, this.token);
	return result;
};

export default mongoose.models.PasswordResetToken || mongoose.model('PasswordResetToken', passwordResetTokenSchema);
