import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: [true, 'Provide a url for image'],
		},
		cloudinaryId: String,
	},
	{ timestamps: true }
);

export default mongoose.model('Avatar', avatarSchema);
