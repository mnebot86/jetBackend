import express from 'express';
import { checkAuth } from '../middleware/authenticated.js';
import {
	register,
	login,
	updateUser,
	verifyUser,
	getUsers,
	getUser,
	deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/verifyUser').get(checkAuth, verifyUser);
router.route('/users').get(checkAuth, getUsers);
router
	.route('/users/:id')
	.get(checkAuth, getUser)
	.delete(checkAuth, deleteUser)
	.patch(checkAuth, updateUser);

export default router;
