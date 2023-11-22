import express from 'express';
import * as PlayerController from '../controllers/playerController';
import { requireAuth } from '../middleware/checkAuth';

const router = express.Router();

router.route('/').post(requireAuth, PlayerController.createPlayer).get(requireAuth, PlayerController.getPlayers);
router.route('/:playerId').get(requireAuth, PlayerController.getPlayer);

export default router;
