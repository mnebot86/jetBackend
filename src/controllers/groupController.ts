import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import Group from '../models/group';
import User from '../models/user';

export const createGroup: RequestHandler = async (req, res, next) => {
	const { userId } = req.session;

	const { name } = req.body;

	try {
		if (!name) throw createHttpError(StatusCodes.BAD_REQUEST, 'Provide a name for this group.');

		const groupAlreadyExist = await Group.findOne({ name }).exec();
		
		if (groupAlreadyExist) throw createHttpError(StatusCodes.CONFLICT, 'This group already exist.');

		const group = await Group.create({ name });

		if (userId) {
			group.coaches.push(userId);
		} else {
			throw createHttpError(StatusCodes.BAD_REQUEST, 'userId is undefined.');
		}

		await group.save();

		const user = await User.findById(userId);

		if (user) {
			user.group = group._id;
		} else {
			throw createHttpError(StatusCodes.NOT_FOUND, 'User not found.');
		}

		await user.save();

		res.status(StatusCodes.CREATED).json(group.toObject());
	} catch (error) {
		next(error)
	}
};

export const getGroups: RequestHandler = async (req, res, next) => {
	try {
		const groups = await Group.find({}).exec();
		
		if (!groups) {
			return res.status(StatusCodes.OK).json([]);
		}

		res.status(StatusCodes.OK).json(groups);
	} catch (error) {
		next(error);
	}
};

export const getGroup: RequestHandler = async (req, res, next) => {
	const { id } = req.params;

	try {
		const group = await Group.findOne({ _id: id }).exec();

		if (!group) throw createHttpError(StatusCodes.NOT_FOUND, 'Group not found.')

		return res.status(StatusCodes.OK).json(group.toObject());
	} catch (error) {
		next(error);
	}
};

export const updateGroup: RequestHandler = async (req, res, next) => {
	const { id } = req.params;

	try {
		if (!id) throw createHttpError(StatusCodes.BAD_REQUEST, 'Please provide group id.');

		const group = await Group.findByIdAndUpdate(id, req.body, { new: true });
		
		if (!group) throw createHttpError(StatusCodes.NOT_FOUND, 'Group not found.');

		res.status(StatusCodes.OK).json(group.toObject());
	} catch (error) {
		next(error)
	}
};

export const deleteGroup: RequestHandler = async (req, res, next) => {
	const { id } = req.params;

	try {
		if (!id) throw createHttpError(StatusCodes.BAD_REQUEST, 'Please provide group id');

		const group = await Group.findByIdAndDelete(id);

		if (!group) throw createHttpError(StatusCodes.NOT_FOUND, 'Group doesn\'t exist');

		return res.sendStatus(StatusCodes.OK);
	} catch (error) {
		next(error)
	}
};
