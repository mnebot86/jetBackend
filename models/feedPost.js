import mongoose from 'mongoose';

const feedPostSchema = new mongoose.Schema(
	{
		message: {
			type: String,
			require: [true, 'Please provide a message'],
		},
		group: {
			type: String,
			enum: [
				'ADMIN',
				'VARSITY',
				'JUNIOR_VARSITY',
				'PEEWEE',
				'JUNIOR_PEEWEE',
				'FLAG',
				'VARSITY_CHEER',
				'JV_CHEER',
				'PEEWEE_CHEER',
				'JUNIOR_PEEWEE_CHEER',
				'FLAG_CHEER',
			],
			require: [true, 'Please provide a group name'],
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('FeedPost', feedPostSchema);
