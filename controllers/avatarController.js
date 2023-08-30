import { StatusCodes } from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';
import {initializeCloudinary} from '../utils/cloudinary.js'

initializeCloudinary();

export const createAvatar = async (req, res) => {
	try {
		const { userId } = req;

		const result = await cloudinary.uploader.upload(req.file.path, {
			public_id: `user_profile/${userId}`,
			width: 500,
			height: 500,
			crop: 'fill',
		});

		res.status(StatusCodes.OK).json({
			url: result.secure_url,
			cloudinaryId: userId,
		});
	} catch(err) {
		console.log(err);
	}
};
