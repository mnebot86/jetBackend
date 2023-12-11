import { v2 as cloudinary } from 'cloudinary';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Formation from '../models/formation';
import Play from '../models/play';
import { initializeCloudinary } from '../utils/cloudinary';
import { io } from '../app';

initializeCloudinary();

export const createPlay: RequestHandler = async (req, res, next) => {
	const { params: { formationId } } = req;

	try {
		const { name } = req.body;

		const alreadyExist = await Play.findOne({ name });

		if (alreadyExist) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: `${name} already exists` });
		}

		const play = await Play.create({
			...req.body,
			formation: formationId,
		});

		await Formation.findByIdAndUpdate(
			formationId,
			{ $push: { plays: play._id } },
			{ new: true }
		);
		
		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				public_id: `play/${play._id}`,
				crop: 'fill',
			});

			play.image = {
				url: result.secure_url,
				cloudinaryId: play._id.toString(),
			};

			await play.save();
		}

		io.emit('new_play', play);
		
		return res.status(StatusCodes.CREATED).json(play);
	} catch (err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

export const getAllPlays: RequestHandler = async (req, res) => {
	const {
		params: { formationId },
	} = req;

	try {
		const plays = await Play.find({ formation: formationId });

		if (!plays) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'No plays found',
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

export const getPlay: RequestHandler = async (req, res) => {
	const {
		params: { id },
	} = req;

	try {
		const play = await Play.findById(id);

		if (!play) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'No play by that id',
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

export const updatePlay: RequestHandler = async (req, res) => {
	const { params: { id } } = req;
	
	try {
		const play = await Play.findByIdAndUpdate(
			id,
			req.body,
			{ new: true },
		);

		if(!play) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'No play by that id',
			});
		}

		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				public_id: `play/${play._id}`,
				crop: 'fill',
			});

			play.image = {
				url: result.secure_url,
				cloudinaryId: play._id.toString(),
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

export const deletePlay: RequestHandler = async (req, res) => {
	const { params: { formationId, id } } = req;

	try {
		const play = await Play.findByIdAndDelete(
			id,
			{ new: true },
		);

		if(!play) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'No play by that id',
			});
		}

		await Formation.findByIdAndUpdate(
			formationId,
			{ $pull: { plays: play._id } },
			{ new: true },
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
