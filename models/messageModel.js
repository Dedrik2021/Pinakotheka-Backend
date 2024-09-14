import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserModel',
			required: [true, 'Please provide a userId'],
		},
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserModel',
			required: [true, 'Please provide a authorId'],
		},
		message: {
			type: String,
			required: [true, 'Please provide a message'],
		},
	},
	{
		collection: 'messages',
		timestamps: true,
	},
);

export default mongoose.models.MessageModel || mongoose.model('MessageModel', messageSchema);
