import { InferSchemaType, Schema, model } from 'mongoose';

const videoSchema = new Schema(
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
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		category: {
			type: String,
			enum: ['GameFile', 'Tutorial'],
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
		},
	},
	{ timestamps: true }
);

type Video = InferSchemaType<typeof videoSchema>;

export default model<Video>('Video', videoSchema);
