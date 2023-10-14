import express from 'express';
import { requireAuth } from '../middleware/checkAuth.js';

import {
	createFeedPost,
	getFeedPosts,
	getFeedPost,
	updateFeedPost,
	deleteFeedPost,
} from '../controllers/feedPostController.js';

const router = express.Router();

router.route('/').post(requireAuth, createFeedPost).get(requireAuth, getFeedPosts);
router
	.route('/:id')
	.get(requireAuth, getFeedPost)
	.delete(requireAuth, deleteFeedPost)
	.patch(requireAuth, updateFeedPost);

export default router;
