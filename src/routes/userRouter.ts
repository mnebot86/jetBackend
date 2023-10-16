import express from 'express';
import * as UserController from '../controllers/userController';
import { requireAuth } from '../middleware/checkAuth';

const router = express.Router();

router.route('/').get(requireAuth, UserController.getAuthenticatedUser);
router.route('/register').post(UserController.register);
router.route('/login').post(UserController.login);
router.route('/logout').post(UserController.logout);
router.route('/users').get(requireAuth, UserController.getUsers);

router
	.route('/users/:id')
	.get(requireAuth, UserController.getUser)
	.delete(requireAuth, UserController.deleteUser)
	.patch(requireAuth, UserController.updateUser);

export default router;
