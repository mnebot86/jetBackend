import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { io } from '../app';
import Playbook from '../models/playbook';
import User from '../models/user';
import { sendNotifications } from '../utils/notifications';

export const createPlaybook: RequestHandler = async (req, res) => {
	const { userId } = req.session;

	const alreadyExist = await Playbook.findOne({ name: req.body.name });

	if (alreadyExist) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Playbook already exist' });
	}

	const getUser = await User.findById(userId);

	const playbook = await Playbook.create({ ...req.body, createdBy: userId, group: getUser?.group });

	const usersWithTokens = await User.find({
		$and: [
			{ _id: { $ne: userId } },
			{ expoPushTokens: { $exists: true, $not: { $size: 0 } } },
		],
	});

	const tokens: string[] = usersWithTokens.reduce(
		(allTokens: string[], user) => [...allTokens, ...user.expoPushTokens],
		[]
	);

	const title = 'New Playbook Posted';
	const body = playbook.name;

	io.emit('new_playbook', playbook);

	await sendNotifications(tokens, title, body, 'PlaybookScreen');

	return res.status(StatusCodes.CREATED).json(playbook);
};

export const getPlaybooks: RequestHandler = async (req, res) => {
	try {
		const playbooks = await Playbook.find({});

		return res.status(StatusCodes.OK).json(playbooks);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'Error fetching feed posts',
				error: error.message,
			});
		}
	}
};

export const getPlaybook: RequestHandler = async (req, res) => {
	const {
		params: { id },
	} = req;

	const playbook = await Playbook.findById(id).populate('formations');

	if (!playbook) {
		return res.status(StatusCodes.NOT_FOUND).json({
			error: 'Post not found',
		});
	}

	return res.status(StatusCodes.OK).json(playbook);
};

export const updatePlaybook: RequestHandler = async (req, res) => {
	const {
		body,
		params: { id },
	} = req;

	const playbook = await Playbook.findByIdAndUpdate(id, body, {
		new: true,
	});

	if (!playbook) {
		return res.status(StatusCodes.NOT_FOUND).json({
			error: 'Playbook not found',
			data: {},
		});
	}

	io.emit('update_playbook', playbook);

	const { createdBy } = playbook;

	const user = await User.findById(createdBy);

	if (!user) {
		return res.status(StatusCodes.NOT_FOUND).json({
			error: 'User not found',
			data: {},
		});
	}

	const otherUsers = await User.find({
		_id: { $ne: createdBy },
		expoPushTokens: { $exists: true, $not: { $size: 0 } },
	});

	const allTokens: string[] = otherUsers.reduce(
		(tokensArray: string[], otherUser) => [
			...tokensArray,
			...otherUser.expoPushTokens,
		],
		[]
	);

	const allUsersTitle = 'Playbook Updated';
	const allUsersBody = `A playbook has been updated: ${playbook.name}`;

	await sendNotifications(
		allTokens,
		allUsersTitle,
		allUsersBody,
		'PlaybookScreen'
	);

	return res.status(StatusCodes.OK).json({
		message: 'Playbook Update Successful',
		data: { playbook },
	});
};

export const deletePlaybook: RequestHandler = async (req, res) => {
	const {
		params: { id },
	} = req;

	const playbook = await Playbook.findOneAndDelete({
		_id: id,
	});

	if (!playbook) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'Playbook not found or not authorized for deletion',
			data: {},
		});
	}

	io.emit('delete_playbook', id);

	return res.status(StatusCodes.OK).json({
		message: 'Playbook delete successfully!',
		data: { playbook },
	});
};
