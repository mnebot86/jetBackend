import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			minlength: 2,
			maxlength: 20,
			trim: true,
			required: [true, 'Please provide first name'],
		},
		lastName: {
			type: String,
			maxlength: 20,
			required: [true, 'Please provide last name'],
		},
		phoneNumber: {
			type: String,
			minlength: 10,
			required: [true, 'Please provide phone number'],
		},
		avatar: {
			type: mongoose.Types.ObjectId,
			ref: 'Avatar',
		},
		role: {
			type: String,
			enum: ['FOOTBALL_PLAYER', 'CHEERLEADER'],
			required: [true, 'Please select a role'],
		},
		group: {
			type: mongoose.Types.ObjectId,
			ref: 'Group',
			required: [true, 'Provided a group id'],
		},
		guardians: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
		age: {
			type: Number,
			required: [true, 'Please provide age'],
		},
		birthday: {
			type: Date,
			required: [true, 'Please provide birthday'],
		},
		grade: {
			type: Number,
			required: [true, 'Please provide grade'],
		},
		weight: {
			type: Number,
		},
		isStriper: {
			type: Boolean,
			default: false,
		},
		positions: [
			{
				type: String,
				enum: [
					'N/A',
					'QB',
					'RB',
					'FB',
					'WR',
					'TE',
					'OL',
					'C',
					'G',
					'T',
					'K',
					'DL',
					'DT',
					'DE',
					'NT',
					'LB',
					'OLB',
					'MLB',
					'DB',
					'CB',
					'S',
					'P',
					'PR',
				],
				default: 'N/A',
			},
		],
		totalAbsent: {
			type: Number,
			default: 0,
		},
		jerseyNumber: {
			type: Number,
			default: null,
		},
		allergies: [
			{
				type: String,
			},
		],
		medicalConditions: [
			{
				type: String,
			},
		],
		doctorName: {
			type: String,
		},
		doctorNumber: {
			type: String,
		},
		registrationPaid: {
			type: Boolean,
			default: false,
		},
		fundraiserCompleted: {
			type: Boolean,
			default: false,
		},
		school: {
			type: String,
		},
		address: {
			street: {
				type: String,
			},
			city: {
				type: String,
			},
			state: {
				type: String,
			},
			zip: {
				type: String,
			},
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Player', playerSchema);
