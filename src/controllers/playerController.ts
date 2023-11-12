import { RequestHandler } from "express";
import Player from "../models/player";
import User from "../models/user";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { io } from "../app";

export const createPlayer: RequestHandler = async (req, res, next) => {
  const { userId } = req.session;
  const { avatar, firstName, lastName, medicalConditions, allergies } =
    req.body;

  try {
    if (!avatar || !firstName || !lastName) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Parameters missing.");
    }

    const playerAlreadyExist = await Player.findOne({ firstName, lastName });

    if (playerAlreadyExist) {
      throw createHttpError(StatusCodes.CONFLICT, "This Player already exist.");
    }

    const currentUser = await User.findById(userId);

    const player = await Player.create({
      ...req.body,
      allergies,
      medicalConditions,
      avatar: {
        url: avatar.url,
        imageId: avatar.imageId,
      },
      group: currentUser?.group,
    });

    io.emit("new_player", player);

    res.status(StatusCodes.CREATED).json(player.toObject());
  } catch (error) {
    next(error);
  }
};

export const getPlayers: RequestHandler = async (req, res, next) => {
  try {
    const players = await Player.find({});

    return res.status(StatusCodes.OK).json(players);
  } catch (error) {
    next(error);
  }
};
