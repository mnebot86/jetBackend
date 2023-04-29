import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;

		next();
	} catch (error) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.json({ message: 'Authentication failed' });
	}
};
