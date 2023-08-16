import FeedPost from '../models/feedPost.js';
import User from '../models/user.js';
import { io } from '../app.js';
import { sendNotifications } from '../utils/notifications.js';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

export const createFeedPost = async (req, res) => {
	const schema = createFeedPostSchema(req.body);

	if (schema.error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: schema.error.details[0].message,
		});
	}

	const { userId } = req;

	const feedPost = await FeedPost.create({ ...req.body, createdBy: userId });

	const usersWithTokens = await User.find({
		$and: [
			{ _id: { $ne: userId } },
			{ expoPushTokens: { $exists: true, $not: { $size: 0 } } },
		],
	});

	const tokens = usersWithTokens.reduce(
		(allTokens, user) => [...allTokens, ...user.expoPushTokens],
		[]
	);

	const title = 'New Feed Post';
	const body = feedPost.message;

	io.emit('new_feed', feedPost);

	await sendNotifications(tokens, title, body, 1);

	return res.status(StatusCodes.CREATED).json({
		message: 'Feed Post created successfully!',
		data: {
			feedPost,
		},
	});
};

export const getFeedPosts = async (req, res) => {
	const { page = 1, perPage = 15 } = req.query;

	const skip = (page - 1) * perPage;
	const limit = parseInt(perPage);

	try {
		const totalPosts = await FeedPost.countDocuments();
		const feedPosts = await FeedPost.find({})
			.lean()
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });

		if (!feedPosts || feedPosts.length === 0) {
			return res.status(StatusCodes.OK).json({
				message: 'No Feed Posts Found',
				data: {
					feedPost: [],
					currentPage: page,
					totalPages: Match.ceil(totalPosts / perPage),
				},
			});
		}

		return res.status(StatusCodes.OK).json({
			message: 'Successfully',
			data: {
				feedPosts,
				currentPage: page,
				totalPages: Math.ceil(totalPosts / perPage),
			},
		});
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Error fetching feed posts',
			error: error.message,
		});
	}
};

export const getFeedPost = async (req, res) => {
	const {
		params: { id },
	} = req;

	const feedPost = await FeedPost.findById(id);

	if (!feedPost) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'Post not found',
			data: {},
		});
	}

	return res.status(StatusCodes.OK).json({ feedPost });
};

export const updateFeedPost = async (req, res) => {
	const {
		body,
		params: { id },
	} = req;

	const feedPost = await FeedPost.findByIdAndUpdate(id, body, {
		new: true,
	}).lean();

	if (!feedPost) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'Feed Post not found',
			data: {},
		});
	}

	io.emit('update_feed', feedPost);

	const { createdBy } = feedPost;

	const user = await User.findById(createdBy);

	if (!user) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'User not found',
			data: {},
		});
	}

	const otherUsers = await User.find({
		_id: { $ne: createdBy },
		expoPushTokens: { $exists: true, $not: { $size: 0 } },
	});

	const allTokens = otherUsers.reduce(
		(tokensArray, otherUser) => [
			...tokensArray,
			...otherUser.expoPushTokens,
		],
		[]
	);

	const allUsersTitle = 'Feed Post Update';
	const allUsersBody = `A feed post has been updated: ${feedPost.message}`;

	await sendNotifications(allTokens, allUsersTitle, allUsersBody, 1);

	return res.status(StatusCodes.OK).json({
		message: 'Post Updated Successful',
		data: { feedPost },
	});
};

export const deleteFeedPost = async (req, res) => {
	const { id } = req.params;
	const { userId } = req;

	const deletedFeedPost = await FeedPost.findOneAndDelete({
		_id: id,
		createdBy: userId,
	});

	if (!deletedFeedPost) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'Feed Post not found or not authorized for deletion',
			data: {},
		});
	}

	io.emit('delete_feed', id);

	return res.status(StatusCodes.OK).json({
		message: 'Feed Post deleted successfully!',
		data: { deletedFeedPost },
	});
};

const createFeedPostSchema = (requestBody) => {
	const schema = Joi.object({
		message: Joi.string().required(),
		group: Joi.string().required(),
	});

	return schema.validate(requestBody);
};
