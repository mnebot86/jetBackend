import express from 'express';
import { requireAuth } from '../middleware/checkAuth';
import * as MessageController from '../controllers/messageController'

const router = express.Router();

router.route('/')
	.post(requireAuth, MessageController.createMessage).get(requireAuth, MessageController.getAllMessages);

export default router;
