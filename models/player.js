import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const playerSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			minlength: 2,
			maxlength: 20,
			trim: true,
		},
		lastName: {
			type: String,
			maxlength: 20,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			validate: {
				validator: validator.isEmail,
				message: 'Please provide a valid email',
			},
			unique: true,
		},
		phoneNumber: {
			type: String,
			minlength: 10,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			select: false,
			validate: {
				validator: (password) => {
					return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
						password
					);
				},
				message:
					'Password should be at least 8 characters long, contain at least one uppercase letter, one number, and one of the following symbols: !@#$%^&*',
			},
		},
		avatar: {
			type: String,
			validate: {
				validator: validator.isURL,
				message: 'Please provide a valid url',
			},
		},
		role: {
			type: String,
			enum: ['FOOTBALL_PLAYER', 'CHEERLEADER'],
			required: [true, 'Please select a role'],
		},
		position: {
			type: String,
			enum: [
				'N/A',
				'Head',
				'Assistant',
				'Defensive Coordinator',
				'Offensive Coordinator',
			],
			default: 'N/A',
		},
		groups: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Group',
				required: [true, 'Provided a group id'],
			},
		],
		requests: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Request',
				default: [],
			},
		],
		requestQues: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Request',
				default: [],
			},
		],
		linkedAccounts: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
		age: {
			type: Number,
		},
		birthday: {
			type: Date,
		},
		grade: {
			type: Number,
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

playerSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(11);
	this.password = await bcrypt.hash(this.password, salt);
});

playerSchema.methods.createJWT = function () {
	const SECRET = process.env.JWT_SECRET;
	const LIFETIME = process.env.JWT_LIFETIME;

	return jwt.sign({ userId: this._id }, SECRET, { expiresIn: LIFETIME });
};

playerSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);

	return isMatch;
};

export default mongoose.model('Player', playerSchema);
