import { InferSchemaType, Schema, model } from 'mongoose';


const gameFilmSchema = new Schema(
	{
		team: {
			type: String,
			require: [true, 'Please provide team name']
		},
		videos: {
			type: [String]
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group'
		},
		date: {
			type: String,
			require: [true, 'Please provide game date']
		}
	},
	{ timestamps: true }
);

type GameFilm = InferSchemaType<typeof gameFilmSchema>;

export default model('GameFilm', gameFilmSchema);
