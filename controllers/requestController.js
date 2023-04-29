import Request from '../models/request.js';
import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';

export const sendRequest = async (req, res) => {
	const { userId, createdBy } = req.body;

	if (!userId || !createdBy) {
		res.status(StatusCodes.BAD_REQUEST).json({ error: 'Ids is required' });
	}

	const requestAlreadyExist = await Request.findOne({
		userId,
		createdBy,
	});

	if (requestAlreadyExist) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Request already made' });
	}

	const request = await Request.create({ ...req.body });

	//add request to the user getting requested
	const user = await User.findByIdAndUpdate(
		userId,
		{
			$push: { requests: request._doc },
		},
		{ new: true }
	);

	if (!user) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: "That user doesn't exist",
		});
	}

	//createBy user requestQue
	await User.findByIdAndUpdate(
		createdBy,
		{
			$push: { requestQues: request._doc },
		},
		{ new: true }
	);

	return res.status(StatusCodes.CREATED).json({ ...request._doc });
};

export const handleRequest = async (req, res) => {
	const { requestId, isAccepted } = req.body;

	if (!requestId || !isAccepted) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Id and boolean is required' });
	}

	const request = await Request.findOne({ _id: requestId });

	if (!request) {
		return res.status(StatusCodes.NOT_FOUND).json('Request not found');
	}

	if (isAccepted === 'Accepted') {
		const requestCreator = await User.findByIdAndUpdate(
			request.createdBy,
			{
				$push: { linkedAccounts: request.userId },
			},
			{ new: true }
		);

		const requestReceiver = await User.findByIdAndUpdate(
			request.userId,
			{
				$push: { linkedAccounts: request.createdBy },
			},
			{ new: true }
		);

		//remove request for requestReceiver array
		await User.findByIdAndUpdate(
			request.userId,
			{
				$pull: { requests: requestId },
			},
			{ new: true }
		);

		await User.findByIdAndUpdate(
			request.createdBy,
			{
				$pull: { requestQues: requestId },
			},
			{ new: true }
		);

		await Request.findByIdAndDelete(requestId);

		return res.status(StatusCodes.OK).json({ msg: 'Link Complete' });
	}

	if (isAccepted === 'Declined') {
		await User.findByIdAndUpdate(
			request.userId,
			{
				$pull: { requests: requestId },
			},
			{ new: true }
		);

		await User.findByIdAndUpdate(
			request.createdBy,
			{
				$pull: { requestQues: requestId },
			},
			{ new: true }
		);

		await Request.findByIdAndDelete(requestId);

		res.status(StatusCodes.OK).json({ msg: 'Request Decline' });
	}
};
