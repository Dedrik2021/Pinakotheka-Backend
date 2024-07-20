import mongoose from "mongoose";

const paintingSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    image: {
        type: String,
        required: [true, 'Please provide an image'],
    },
    material: {
        type: String,
        required: [true, 'Please provide a material'],
    },
    size: {
        type: String,
        required: [true, 'Please provide a size'],
    }
}, {
    collection: 'paints',
    timestamps: true,
});

export default mongoose.models.Paint || mongoose.model('Painting', paintingSchema);