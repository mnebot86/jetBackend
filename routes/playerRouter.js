import express from 'express';
import { addPlayer } from '../controllers/playerController.js';

const router = express.Router();

router.route('/').post(addPlayer);

export default router;
