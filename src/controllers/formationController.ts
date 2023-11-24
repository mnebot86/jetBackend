import Formation from '../models/formation';
import Playbook from '../models/playbook';
import { StatusCodes } from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';
import { initializeCloudinary } from '../utils/cloudinary';
import { RequestHandler } from 'express';
import { io } from '../app';

initializeCloudinary();

export const createFormation: RequestHandler = async (req, res) => {	
	const { params: { playbookId } } = req;

	try {
		const { name } = req.body;

		const alreadyExist = await Formation.findOne({ name });

		if (alreadyExist) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: `${name} already exist`,
				field: 'name',
			});
		}
		
		const formation = await Formation.create({ 
			...req.body, 
			playbook: playbookId,
		});

		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				public_id: `formation/${formation._id}`,
			});

			formation.image = {
				url: result.secure_url,
				cloudinaryId: formation._id.toString(),
			};

			await formation.save();
		}

		await Playbook.findByIdAndUpdate(
			playbookId,
			{ $push: { formations: formation._id } },
			{ new: true }
		);

		io.emit('new_formation', formation);
		
		return res.status(StatusCodes.CREATED).json(formation);
	} catch (err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

export const getAllFormations: RequestHandler = async (req, res) => {
	const { params: { playbookId } } = req;

	try {
		const formations = await Formation.find({ playbook: playbookId });

		if (!formations) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'No Formationfound',
			});
		}

		return res.status(StatusCodes.OK).json({
			message: 'Formations Found',
			data: { formations },
		});
	} catch (err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

export const getFormation: RequestHandler = async (req, res) => {
	const { params: { id } } = req;

	try {
		const formation = await Formation.findById(id);

		if (!formation) {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: 'Formation Not Found',
				data: {},
			});
		}

		return res.status(StatusCodes.OK).json({
			message: 'Success',
			data: {
				formation,
			},
		});
	} catch (err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

export const updateFormation: RequestHandler = async (req, res) => {
	const { params: { id } } = req;

	try {
		const formation = await Formation.findByIdAndUpdate(
			id,
			req.body, 
			{ new: true }
		);
		
		if (!formation) {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: 'Formation Not Found',
				data: {},
			});
		}
		
		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				public_id: `formation/${formation._id}`,
				width: 500,
				height: 500,
				crop: 'fill',
			});

			formation.image = {
				url: result.secure_url,
				cloudinaryId: formation._id.toString(),
			};

			await formation.save();
		}

		return res.status(StatusCodes.OK).json({
			message: 'Successfully Updated',
			data: { formation },
		});
	} catch(err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

export const deleteFormation: RequestHandler = async (req, res) => {
	const { params: { playbookId, id } } = req;

	try {
		const formation = await Formation.findByIdAndDelete(id);
		
		if(!formation) {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: 'Formation Not Found',
				data: {},
			});
		}

		await Playbook.findByIdAndUpdate(
			playbookId,
			{ $pull: { formations: id } },
			{ new: true }
		);

		const public_id = `formation/${id}`;

		await cloudinary.uploader.destroy(public_id, (error, result) => {
			if (error) {
				console.error('Error deleting image:', error);
			} else {
				console.log('Image deleted:', result);
			}
		});

		return res.status(StatusCodes.OK).json({
			message: 'Successfully Delete',
			data: { formation },
		});
	} catch(err) {
		console.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};
