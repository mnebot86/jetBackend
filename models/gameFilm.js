import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		fileName: {
			type: String,
			required: [true, 'Provide a filename'],
		},
		description: {
			type: String,
		},
		url: {
			type: String,
			required: [true, 'Provide a url'],
		},
		thumbnailUrl: {
			type: String,
		},
		duration: {
			type: Number,
		},
		size: {
			type: Number,
		},
		mimeType: {
			type: String,
		},
		uploadedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		category: {
			type: String,
			enum: ['GameFile', 'Tutorial'],
		},
		group: {
			type: mongoose.Types.ObjectId,
			ref: 'Group',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Video', videoSchema);
