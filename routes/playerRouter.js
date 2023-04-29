import express from 'express';
import { addPlayer } from '../controllers/playerController.js';
import { checkAuth } from '../middleware/authenticated.js';

const router = express.Router();

router.route('/').post(checkAuth, addPlayer);

export default router;
