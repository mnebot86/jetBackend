import { InferSchemaType, Schema, model } from 'mongoose';

const videoSchema = new Schema(
	{
		url: {
			type: String,
            require: [true, 'Please provide video url']
		},
		comments: [{
			comment: String,
			playerTags: [{
				type: Schema.Types.ObjectId,
				ref: 'Player'
			}],
			createdBy: {
				type: Schema.Types.ObjectId,
                ref: 'User'
			}
		}]
	},
	{ timestamps: true }
);

type Video = InferSchemaType<typeof videoSchema>;

export default model<Video>('Video', videoSchema);
