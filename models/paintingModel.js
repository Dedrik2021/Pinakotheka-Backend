import mongoose from "mongoose";

const paintingSchema = mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
    },
    author: {
        type: String,
        required: true
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
    style: {
        type: String,
        required: [true, 'Please provide a style'],
    },
    size: {
        type: String,
        required: [true, 'Please provide a size'],
    },
    path: {
        type: String,
        required: true,
    }
}, {
    collection: 'paintings',
    timestamps: true,
});

export default mongoose.models.PaintingModel || mongoose.model('PaintingModel', paintingSchema);