import Player from '../models/player.js';
import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

export const addPlayer = async (req, res) => {
	const schema = addPlayerSchema(req.body);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	try {
		const { firstName, lastName, birthday, street, city, state, zip } =
			req.body;

		const alreadyExist = await Player.findOne({
			firstName,
			lastName,
			birthday,
		});

		if (alreadyExist) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: `${firstName} ${lastName} with this birthday already exists`,
				field: 'name',
			});
		}

		const player = await Player.create({
			...req.body,
			guardians: [req.userId],
			address: {
				street,
				city,
				state,
				zip,
			},
		});

		await User.findByIdAndUpdate(
			req.userId,
			{ $push: { players: player._doc._id } },
			{ new: true }
		);

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

const addPlayerSchema = (requestBody) => {
	const schema = Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		school: Joi.string().required(),
		grade: Joi.number().required(),
		birthday: Joi.date().required(),
		age: Joi.number().required(),
		street: Joi.string().required(),
		city: Joi.string().required(),
		state: Joi.string().required(),
		zip: Joi.string().required(),
		phoneNumber: Joi.string().required(),
		role: Joi.string().required(),
		doctor: Joi.string().required(),
		doctorNumber: Joi.string().required(),
		group: Joi.string().required(),
		avatar: Joi.string(),
		allergies: Joi.array(),
		medicalConditions: Joi.array(),
	});

	return schema.validate(requestBody);
};
