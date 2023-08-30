import mongoose from 'mongoose';

const formationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide name'],
		},
		image: {
			url: String,
			cloudinaryId: String
		},
		plays: [{ 
			type: mongoose.Types.ObjectId, 
			ref: 'Play' 
		}],
		playbook: { 
			type: mongoose.Types.ObjectId,
			 ref: 'Playbook' 
			}
	},
	{ timestamps: true }
);

export default mongoose.model('Formation', formationSchema);
