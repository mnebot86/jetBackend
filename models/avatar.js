import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: [true, 'Provide a url for image'],
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Avatar', avatarSchema);
