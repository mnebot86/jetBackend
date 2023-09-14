import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
	const defaultError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		message: err.message || 'Something went wrong, please try again later',
	};

	// Handle Mongoose validation errors
	if (err instanceof mongoose.Error.ValidationError) {
		defaultError.statusCode = StatusCodes.BAD_REQUEST;

		// Extract validation error messages
		const validationErrors = Object.values(err.errors).map(error => error.message);
		defaultError.message = `Validation errors: ${validationErrors.join(', ')}`;
	}

	if (err.code && err.code === 11000) {
		defaultError.statusCode = StatusCodes.BAD_REQUEST;
		defaultError.message = `${Object.keys(err.keyValue)} field must be unique`;
	}

	res.status(defaultError.statusCode).json({ error: defaultError.message });
};

export default errorHandlerMiddleware;
