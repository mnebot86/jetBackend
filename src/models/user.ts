import { InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			minlength: 2,
			maxlength: 20,
			trim: true,
		},
		lastName: {
			type: String,
			maxlength: 20,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		phoneNumber: {
			type: String,
			minlength: 10,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			select: false,
		},
		avatar: {
			url: {
				type: String,
				require: [true, 'Please Provide an url'],
			},
			cloudinaryId: {
				type: String,
				require: [true, 'CloudinaryId required'],
			},
		},
		roles: {
			type: [String],
			enum: ['COACH', 'TEAM_MOM', 'GUARDIAN', 'PLAYER'],
			default: ['COACH'],
		},
		position: {
			type: String,
			enum: [
				'N/A',
				'Head',
				'Assistant',
				'Defensive Coordinator',
				'Offensive Coordinator',
			],
			default: 'N/A',
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
		},
		backgroundCheck: {
			type: String,
			enum: ['Not Complete', 'Pending', 'Completed'],
			default: 'Not Complete',
		},
		players: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Player',
			},
		],
		expoPushTokens: [
			{
				type: String,
			},
		],
	},
	{ timestamps: true }
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>('User', userSchema);
