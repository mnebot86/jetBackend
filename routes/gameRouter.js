import express from 'express';
import {
	createGame,
	getGame,
	getGames,
	updateGame,
	deleteGame,
} from '../controllers/gameController.js';

const router = express.Router();

router.route('/').post(createGame).get(getGames);
router.route('/:id').patch(updateGame).get(getGame).delete(deleteGame);

export default router;
