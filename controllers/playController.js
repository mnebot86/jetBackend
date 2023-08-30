import Play from '../models/play.js';
import Formation from '../models/formation.js';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { v2 as cloudinary } from 'cloudinary';
import {initializeCloudinary} from '../utils/cloudinary.js'

initializeCloudinary();

export const createPlay = async (req, res) => {
    const { params: { formationId } } = req;

	const schema = PlaySchema(req.body);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	try {
		const { name } = req.body;

		const alreadyExist = await Play.findOne({ name });

		if (alreadyExist) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: `${name} already exists`,
				field: 'name',
			});
		}

		const play = await Play.create({
			...req.body,
            formation: formationId,
		});

		await Formation.findByIdAndUpdate(
			formationId,
			{ $push: { plays: play._doc._id } },
			{ new: true }
		);
		
		if (!!req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				public_id: `play/${play._doc._id}`,
				width: 500,
				height: 500,
				crop: 'fill',
			});

			play.image = {
				url: result.secure_url,
				cloudinaryId: play._doc._id
			};

			await play.save();
		}

		return res.status(StatusCodes.CREATED).json({
			message: 'Play created successfully',
			data: {
				play,
			},
		});
	} catch (err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

export const getAllPlays = async (req, res) => {
	const {
		params: { formationId },
	} = req;

	try {
		const plays = await Play.find({formation: formationId});

		if (!plays) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: `No plays found`,
			});
		}

		return res.status(StatusCodes.OK).json({
			message: 'Success',
			data: {
				plays,
			},
		});
	} catch (err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

export const getPlay = async (req, res) => {
	const {
		params: { id },
	} = req;

	try {
		const play = await Play.findById(id);

		if (!play) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: `No play by that id`,
			});
		}

		return res.status(StatusCodes.OK).json({
			message: 'Success',
			data: {
				play,
			},
		});
	} catch (err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

export const updatePlay = async (req, res) => {
	const { params: { id } } = req;
	
	try {
		const play = await Play.findByIdAndUpdate(
			id,
			req.body,
			{new: true},
		);

		if(!play) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: `No play by that id`,
			});
		}

		if (!!req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				public_id: `play/${play._doc._id}`,
				width: 500,
				height: 500,
				crop: 'fill',
			});

			play.image = {
				url: result.secure_url,
				cloudinaryId: play._doc._id
			};

			await play.save();
		}

		return res.status(StatusCodes.OK).json({
			message: 'Success',
			data: {
				play,
			},
		});
	} catch(err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

export const deletePlay = async (req, res) => {
	const { params: { formationId, id } } = req;

	try {
		const play = await Play.findByIdAndDelete(
			id,
			req.body,
			{new: true},
		);

		if(!play) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: `No play by that id`,
			});
		}

		await Formation.findByIdAndUpdate(
			formationId,
			{$pull: { plays: play._doc._id }},
			{new: true},
		);

		const public_id = `play/${id}`;

		await cloudinary.uploader.destroy(public_id, (error, result) => {
			if (error) {
			  console.error('Error deleting image:', error);
			} else {
			  console.log('Image deleted:', result);
			}
		  });

		return res.status(StatusCodes.OK).json({
			message: 'Success',
			data: {
				play,
			},
		});
	} catch(err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

const PlaySchema = (requestBody) => {
	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
	});

	return schema.validate(requestBody);
};
