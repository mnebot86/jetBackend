import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
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
			enum: ['COACH', 'TEAM_MOM', 'GUARDIAN'],
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
		group: {
			type: mongoose.Types.ObjectId,
			ref: 'Group',
		},
		backgroundCheck: {
			type: String,
			enum: ['Not Complete', 'Pending', 'Completed'],
			default: 'Not Complete',
		},
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
	},
	{ timestamps: true }
);

userSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(11);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
	const SECRET = process.env.JWT_SECRET;
	const LIFETIME = process.env.JWT_LIFETIME;

	return jwt.sign({ userId: this._id }, SECRET, { expiresIn: LIFETIME });
};

userSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);

	return isMatch;
};

export default mongoose.model('User', userSchema);
