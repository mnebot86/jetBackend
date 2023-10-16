import { InferSchemaType, Schema, model } from 'mongoose';

const formationSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide name'],
		},
		image: {
			url: String,
			cloudinaryId: String,
		},
		plays: [{ 
			type: Schema.Types.ObjectId, 
			ref: 'Play', 
		}],
		playbook: { 
			type: Schema.Types.ObjectId,
			ref: 'Playbook', 
		},
	},
	{ timestamps: true }
);

type Formation = InferSchemaType<typeof formationSchema>;

export default model<Formation>('Formation', formationSchema);
