import Playbook from '../models/playbook.js';
import User from '../models/user.js';
import { io } from '../app.js';
import { sendNotifications } from '../utils/notifications.js';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

export const createPlaybook = async (req, res) => {
	const schema = createPlaybookSchema(req.body);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	const { userId } = req;

	const alreadyExist = await Playbook.findOne({ name: req.body.name });

	if (alreadyExist) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: 'Playbook already exist',
			data: {},
		});
	}

	const playbook = await Playbook.create({ ...req.body, createdBy: userId });

	const usersWithTokens = await User.find({
		$and: [
			{ _id: { $ne: userId } },
			{ expoPushTokens: { $exists: true, $not: { $size: 0 } } },
		],
	});

	const tokens = usersWithTokens.reduce(
		(allTokens, user) => [...allTokens, ...user.expoPushTokens],
		[]
	);

	const title = 'New Playbook Posted';
	const body = playbook.name;

	io.emit('new_playbook', playbook);

	await sendNotifications(tokens, title, body, 'PlaybookScreen');

	return res.status(StatusCodes.CREATED).json({
		message: 'Playbook created successfully!',
		data: {
			playbook,
		},
	});
};

export const getPlaybooks = async (req, res) => {
	try {
		const playbooks = await Playbook.find({});

		if (!playbooks || playbooks.length === 0) {
			return res.status(StatusCodes.OK).json({
				message: 'No Playbooks Saved',
				data: {
					playbooks: [],
				},
			});
		}

		return res.status(StatusCodes.OK).json({
			message: 'Successfully',
			data: {
				playbooks,
			},
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Error fetching feed posts',
			error: error.message,
		});
	}
};

export const getPlaybook = async (req, res) => {
	const {
		params: { id },
	} = req;

	const playbook = await Playbook.findById(id);

	if (!playbook) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'Post not found',
			data: {},
		});
	}

	return res.status(StatusCodes.OK).json({
		message: 'Playbook found!',
		data: playbook,
	});
};

export const updatePlaybook = async (req, res) => {
	const {
		body,
		params: { id },
	} = req;

	const playbook = await Playbook.findByIdAndUpdate(id, body, {
		new: true,
	});

	if (!playbook) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'Playbook not found',
			data: {},
		});
	}

	io.emit('update_playbook', playbook);

	const { createdBy } = playbook;

	const user = await User.findById(createdBy);

	if (!user) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'User not found',
			data: {},
		});
	}

	const otherUsers = await User.find({
		_id: { $ne: createdBy },
		expoPushTokens: { $exists: true, $not: { $size: 0 } },
	});

	const allTokens = otherUsers.reduce(
		(tokensArray, otherUser) => [
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

export const deletePlaybook = async (req, res) => {
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

const createPlaybookSchema = (requestBody) => {
	const schema = Joi.object({
		name: Joi.string().required(),
		formations: Joi.array(),
	});

	return schema.validate(requestBody);
};
