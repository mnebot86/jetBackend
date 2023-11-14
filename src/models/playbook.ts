import { InferSchemaType, Schema, model } from 'mongoose';

const playbookSchema = new Schema(
	{
		name: {
			type: String,
			enum: ['Offense', 'Defense', 'Special Teams'],
			required: [true, 'Please provide name'],
		},
		formations: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Formation',
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group'
		}
	},
	{ timestamps: true }
);

type Playbook = InferSchemaType<typeof playbookSchema>;

export default model<Playbook>('Playbook', playbookSchema);
