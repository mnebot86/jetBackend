import Avatar from '../models/avatar.js';
import Player from '../models/player.js';
import User from '../models/user.js';
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
		const { playerId } = req.body;

		const id = playerId || userId;

		const result = await cloudinary.uploader.upload(req.file.path, {
			public_id: `user_profile/${id}`,
			width: 500,
			height: 500,
			crop: 'fill',
		});

		const alreadyExist = await Avatar.findOne({
			createdBy: id,
		});

		let avatar;

		if (alreadyExist) {
			avatar = await Avatar.findByIdAndUpdate(
				alreadyExist._doc._id,
				{
					url: result.secure_url,
				},
				{ new: true }
			);
		} else {
			avatar = await Avatar.create({
				url: result.secure_url,
				createdBy: id,
			});
		}

		if (!!playerId) {
			const player = await Player.findByIdAndUpdate(
				playerId,
				{
					avatar: avatar._doc._id,
				},
				{ new: true }
			);
		} else {
			const user = await User.findByIdAndUpdate(
				userId,
				{
					avatar: avatar._doc._id,
				},
				{ new: true }
			);
		}

		res.status(StatusCodes.OK).json(avatar._doc);
	} catch (error) {
		console.log(error);
	}
};
