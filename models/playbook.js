import mongoose from 'mongoose';

const playbookSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			enum: ['Offense', 'Defense', 'Special Teams'],
			required: [true, 'Please provide name'],
		},
		formations: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Formation',
			},
		],
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Playbook', playbookSchema);
