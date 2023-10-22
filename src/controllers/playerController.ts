import { RequestHandler } from "express";
import Player from "../models/player";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

export const createPlayer: RequestHandler = async (req, res, next) => {
	const { avatar, firstName, lastName, group, medicalConditions, allergies } = req.body;

	try {
		if (!avatar || !firstName || !lastName || !group) {
			throw createHttpError(StatusCodes.BAD_REQUEST, 'Parameters missing.')
		}
		
		const playerAlreadyExist = await Player.findOne({firstName, lastName});

		if (playerAlreadyExist) {
			throw createHttpError(StatusCodes.CONFLICT, 'This Player already exist.')
		}

		const player = await Player.create({
			...req.body,
			allergies,
			medicalConditions,
			avatar: {
				url: avatar.url,
				imageId: avatar.imageId,
			}
		});

		res.status(StatusCodes.CREATED).json(player.toObject());
	} catch (error) {
		next(error)
	}
};
