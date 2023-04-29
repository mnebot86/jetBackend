import express from 'express';
import {
	createGroup,
	getGroups,
	getGroup,
	updateGroup,
	deleteGroup,
} from '../controllers/groupController.js';

const router = express.Router();

router.route('/').post(createGroup).get(getGroups);
router.route('/:id').get(getGroup).delete(deleteGroup).patch(updateGroup);

export default router;
