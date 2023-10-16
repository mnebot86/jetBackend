import { RequestHandler } from 'express';
import Game from '../models/game';
import Group from '../models/group';
import { StatusCodes } from 'http-status-codes';

export const createGame: RequestHandler = async (req, res) => {
	const {
		opposingTeam,
		dateTime,
		name,
		streetNumber,
		streetName,
		city,
		state,
		zip,
		group,
	} = req.body;

	if (
		!opposingTeam ||
		!dateTime ||
		!name ||
		!streetNumber ||
		!streetName ||
		!city ||
		!state ||
		!zip ||
		!group
	) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Please provide all fields' });
	}

	const gameAlreadyExist = await Game.findOne({
		group,
		opposingTeam,
		dateTime,
	});

	if (gameAlreadyExist) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'This game already exist!' });
	}

	const game = await Game.create({
		opposingTeam,
		dateTime,
		location: {
			name,
			streetNumber,
			streetName,
			city,
			state,
			zip,
		},
		group,
	});

	const updatedGroup = await Group.findById(group);

	updatedGroup?.games.push(game._id);

	if (updatedGroup) {
		await updatedGroup.save();
	
		return res.status(StatusCodes.CREATED).json({ ...game });
	}
};

export const getGames: RequestHandler = async (req, res) => {
	const games = await Game.find({}).populate('group', 'name');

	if (!games) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'No games found' });
	}

	return res.status(StatusCodes.OK).json({ ...games });
};

export const getGame: RequestHandler = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Id is required' });
	}

	const game = await Game.findOne({ _id: id }).populate([{ path: 'group' }]);

	if (!game) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'No game found' });
	}

	return res.status(StatusCodes.OK).json({ ...game });
};

export const updateGame: RequestHandler = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Please provide group id' });
	}

	const game = await Game.findByIdAndUpdate(id, req.body, { new: true });

	return res.status(StatusCodes.OK).json({ ...game });
};

export const deleteGame: RequestHandler = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: 'Id is required' });
	}

	const game = await Game.findByIdAndDelete(id);

	if (game) {
		await Group.findByIdAndUpdate(
			game.group,
			{
				$pull: { games: id },
			},
			{ new: true }
		);

		return res.status(StatusCodes.OK).json({ msg: 'Deleted' });
	}
};
