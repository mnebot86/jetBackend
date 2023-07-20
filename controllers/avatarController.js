import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

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
	} catch (error) {
		console.log(error);
	}
};
