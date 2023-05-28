import express from 'express';
import { checkAuth } from '../middleware/authenticated.js';

import {
	createGroup,
	getGroups,
	getGroup,
	updateGroup,
	deleteGroup,
} from '../controllers/groupController.js';

const router = express.Router();

router.route('/').post(checkAuth, createGroup).get(checkAuth, getGroups);
router
	.route('/:id')
	.get(checkAuth, getGroup)
	.delete(checkAuth, deleteGroup)
	.patch(checkAuth, updateGroup);

export default router;
