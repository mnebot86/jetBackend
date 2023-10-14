import express from 'express';
import { requireAuth } from '../middleware/checkAuth.js';
import * as UserController from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(requireAuth, UserController.getAuthenticatedUser);
router.route('/register').post(UserController.register);
router.route('/login').post(UserController.login);
router.route('/users').get(requireAuth, UserController.getUsers);
router
	.route('/users/:id')
	.get(requireAuth, UserController.getUser)
	.delete(requireAuth, UserController.deleteUser)
	.patch(requireAuth, UserController.updateUser);

export default router;
