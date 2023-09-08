import express from 'express';
import { createAvatar } from '../controllers/avatarController.js';
import { checkAuth } from '../middleware/authenticated.js';
import { setupMulter } from '../utils/muter.js';

const uploads = setupMulter();

const router = express.Router();

router.route('/').post(uploads.single('avatar'), checkAuth, createAvatar);

export default router;
