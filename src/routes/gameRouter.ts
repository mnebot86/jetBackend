import express from 'express';
import * as GameController from '../controllers/gameController'

const router = express.Router();

router.route('/').post(GameController.createGame).get(GameController.getGames);
router.route('/:id').patch(GameController.updateGame).get(GameController.getGame).delete(GameController.deleteGame);

export default router;
