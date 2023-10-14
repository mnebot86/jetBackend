import Formation from '../models/formation.js';
import Playbook from '../models/playbook.js';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { v2 as cloudinary } from 'cloudinary';
import { initializeCloudinary } from '../utils/cloudinary.js';

initializeCloudinary();

export const createFormation = async (req, res) => {
	console.log(req.file);
	
	const { params: { playbookId } } = req;

	const schema = createFormationSchema(req.body);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

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
				public_id: `formation/${formation._doc._id}`,
			});

			formation.image = {
				url: result.secure_url,
				cloudinaryId: formation._doc._id,
			};

			await formation.save();
		}

		await Playbook.findByIdAndUpdate(
			playbookId,
			{ $push: { formations: formation._doc._id } },
			{ new: true }
		);

		return res.status(StatusCodes.CREATED).json({
			message: 'Formation created successfully',
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

export const getAllFormations = async (req, res) => {
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

export const getFormation = async (req, res) => {
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

export const updateFormation = async (req, res) => {
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
				public_id: `formation/${formation._doc._id}`,
				width: 500,
				height: 500,
				crop: 'fill',
			});

			formation.image = {
				url: result.secure_url,
				cloudinaryId: formation._doc._id,
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

export const deleteFormation = async (req, res) => {
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

const createFormationSchema = requestBody => {
	const schema = Joi.object({
		name: Joi.string().required(),
	});

	return schema.validate(requestBody);
};
