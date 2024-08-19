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
		const { dependenciesArray, slug, price, sortOption } = req.body;

		if (!slug) {
			throw createHttpError.BadRequest('filter title btn is required');
		}

		let filterConditions = {};

		if (typeof slug === 'string') {
			if (slug === 'random') {
				filterConditions = {};
			} else if (slug === 'sale') {
				filterConditions.sale = { $ne: null };
			} else if (slug === 'new') {
				const sevenDaysAgo = moment().subtract(7, 'days').toDate();
				filterConditions.createdAt = { $gte: sevenDaysAgo };
			} else if (
				['paintings', 'sculptures', 'drawings', 'digital-arts', 'handmades'].includes(slug)
			) {
				filterConditions.category = slug;
			} else {
				throw createHttpError.BadRequest('Invalid filter title btn value');
			}
		}

		if (dependenciesArray && Array.isArray(dependenciesArray) && dependenciesArray.length > 0) {
			let styles = [];
			let materials = [];
			let sizes = [];

			// Extract relevant filters from dependenciesArray
			dependenciesArray.forEach((dep) => {
				if (dep.type === 'style') {
					styles.push(dep.value);
				} else if (dep.type === 'material') {
					materials.push(dep.value);
				} else if (dep.type === 'size') {
					sizes.push(dep.value);
				}
			});

			// Build the $and condition to match all filters
			const andConditions = [];

			if (styles.length > 0) {
				andConditions.push({ style: { $in: styles } });
			}
			if (materials.length > 0) {
				andConditions.push({ material: { $in: materials } });
			}
			if (sizes.length > 0) {
				andConditions.push({ size: { $in: sizes } });
			}

			if (andConditions.length > 0) {
				filterConditions.$and = andConditions;
			}
		}

		if (price && typeof price.min === 'number' && typeof price.max === 'number') {
			filterConditions.price = {
				$gte: price.min,
				$lte: price.max,
			};
		}
		
		let sortCondition = {};
        if (sortOption === 'price up') {
            sortCondition.price = 1; // Ascending order
        } else if (sortOption === 'price down') {
            sortCondition.price = -1; // Descending order
        } else if (sortOption === 'sale') {
            // Sorting by sale might require different logic
            filterConditions.sale = { $ne: null }; // Descending order by sale value
        }

		const paintings = await PaintingModel.find(filterConditions).sort(sortCondition);

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
		const { authorId } = req.params;
		if (!authorId) throw createHttpError.BadRequest('AuthorId is missing');
		const paintings = await PaintingModel.find({authorId});
		res.status(200).json(paintings);
	} catch (error) {
		next(error);
	}
};

export const get_painting_by_id = async (req, res, next) => {
	try {
		const { paintingId } = req.params;
		
		if (!paintingId) throw createHttpError.BadRequest('PaintingId is missing');
		const painting = await PaintingModel.findById(paintingId);

		if (!painting) throw createHttpError.NotFound('Painting not found');
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
