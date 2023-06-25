import express from 'express';
import { checkAuth } from '../middleware/authenticated.js';

import {
	createFeedPost,
	getFeedPosts,
	getFeedPost,
	updateFeedPost,
	deleteFeedPost,
} from '../controllers/feedPostController.js';

const router = express.Router();

router.route('/').post(checkAuth, createFeedPost).get(checkAuth, getFeedPosts);
router
	.route('/:id')
	.get(checkAuth, getFeedPost)
	.delete(checkAuth, deleteFeedPost)
	.patch(checkAuth, updateFeedPost);

export default router;
