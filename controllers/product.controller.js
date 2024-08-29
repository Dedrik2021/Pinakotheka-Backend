import ProductModel from "../models/productModel.js";
import createHttpError from 'http-errors';

import { addProduct } from '../services/product.service.js';


export const get_products = async (req, res, next) => {
    try {
        const {userId} = req.params
        const products = await ProductModel.find({userId}).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

export const delete_product = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await ProductModel.findByIdAndDelete(productId);
        if (!product) {
            throw createHttpError.NotFound('Product not found');
        }
        res.status(201).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const add_product = async (req, res, next) => {
    
    try {
        const {userId, authorId, productId} = req.body
        const newProduct = await addProduct({userId, authorId, productId});
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
}