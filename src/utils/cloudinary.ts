import env from '../utils/validateEnv';
import { v2 as cloudinary } from 'cloudinary';

export const initializeCloudinary = () => {
	cloudinary.config({
		cloud_name: env.CLOUD_NAME,
		api_key: env.CLOUD_API_KEY,
		api_secret: env.CLOUD_API_SECRET,
	});
};
