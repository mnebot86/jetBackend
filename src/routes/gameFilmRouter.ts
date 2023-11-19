import express from 'express';
import { requireAuth } from '../middleware/checkAuth';
import * as GameFilmController from '../controllers/gameFileController';

const router = express.Router();

router.route('/').post(requireAuth, GameFilmController.createGameFilm).get(requireAuth, GameFilmController.getGameFilms);

export default router;
