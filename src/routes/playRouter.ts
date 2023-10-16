import express from 'express';
import * as PlayController from '../controllers/playController';
import { requireAuth } from '../middleware/checkAuth';
import { setupMulter } from '../utils/muter';

const router = express.Router({ mergeParams: true });

const uploads = setupMulter();

router.route('/').post(uploads.single('play_picture'), requireAuth, PlayController.createPlay).get(requireAuth, PlayController.getAllPlays);
router.route('/:id').get(requireAuth, PlayController.getPlay).patch(uploads.single('play_picture'), requireAuth, PlayController.updatePlay).delete(requireAuth, PlayController.deletePlay);

export default router;
