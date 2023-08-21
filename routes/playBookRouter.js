import express from 'express';
import { checkAuth } from '../middleware/authenticated.js';
import {
	createPlaybook,
	getPlaybooks,
	getPlaybook,
	updatePlaybook,
	deletePlaybook,
} from '../controllers/playbookController.js';

const router = express.Router();

router.route('/').post(checkAuth, createPlaybook).get(checkAuth, getPlaybooks);
router
	.route('/:id')
	.get(checkAuth, getPlaybook)
	.delete(checkAuth, deletePlaybook)
	.patch(checkAuth, updatePlaybook);

export default router;
