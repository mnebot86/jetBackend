import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			required: [true, 'Provide id'],
		},
		isAccepted: {
			type: String,
			enum: ['Pending', 'Accepted', 'Decline'],
			default: 'Pending',
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			required: [true, 'Provide createBy id'],
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Request', requestSchema);
