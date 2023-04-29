import express from 'express';
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
router.route('/verifyUser').post(verifyUser);
router.route('/users').get(getUsers);
router.route('/users/:id').get(getUser).delete(deleteUser).patch(updateUser);

export default router;
