import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Group from '../models/group';

export const createGroup: RequestHandler = async (req, res) => {
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
			...group,
		},
	});
};

export const getGroups: RequestHandler = async (req, res) => {
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

export const getGroup: RequestHandler = async (req, res) => {
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
			...group,
		},
	});
};

export const updateGroup: RequestHandler = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.json({ error: 'Please provide group id' });
	}

	const group = await Group.findByIdAndUpdate(id, req.body, { new: true });

	res.status(StatusCodes.OK).json({
		message: 'Group Updated',
		data: {
			...group,
		},
	});
};

export const deleteGroup: RequestHandler = async (req, res) => {
	const { id } = req.params;

	await Group.findByIdAndDelete(id);

	return res.status(StatusCodes.OK).json({
		data: {
			message: 'Delete Successful',
		},
	});
};
