import mongoose from 'mongoose';

const playSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			enum: ['Offense, Defense, Special Teams'],
			required: [true, 'Please provide name'],
		},
		description: {
			type: String,
		},
		image: {
			type: String,
		},
		image: {
			type: string,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Play', playSchema);
