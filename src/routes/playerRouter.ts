import express from 'express';
import * as PlayerController from '../controllers/playerController';
import { requireAuth } from '../middleware/checkAuth';

const router = express.Router();

router.route('/').post(requireAuth, PlayerController.createPlayer);

export default router;
