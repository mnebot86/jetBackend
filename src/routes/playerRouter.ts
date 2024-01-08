import express from 'express';
import * as PlayerController from '../controllers/playerController';
import { requireAuth } from '../middleware/checkAuth';
import { setupMulter } from "../utils/muter";

const uploads = setupMulter();

const router = express.Router();

router.route('/').post(requireAuth, PlayerController.createPlayer).get(requireAuth, PlayerController.getPlayers);
router.route('/:playerId').get(requireAuth, PlayerController.getPlayer).patch(uploads.single("avatar"), requireAuth, PlayerController.updatePlayer);

export default router;
