import mongoose from 'mongoose';

export const mongoConnect = (uri) => {
	mongoose.connect(uri);

	mongoose.connection.on('connected', () => {
		console.log('Connected to MongoDB');
	});

	mongoose.connection.on('error', (error) => {
		console.error('Error connection to MongoDB', error);
	});
};
