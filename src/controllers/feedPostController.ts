import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { io } from '../app';
import FeedPost from '../models/feedPost';
import User from '../models/user';
import { sendNotifications } from '../utils/notifications';

export const createFeedPost: RequestHandler = async (req, res) => {
	const { userId } = req.session;

	const feedPost = await FeedPost.create({ ...req.body, createdBy: userId });

	const usersWithTokens = await User.find({
		$and: [
			{ _id: { $ne: userId } },
			{ expoPushTokens: { $exists: true, $not: { $size: 0 } } },
		],
	});

	const tokens: string[] = usersWithTokens.reduce(
		(allTokens: string[], user) => [...allTokens, ...user.expoPushTokens],
		[]
	);

	const title = 'New Feed Post';
	const body = feedPost.message || '';
	const screen = 'Feed'

	io.emit('new_feed', feedPost);

	await sendNotifications(tokens, title, body, screen);

	return res.status(StatusCodes.CREATED).json({
		message: 'Feed Post created successfully!',
		data: {
			feedPost,
		},
	});
};

export const getFeedPosts: RequestHandler = async (req, res) => {
	const { page = '1', perPage = '15' } = req.query;

	const skip = (Number(page) - 1) * Number(perPage);
	const limit = Number(perPage);

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
					totalPages: Math.ceil(totalPosts / Number(perPage)),
				},
			});
		}

		return res.status(StatusCodes.OK).json({
			message: 'Successful',
			data: {
				feedPosts,
				currentPage: page,
				totalPages: Math.ceil(totalPosts / Number(perPage)),
			},
		});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'Error fetching feed posts',
				error: error.message,
			});
		}
	}
};

export const getFeedPost: RequestHandler = async (req, res) => {
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

	return res.status(StatusCodes.OK).json({ 
		message: 'Successful',
		data: { feedPost }, 
	});
};

export const updateFeedPost: RequestHandler = async (req, res) => {
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

	const allTokens: string[] = otherUsers.reduce(
		(tokensArray: string[], otherUser) => [
			...tokensArray,
			...otherUser.expoPushTokens,
		],
		[]
	);

	const allUsersTitle = 'Feed Post Update';
	const allUsersBody = `A feed post has been updated: ${feedPost.message}`;

	await sendNotifications(allTokens, allUsersTitle, allUsersBody);

	return res.status(StatusCodes.OK).json({
		message: 'Post Updated Successfully',
		data: { feedPost },
	});
};

export const deleteFeedPost: RequestHandler = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.session;

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
