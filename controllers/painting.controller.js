import moment from 'moment';

import { createPainting } from '../services/painting.service.js';
import PaintingModel from '../models/paintingModel.js';
import { io } from '../src/index.js';

export const add_painting = async (req, res, next) => {
	try {
		const { authorId, author, title, description, price, image, material, size } = req.body;
		const newPainting = await createPainting({
			authorId,
			title,
			description,
			price,
			image,
			material,
			author,
			style,
			size,
		});
		res.status(201).json({
			message: 'Created your painting are successfully.',
			painting: {
				authorId: newPainting.authorIdt,
				title: newPainting.title,
				description: newPainting.description,
				price: newPainting.price,
				image: newPainting.image,
				author: newPainting.author,
				style: newPainting.style,
				material: newPainting.material,
				size: newPainting.size,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const filter_painting = async (req, res, next) => {
	try {
		const { buttonId } = req.body;
		console.log(buttonId);
		if (!buttonId) {
			return res.status(400).json({ error: 'buttonId is required' });
		}

		let paintings;

		if (buttonId === 1) {
			paintings = await PaintingModel.find().sort({ createdAt: -1 });
		} else if (buttonId === 2) {
			const twoDaysAgo = moment().subtract(7, 'days').toDate();
			paintings = await PaintingModel.find({ createdAt: { $gte: twoDaysAgo } }).sort({ createdAt: -1 });
		} else {
			return res.status(400).json({ error: 'Invalid buttonId value' });
		}

		res.status(200).json(paintings || []);
	} catch (error) {
		next(error);
	}
};

export const get_paintings = async (req, res, next) => {
	try {
		const paintings = await PaintingModel.find().sort({ createdAt: -1 });
		res.status(200).json(paintings);
	} catch (error) {
		next(error);
	}
};

export const get_paintings_by_author_id = async (req, res, next) => {
	try {
		const { authorId } = req.body;
		const paintings = await PaintingModel.find({ authorId });
		res.status(200).json(paintings);
	} catch (error) {
		next(error);
	}
};

export const get_painting_by_id = async (req, res, next) => {
	try {
		const { paintingId } = req.body;
		const painting = await PaintingModel.findById(paintingId);
		res.status(200).json(painting);
	} catch (error) {
		next(error);
	}
};

export const update_painting_by_id = async (req, res, next) => {
	try {
		const { paintingId } = req.body;
		const updateData = req.body;

		const painting = await PaintingModel.findByIdAndUpdate(paintingId, updateData, {
			new: true,
		});

		if (!painting) {
			return res.status(404).json({ message: 'Painting not found' });
		}

		res.status(200).json(painting);
	} catch (error) {
		next(error);
	}
};

export const delete_painting_by_id = async (req, res, next) => {
	try {
		const { paintingId } = req.body;

		const painting = await PaintingModel.findByIdAndDelete(paintingId);

		if (!painting) {
			return res.status(404).json({ message: 'Painting not found' });
		}

		res.status(200).json({ message: 'Painting deleted successfully' });
	} catch (error) {
		next(error);
	}
};
