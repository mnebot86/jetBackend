import mongoose from 'mongoose';

const playSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide name'],
		},
		description: {
			type: String,
		},
		image: {
			url: String,
			cloudinaryId: String,
		},
		formation: {
			type: mongoose.Types.ObjectId,
			ref: 'Formation',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Play', playSchema);
