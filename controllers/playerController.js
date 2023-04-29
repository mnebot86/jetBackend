import User from '../models/user.js';
import Player from '../models/player.js';
import { StatusCodes } from 'http-status-codes';
import { passwordValidation } from '../utils/validators.js';
import jwt from 'jsonwebtoken';

export const registerPlayer = async (req, res) => {
	const { email, password, confirmPassword, role } = req.body;

	if (!email || !password || !confirmPassword || !role) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Please provided all values' });
	}

	const passwordErrors = passwordValidation(password);

	if (passwordErrors.length > 0) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: passwordErrors.join(', '),
		});
	}

	const passwordDoNotMatch = password !== confirmPassword;

	if (passwordDoNotMatch) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: "Password don't match",
		});
	}

	const userAlreadyExists = await Player.findOne({ email });

	if (userAlreadyExists) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Email already in use' });
	}

	const player = await User.create({ ...req.body });

	return res.status(StatusCodes.CREATED).json({ player });
};

export const getPlayersByGroup = async (req, res) => {
	const { groups, role } = req.body;

	console.log(req.body);

	if (!groups || !role) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: 'Please Provide groupId and role',
		});
	}

	const players = await User.find({ role, groups });

	if (!players) {
		return res
			.status(StatusCodes.OK)
			.json({ message: 'This group has no Players yet' });
	}

	return res.status(StatusCodes.OK).json({ ...players });
};
