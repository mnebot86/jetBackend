import Group from '../models/group.js';
import { StatusCodes } from 'http-status-codes';
// import { BadRequestError } from '../errors/index.js';
import Joi from 'joi';

export const createGroup = async (req, res) => {
	const schema = createGroupSchema(req.body);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	const { name, maxAge, minAge } = req.body;

	const groupAlreadyExist = await Group.findOne({ name });

	if (groupAlreadyExist) {
		res.json({ error: `A group with the name ${name} already exist!` });

		// throw new BadRequestError({
		// 	error: `A group with the name ${name} already exist!`,
		// });
	}

	const group = await Group.create({
		name,
		ages: {
			min: minAge,
			max: maxAge,
		},
	});

	res.status(StatusCodes.CREATED).json({
		message: 'Group Created',
		data: {
			...group._doc,
		},
	});
};

export const getGroups = async (req, res) => {
	const groups = await Group.find({});

	if (!groups) {
		return res.json({ msg: 'No groups found' });
	}

	res.status(StatusCodes.OK).json({
		message: 'Found groups',
		data: {
			...groups,
		},
	});
};

export const getGroup = async (req, res) => {
	const schema = getGroupORDeleteSchema(req.params);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	const { id } = req.params;

	const group = await Group.findOne({ _id: id }).populate([
		{ path: 'coaches' },
		{ path: 'roster' },
	]);

	if (!group) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'No group found' });
	}

	return res.status(StatusCodes.OK).json({
		message: 'Group Found',
		data: {
			...group._doc,
		},
	});
};

export const updateGroup = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.json({ error: 'Please provide group id' });
	}

	const group = await Group.findByIdAndUpdate(id, req.body, { new: true });

	res.status(StatusCodes.OK).json({
		message: 'Group Updated',
		data: {
			...group._doc,
		},
	});
};

export const deleteGroup = async (req, res) => {
	const schema = getGroupORDeleteSchema(req.params);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	const { id } = req.params;

	await Group.findByIdAndDelete(id);

	return res.status(StatusCodes.OK).json({
		data: {
			message: 'Delete Successful',
		},
	});
};

const createGroupSchema = requestBody => {
	const schema = Joi.object({
		name: Joi.string().required(),
		maxAge: Joi.number().required(),
		minAge: Joi.number().required(),
	});

	return schema.validate(requestBody);
};

const getGroupORDeleteSchema = requestParams => {
	const schema = Joi.object({
		id: Joi.string().required(),
	});

	return schema.validate(requestParams);
};
