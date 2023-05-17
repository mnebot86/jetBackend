import express from 'express';
import { addPlayer, getPlayer } from '../controllers/playerController.js';
import { checkAuth } from '../middleware/authenticated.js';

const router = express.Router();

router.route('/').post(checkAuth, addPlayer);
router.route('/:id').get(checkAuth, getPlayer);

export default router;
