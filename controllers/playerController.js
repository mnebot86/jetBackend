import Player from '../models/player.js';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

export const addPlayer = async (req, res) => {
	const schema = validateRequestSchema(req.body);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	try {
		const { firstName, lastName, street, city, state, zip } = req.body;

		const alreadyExist = await Player.findOne({
			firstName,
			lastName,
		});

		if (alreadyExist) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: `${firstName} ${lastName} with this address already exists`,
				field: 'name',
			});
		}

		const player = await Player.create({
			...req.body,
			address: {
				street,
				city,
				state,
				zip,
			},
		});

		return res.status(StatusCodes.CREATED).json({
			message: 'Player created successfully',
			data: {
				player,
			},
		});
	} catch (err) {
		console.error(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An unexpected error occurred',
		});
	}
};

const validateRequestSchema = (requestBody) => {
	const schema = Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		school: Joi.string().required(),
		grade: Joi.number().required(),
		birthday: Joi.date().required(),
		age: Joi.number().required(),
		street: Joi.string().required(),
		city: Joi.string().required(),
		zip: Joi.string().required(),
		phoneNumber: Joi.string().required(),
		role: Joi.string().required(),
		doctor: Joi.string().required(),
		doctorNumber: Joi.string().required(),
		group: Joi.string().required(),
		avatar: Joi.string().required(),
		allergies: Joi.array(),
		medicalConditions: Joi.array(),
	});

	return schema.validate(requestBody);
};
