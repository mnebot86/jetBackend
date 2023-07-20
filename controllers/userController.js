import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

export const register = async (req, res) => {
	const schema = registerSchema(req.body);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	const { email, role, password } = req.body;

	const userAlreadyExists = await User.findOne({ email: req.body.email });

	if (userAlreadyExists) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: '"Email" already in use',
			field: 'email',
		});
	}

	const user = await User.create({
		role,
		email,
		password,
	});

	const token = user.createJWT();

	return res.status(StatusCodes.CREATED).json({
		message: 'Player created successfully',
		data: {
			token,
		},
	});
};

export const login = async (req, res) => {
	const schema = loginSchema(req.body);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	const { email, password } = req.body;

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

	res.status(StatusCodes.OK).json({
		message: 'Login successfully',
		token,
	});
};

export const updateUser = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.json({ error: 'Please provide user id' });
	}

	const user = await User.findByIdAndUpdate(id, req.body, { new: true });

	return res.status(StatusCodes.OK).json({
		message: 'Updated Successful',
		data: { ...user._doc },
	});
};

export const verifyUser = async (req, res) => {
	try {
		const { userId } = req;

		if (userId) {
			const user = await User.findOne({ _id: userId }).populate({
				path: 'players',
				populate: [{ path: 'avatar' }, { path: 'group' }],
			});

			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ error: `No user with id ${userId}` });
			}

			return res.status(StatusCodes.OK).json({
				message: 'Verification Successful',
				data: {
					...user._doc,
				},
			});
		}
	} catch (error) {
		console.error('Error verifying user:', error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'An error occurred while verifying the user',
		});
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

	return res.status(StatusCodes.OK).json({
		message: 'Successful',
		data: { ...user._doc },
	});
};

export const getUsers = async (req, res) => {
	const users = await User.find({});

	if (!users) {
		res.status(StatusCodes.OK).json({ error: 'No users in the database' });
	}

	res.status(StatusCodes.OK).json({
		message: 'Successful',
		count: users.length,
		data: { ...users },
	});
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.json({ error: 'Please provide user id' });
	}

	await User.findByIdAndDelete(id);

	return res.status(StatusCodes.OK).json({ msg: 'Deleted!' });
};

const registerSchema = (requestBody) => {
	const schema = Joi.object({
		// role: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string()
			.min(8)
			.regex(/^(?=.*[A-Z])/)
			.message('"Password" must contain at least one uppercase letter.')
			.regex(/^(?=.*\d)/)
			.message('"Password" must contain at least one digit.')
			.regex(/^(?=.*[!@#$%^&*])/)
			.message('"Password" must contain at least one special character.')
			.required(),
	});

	return schema.validate(requestBody);
};

const loginSchema = (requestBody) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});

	return schema.validate(requestBody);
};
