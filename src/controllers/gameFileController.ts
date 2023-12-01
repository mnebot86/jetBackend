import GameFilm from '../models/gameFilm';
import User from '../models/user';
import { RequestHandler } from 'express';
import { initializeCloudinary } from '../utils/cloudinary';
import { StatusCodes } from 'http-status-codes';
import { io } from '../app';

initializeCloudinary();

export const createGameFilm: RequestHandler = async (req, res, next) => {
	const { userId } = req.session;
	const { team, date } = req.body;
	
	try {
		if (!team) {
			return res.status(StatusCodes.BAD_REQUEST).json({error: 'Provide opposing team name'})
		}
		
		const user = await User.findById(userId);

		const AlreadyExist = await GameFilm.find({ team, date })

		if (AlreadyExist.length) {
			return res.status(StatusCodes.CONFLICT).json({ error: 'Already exist' });
		}

		const gameFilm = await GameFilm.create({ team, group: user?.group, date });

		io.emit('new_gameFilm', gameFilm);

		return res.status(StatusCodes.CREATED).json(gameFilm);
	} catch (error) {
		next(error);
	}
}

export const getGameFilms: RequestHandler = async (req, res, next) => {
	const { userId } = req.session;

	try {
		const user = await User.findById(userId);
		
		const gameFilms = await GameFilm.find({ group: user?.group })
		
		return res.status(StatusCodes.OK).json(gameFilms);
	} catch (error) {
		next(error);
	}
}

export const getGameFilm: RequestHandler = async (req, res, next) => {
	const { gameFilmId } = req.params;

	try {
		const gameFilm = await GameFilm.findById(gameFilmId);
		
		if (!gameFilm) {
			return res.status(StatusCodes.NOT_FOUND).json({ error: 'No game film found'})
		}

		return res.status(StatusCodes.OK).json(gameFilm);
	} catch (error) {
		next(error);
	}
}
