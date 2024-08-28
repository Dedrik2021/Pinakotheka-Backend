import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserModel',
			required: true,
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'PaintingModel',
			required: true,
		},
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserModel',
			required: true,
		},
	},
	{
		collection: 'products',
		timestamps: true,
	},
);

export default mongoose.models.ProductModel || mongoose.model('ProductModel', productSchema);
