import FeedPost from '../models/feedPost.js';
import { io } from '../app.js';
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

	io.emit('new_feed', feedPost);

	return res.status(StatusCodes.CREATED).json({
		message: 'Feed Post created successfully!',
		data: {
			feedPost,
		},
	});
};

export const getFeedPosts = async (req, res) => {
	const feedPosts = await FeedPost.find({});

	if (!feedPosts) {
		return res.status(StatusCodes.OK).json({
			message: 'Successfully!',
			data: {
				feedPosts: 'No Feed Posts Created',
			},
		});
	}

	const reverseFeedPost = feedPosts.reverse();

	return res.status(StatusCodes.OK).json({
		message: 'Successfully!',
		data: {
			reverseFeedPost,
		},
	});
};

export const getFeedPost = (req, res) => {
	return res.send('Get Feed Post');
};

export const updateFeedPost = (req, res) => {
	return res.send('Update Feed Post');
};

export const deleteFeedPost = (req, res) => {
	return res.send('Delete Feed Post');
};

const createFeedPostSchema = (requestBody) => {
	const schema = Joi.object({
		message: Joi.string().required(),
		group: Joi.string().required(),
	});

	return schema.validate(requestBody);
};
