import { InferSchemaType, Schema, model } from 'mongoose';

const playSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide name'],
		},
		description: {
			type: String,
		},
		image: {
			url: String,
			cloudinaryId: String,
		},
		formation: {
			type: Schema.Types.ObjectId,
			ref: 'Formation',
		},
	},
	{ timestamps: true }
);

type Play = InferSchemaType<typeof playSchema>;

export default model<Play>('Play', playSchema);
