import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

export const passwordValidation = (password: string) => {
	const hasUppercase = /[A-Z]/.test(password);
	const hasDigit = /\d/.test(password);
	const hasSymbol = /[!@#$%^&*]/.test(password);
	const isLengthValid = password.length >= 8;
  
	if (!hasUppercase) {
		throw createHttpError(StatusCodes.BAD_REQUEST, 'Must contain at least one uppercase letter.');
	}
  
	if (!hasDigit) {
		throw createHttpError(StatusCodes.BAD_REQUEST, 'Must contain at least one digit.');
	}
  
	if (!hasSymbol) {
		throw createHttpError(StatusCodes.BAD_REQUEST, 'Must contain at least one symbol (!@#$%^&*).');
	}
  
	if (!isLengthValid) {
		throw createHttpError(StatusCodes.BAD_REQUEST, 'Must be at least 8 characters long.');
	}
};

export const isEmailValid = (email: string) => {
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
	const isValid = emailRegex.test(email);

	if (!isValid) {
		throw createHttpError(StatusCodes.BAD_REQUEST, 'Provide a valid email.');
	}
};
