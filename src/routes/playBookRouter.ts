import express from 'express';
import { requireAuth } from '../middleware/checkAuth';
import * as PlaybookController from '../controllers/playbookController'
import {
	createPlaybook,
	getPlaybooks,
	getPlaybook,
	updatePlaybook,
	deletePlaybook,
} from '../controllers/playbookController.js';

const router = express.Router();

router.route('/').post(requireAuth, PlaybookController.createPlaybook).get(requireAuth, PlaybookController.getPlaybooks);
router
	.route('/:id')
	.get(requireAuth, PlaybookController.getPlaybook)
	.delete(requireAuth, PlaybookController.deletePlaybook)
	.patch(requireAuth, PlaybookController.updatePlaybook);

export default router;
