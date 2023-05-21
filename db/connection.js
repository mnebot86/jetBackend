import mongoose from 'mongoose';

export const mongoConnect = async (uri) => {
	try {
		await mongoose.connect(uri);
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
	}
};
