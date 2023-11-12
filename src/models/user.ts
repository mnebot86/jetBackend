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
			enum: ['COACH', 'PLAYER'],
			default: ['COACH'],
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
		},
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
