import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/user.js';
import { isEmailValid, passwordValidation } from '../utils/validators.js';

export const getAuthenticatedUser = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.session.userId).exec();

		res.status(StatusCodes.OK).json(user);
	} catch (error) {
		next(error);
	}
};

export const register = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			throw createHttpError(StatusCodes.BAD_REQUEST, 'Parameters missing');
		}

		isEmailValid(email);

		passwordValidation(password);

		const userAlreadyExists = await UserModel.findOne({ email });
		
		if (userAlreadyExists) {
			throw createHttpError(StatusCodes.CONFLICT, 'Email already taken.');
		}

		const passwordHashed = await bcrypt.hash(password, 10);

		const newUser = await UserModel.create({
			email,
			password: passwordHashed,
		});

		req.session.userId = newUser._id;

		res.status(StatusCodes.CREATED).json({ ...newUser._doc, password: null });
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			throw createHttpError(StatusCodes.BAD_REQUEST, 'Parameters missing');
		}
		
		const user = await UserModel.findOne({ email }).select('+password').exec();

		if (!user) {
			return createHttpError(StatusCodes.UNAUTHORIZED, 'Invalid Credentials');
		}
		
		const isPasswordCorrect = await user.comparePassword(password);

		if (!isPasswordCorrect) {
			throw createHttpError(StatusCodes.UNAUTHORIZED, 'Invalid Credentials');
		}
		
		req.session.userId = user._id;

		res.status(StatusCodes.OK).json({ ...user._doc, password: null });
	} catch (error) {
		next(error);
	}
};

export const logout = (req, res, next) => {
	req.session.destroy(error => {
		if (error) {
			next(error);
		} else {
			res.sendStatus(200);
		}
	});
};

export const updateUser = async (req, res, next) => {
	const { id } = req.params;

	try {
		if (!id) {
			throw createHttpError(StatusCodes.BAD_REQUEST, 'Please provide user id');
		}
	
		const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
		
		if (!user) {
			throw createHttpError(StatusCodes.NOT_FOUND, `No user with ID: ${id} found!`);
		}

		return res.status(StatusCodes.OK).json(user);
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req, res, next) => {
	const { id } = req.params;

	try {
		if (!id) {
			throw createHttpError(StatusCodes.BAD_REQUEST, 'User Id required');
		}
	
		const user = await UserModel.findOne({ _id: id }).exec();
	
		if (!user) {
			throw createHttpError(StatusCodes.NOT_FOUND, `User with Id: ${id} not found`);
		}
	
		return res.status(StatusCodes.OK).json(user._doc);
	} catch (error) {
		next(error);
	}
};

export const getUsers = async (req, res, next) => {
	try {
		const users = await UserModel.find({});
		
		if (!users) {
			res.status(StatusCodes.OK).json({});
		}

		res.status(StatusCodes.OK).json(users);
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	const { id } = req.params;

	try {
		if (!id) {
			throw createHttpError(StatusCodes.BAD_REQUEST, 'Please provide user id');
		}

		const user = await UserModel.findByIdAndDelete(id);

		if (!user) {
			throw createHttpError(StatusCodes.NOT_FOUND, `User with Id: ${user} not found`);
		}

		return res.sendStatus(StatusCodes.OK);
	} catch (error) {
		next(error);
	}
};
