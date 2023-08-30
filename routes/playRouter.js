import express from 'express';
import { createPlay, getAllPlays, getPlay, updatePlay, deletePlay } from '../controllers/playController.js';
import { checkAuth } from '../middleware/authenticated.js';
import { setupMulter } from '../utils/muter.js'

const router = express.Router({ mergeParams: true });

const uploads = setupMulter();

router.route('/').post(uploads.single('play_picture'), checkAuth, createPlay).get(checkAuth, getAllPlays);
router.route('/:id').get(checkAuth, getPlay).patch(uploads.single('play_picture'), checkAuth, updatePlay).delete(checkAuth, deletePlay);

export default router;
