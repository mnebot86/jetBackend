import Group from '../models/group.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';

const createGroup = async (req, res) => {
	const { name, maxAge, minAge } = req.body;

	if (!name || !maxAge || !minAge) {
		res.json({ error: 'Please provide all fields' });
	}

	const groupAlreadyExist = await Group.findOne({ name });

	if (groupAlreadyExist) {
		res.json({ error: `A group with the name ${name} already exist!` });

		throw new BadRequestError({
			error: `A group with the name ${name} already exist!`,
		});
	}

	const group = await Group.create({
		name,
		ages: {
			min: minAge,
			max: maxAge,
		},
	});

	res.status(StatusCodes.CREATED).json({ ...group._doc });
};

const getGroups = async (req, res) => {
	const groups = await Group.find({});

	if (!groups) {
		return res.json({ msg: 'No groups found' });
	}

	res.status(StatusCodes.OK).json({ ...groups });
};

const getGroup = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Id is required' });
	}

	const group = await Group.findOne({ _id: id }).populate([
		{ path: 'coaches' },
		{ path: 'roster' },
	]);

	if (!group) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'No group found' });
	}

	return res.status(StatusCodes.OK).json({ ...group._doc });
};

const updateGroup = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.json({ error: 'Please provide group id' });
	}

	const group = await Group.findByIdAndUpdate(id, req.body, { new: true });

	res.status(StatusCodes.OK).json({ ...group._doc });
};

const deleteGroup = async (req, res) => {
	const { id } = req.params;

	console.log('ID', id);
	if (!id) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Id is required' });
	}

	await Group.findByIdAndDelete(id);

	return res.status(StatusCodes.OK).json({ msg: 'Deleted' });
};

export { createGroup, getGroups, getGroup, updateGroup, deleteGroup };
