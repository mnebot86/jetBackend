import { InferSchemaType, Schema, model } from 'mongoose';

const groupSchema = new Schema(
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
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		coaches: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		teamMoms: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		games: [
			{
				type: Schema.Types.ObjectId,
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
				type: Schema.Types.ObjectId,
				ref: 'GameFilm',
			},
		],
		tutorials: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tutorial',
			},
		],
		announcementChat: {
			type: Schema.Types.ObjectId,
			ref: 'AnnouncementChat',
		},
		huddleChat: {
			type: Schema.Types.ObjectId,
			ref: 'HuddleChat',
		},
	},
	{ timestamps: true }
);

type Group = InferSchemaType<typeof groupSchema>;

export default model<Group>('Group', groupSchema);
