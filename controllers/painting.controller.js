import moment from 'moment';
import createHttpError from 'http-errors';

import { createPainting } from '../services/painting.service.js';
import PaintingModel from '../models/paintingModel.js';

export const add_painting = async (req, res, next) => {
	try {
		const {
			authorId,
			authorName,
			name,
			category,
			description,
			price,
			image,
			style,
			material,
			sale,
			size,
		} = req.body;
		const newPainting = await createPainting({
			authorId,
			name,
			description,
			price,
			image,
			material,
			authorName,
			style,
			size,
			category,
			sale,
		});
		res.status(201).json({
			message: 'Created your painting are successfully.',
			painting: {
				authorId: newPainting.authorIdt,
				name: newPainting.name,
				description: newPainting.description,
				price: newPainting.price,
				image: newPainting.image,
				authorName: newPainting.authorName,
				style: newPainting.style,
				material: newPainting.material,
				size: newPainting.size,
				sale: newPainting.sale,
				path: newPainting.path,
				categories: newPainting.categories,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const filter_painting = async (req, res, next) => {
	try {
		const { titleFilterBtn } = req.body;
		console.log(titleFilterBtn);
		if (!titleFilterBtn) {
			throw createHttpError.BadRequest('filter title btn is required');
		}

		let paintings;
		if (titleFilterBtn === 'random') {
			paintings = await PaintingModel.find().sort({ createdAt: -1 });
		} else if (titleFilterBtn === 'new') {
			const twoDaysAgo = moment().subtract(7, 'days').toDate();
			paintings = await PaintingModel.find({ createdAt: { $gte: twoDaysAgo } }).sort({
				createdAt: -1,
			});
		} else if (titleFilterBtn === 'paintings') {
			paintings = await PaintingModel.find({ category: titleFilterBtn }).sort({ createdAt: -1 });
		} else if (titleFilterBtn === 'sculptures') {
			paintings = await PaintingModel.find({ category: titleFilterBtn }).sort({
				createdAt: -1,
			});
		} else if (titleFilterBtn === 'drawings') {
			paintings = await PaintingModel.find({ category: titleFilterBtn }).sort({ createdAt: -1 });
		} else if (titleFilterBtn === 'digital-arts') {
			paintings = await PaintingModel.find({ category: titleFilterBtn }).sort({
				createdAt: -1,
			});
		} else if (titleFilterBtn === 'handmades') {
			paintings = await PaintingModel.find({ category: titleFilterBtn }).sort({ createdAt: -1 });
		} else {
			throw createHttpError.BadRequest('Invalid filter title btn value');
		}

		res.status(201).json(paintings || []);
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
		if (authorId) throw createHttpError.BadRequest('AuthorId is missing');
		const paintings = await PaintingModel.find({ authorId });
		res.status(200).json(paintings);
	} catch (error) {
		next(error);
	}
};

export const get_painting_by_id = async (req, res, next) => {
	try {
		const { paintingId } = req.body;
		if (authorId) throw createHttpError.BadRequest('PaintingId is missing');
		const painting = await PaintingModel.findById(paintingId);
		res.status(200).json(painting);
	} catch (error) {
		next(error);
	}
};

export const update_painting_by_id = async (req, res, next) => {
	try {
		const { paintingId } = req.body;
		if (authorId) throw createHttpError.BadRequest('PaintingId is missing');
		const updateData = req.body;

		const painting = await PaintingModel.findByIdAndUpdate(paintingId, updateData, {
			new: true,
		});

		if (!painting) {
			throw createHttpError.NotFound('Painting not found');
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
			throw createHttpError.NotFound('Painting not found');
		}

		res.status(201).json({ message: 'Painting deleted successfully' });
	} catch (error) {
		next(error);
	}
};
