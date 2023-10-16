"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGame = exports.updateGame = exports.getGame = exports.getGames = exports.createGame = void 0;
const game_1 = __importDefault(require("../models/game"));
const group_1 = __importDefault(require("../models/group"));
const http_status_codes_1 = require("http-status-codes");
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { opposingTeam, dateTime, name, streetNumber, streetName, city, state, zip, group, } = req.body;
    if (!opposingTeam ||
        !dateTime ||
        !name ||
        !streetNumber ||
        !streetName ||
        !city ||
        !state ||
        !zip ||
        !group) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: 'Please provide all fields' });
    }
    const gameAlreadyExist = yield game_1.default.findOne({
        group,
        opposingTeam,
        dateTime,
    });
    if (gameAlreadyExist) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: 'This game already exist!' });
    }
    const game = yield game_1.default.create({
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
    const updatedGroup = yield group_1.default.findById(group);
    updatedGroup === null || updatedGroup === void 0 ? void 0 : updatedGroup.games.push(game._id);
    if (updatedGroup) {
        yield updatedGroup.save();
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(Object.assign({}, game));
    }
});
exports.createGame = createGame;
const getGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield game_1.default.find({}).populate('group', 'name');
    if (!games) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ msg: 'No games found' });
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, games));
});
exports.getGames = getGames;
const getGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: 'Id is required' });
    }
    const game = yield game_1.default.findOne({ _id: id }).populate([{ path: 'group' }]);
    if (!game) {
        return res
            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
            .json({ error: 'No game found' });
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, game));
});
exports.getGame = getGame;
const updateGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: 'Please provide group id' });
    }
    const game = yield game_1.default.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, game));
});
exports.updateGame = updateGame;
const deleteGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: 'Id is required' });
    }
    const game = yield game_1.default.findByIdAndDelete(id);
    if (game) {
        yield group_1.default.findByIdAndUpdate(game.group, {
            $pull: { games: id },
        }, { new: true });
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Deleted' });
    }
});
exports.deleteGame = deleteGame;
