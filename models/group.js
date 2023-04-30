import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Provide a name for role'],
			enum: [
				'Varsity',
				'Varsity Cheer',
				'Junior Varsity',
				'Junior Varsity Cheer',
				'Peewee',
				'Peewee Cheer',
				'Junior Peewee',
				'Junior Peewee Cheer',
				'Flag',
				'Flag Cheer',
			],
		},
		ages: {
			min: {
				type: Number,
				required: [true, 'Provide a min age for this group'],
			},
			max: {
				type: Number,
				required: [true, 'Provide a max age for this group'],
			},
		},
		roster: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
		coaches: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
		teamMoms: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
		games: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Game',
			},
		],
		record: {
			wins: {
				type: Number,
				default: 0,
			},
			draws: {
				type: Number,
				default: 0,
			},
			loses: {
				type: Number,
				default: 0,
			},
		},
		gameFilms: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'GameFilm',
			},
		],
		tutorials: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Tutorial',
			},
		],
		announcementChat: {
			type: mongoose.Types.ObjectId,
			ref: 'AnnouncementChat',
		},
		huddleChat: {
			type: mongoose.Types.ObjectId,
			ref: 'HuddleChat',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Group', groupSchema);
