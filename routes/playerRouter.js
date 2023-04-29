import express from 'express';
import { getPlayersByGroup } from '../controllers/playerController.js';

const router = express.Router();

router.route('/').post(getPlayersByGroup);

export default router;
