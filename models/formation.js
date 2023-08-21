import mongoose from 'mongoose';

const formationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide name'],
		},
		plays: [{ type: mongoose.Types.ObjectId, ref: 'Play' }],
	},
	{ timestamps: true }
);

export default mongoose.model('Formation', formationSchema);