import User from '../models/user.js';
import { passwordValidation } from '../utils/validators.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
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

	const userAlreadyExists = await User.findOne({ email });

	if (userAlreadyExists) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Email already in use' });
	}

	const user = await User.create({
		role,
		email,
		password,
	});

	const token = user.createJWT();

	return res.status(StatusCodes.CREATED).json({ token });
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.json({ error: 'Please provided all values' });
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return res.json({ error: 'Invalid Credentials' });
	}

	const isPasswordCorrect = await user.comparePassword(password);

	if (!isPasswordCorrect) {
		return res.json({ error: 'Invalid Credentials' });
	}

	const token = user.createJWT();

	user.password = undefined;

	res.status(StatusCodes.OK).json({ token });
};

export const updateUser = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.json({ error: 'Please provide user id' });
	}

	const user = await User.findByIdAndUpdate(id, req.body, { new: true });

	return res.status(StatusCodes.OK).json({ ...user._doc });
};

export const verifyUser = async (req, res) => {
	const { token } = req.body;
	const { userId } = jwt.decode(token);

	if (userId) {
		const user = await User.findOne({ _id: userId }).populate({
			path: 'group',
			populate: [
				{
					path: 'roster',
				},
				{
					path: 'games',
				},
			],
		});

		if (!user) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: `No user with id ${userId}` });
		}

		return res.status(StatusCodes.OK).json({ ...user._doc });
	}
};

export const getUser = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Provide user id' });
	}

	const user = await User.findOne({ _id: id });

	if (!user) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'No user found by that id' });
	}

	return res.status(StatusCodes.OK).json({ ...user._doc });
};

export const getUsers = async (req, res) => {
	const users = await User.find({});

	if (!users) {
		res.status(StatusCodes.OK).json({ msg: 'No users in the database' });
	}

	res.status(StatusCodes.OK).json({ ...users, count: users.length });
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.json({ error: 'Please provide user id' });
	}

	await User.findByIdAndDelete(id);

	return res.status(StatusCodes.OK).json({ msg: 'Deleted!' });
};
