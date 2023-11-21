import { InferSchemaType, Schema, model } from 'mongoose';


const messageSchema = new Schema(
	{
		message: {
			type: String,
			require: [true, 'Please provide a message'],
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group'
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

type Message = InferSchemaType<typeof messageSchema>;

export default model<Message>('Message', messageSchema);
