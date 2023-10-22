import { StatusCodes } from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';
import { initializeCloudinary } from '../utils/cloudinary';
import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';

initializeCloudinary();

export const createAvatar: RequestHandler = async (req, res, next) => {
	try {
		const { userId } = req.session;

		const imageId = uuidv4();

		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				public_id: `user_profile/${imageId}`,
				width: 500,
				height: 500,
				crop: 'fill',
			});

			res.status(StatusCodes.OK).json({
				url: result.secure_url,
				imageId: userId,
			});
		}
	} catch(error) {
		console.error(error);
		next(error)
	}
};
