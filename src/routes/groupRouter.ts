import express from 'express';
import { requireAuth } from '../middleware/checkAuth';
import * as GroupController from '../controllers/groupController'

const router = express.Router();

router.route('/').post(requireAuth, GroupController.createGroup).get(requireAuth, GroupController.getGroups);
router
	.route('/:id')
	.get(requireAuth, GroupController.getGroup)
	.delete(requireAuth, GroupController.deleteGroup)
	.patch(requireAuth, GroupController.updateGroup);

export default router;
