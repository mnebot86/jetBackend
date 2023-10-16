import express from 'express';
import { requireAuth } from '../middleware/checkAuth';
import * as FeedPostController from '../controllers/feedPostController'

const router = express.Router();

router.route('/')
	.post(requireAuth, FeedPostController.createFeedPost)
	.get(requireAuth, FeedPostController.getFeedPosts);

router
	.route('/:id')
	.get(requireAuth, FeedPostController.getFeedPost)
	.delete(requireAuth, FeedPostController.deleteFeedPost)
	.patch(requireAuth, FeedPostController.updateFeedPost);

export default router;
