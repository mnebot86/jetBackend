import { InferSchemaType, Schema, model } from 'mongoose';

const avatarSchema = new Schema(
	{
		url: {
			type: String,
			required: [true, 'Provide a url for image'],
		},
		cloudinaryId: String,
	},
	{ timestamps: true }
);

type Avatar = InferSchemaType<typeof avatarSchema>

export default model<Avatar>('Avatar', avatarSchema);
