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
exports.deletePlaybook = exports.updatePlaybook = exports.getPlaybook = exports.getPlaybooks = exports.createPlaybook = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_1 = require("../app");
const playbook_1 = __importDefault(require("../models/playbook"));
const user_1 = __importDefault(require("../models/user"));
const notifications_1 = require("../utils/notifications");
const createPlaybook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.session;
    const alreadyExist = yield playbook_1.default.findOne({ name: req.body.name });
    if (alreadyExist) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            error: 'Playbook already exist',
            data: {},
        });
    }
    const playbook = yield playbook_1.default.create(Object.assign(Object.assign({}, req.body), { createdBy: userId }));
    const usersWithTokens = yield user_1.default.find({
        $and: [
            { _id: { $ne: userId } },
            { expoPushTokens: { $exists: true, $not: { $size: 0 } } },
        ],
    });
    const tokens = usersWithTokens.reduce((allTokens, user) => [...allTokens, ...user.expoPushTokens], []);
    const title = 'New Playbook Posted';
    const body = playbook.name;
    app_1.io.emit('new_playbook', playbook);
    yield (0, notifications_1.sendNotifications)(tokens, title, body, 'PlaybookScreen');
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({
        message: 'Playbook created successfully!',
        data: {
            playbook,
        },
    });
});
exports.createPlaybook = createPlaybook;
const getPlaybooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playbooks = yield playbook_1.default.find({});
        if (!playbooks || playbooks.length === 0) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: 'No Playbooks Saved',
                data: {
                    playbooks: [],
                },
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Successfully',
            data: {
                playbooks,
            },
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Error fetching feed posts',
                error: error.message,
            });
        }
    }
});
exports.getPlaybooks = getPlaybooks;
const getPlaybook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id }, } = req;
    const playbook = yield playbook_1.default.findById(id).populate('formations');
    if (!playbook) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            error: 'Post not found',
            data: {},
        });
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Playbook found!',
        data: playbook,
    });
});
exports.getPlaybook = getPlaybook;
const updatePlaybook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, params: { id }, } = req;
    const playbook = yield playbook_1.default.findByIdAndUpdate(id, body, {
        new: true,
    });
    if (!playbook) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            error: 'Playbook not found',
            data: {},
        });
    }
    app_1.io.emit('update_playbook', playbook);
    const { createdBy } = playbook;
    const user = yield user_1.default.findById(createdBy);
    if (!user) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            error: 'User not found',
            data: {},
        });
    }
    const otherUsers = yield user_1.default.find({
        _id: { $ne: createdBy },
        expoPushTokens: { $exists: true, $not: { $size: 0 } },
    });
    const allTokens = otherUsers.reduce((tokensArray, otherUser) => [
        ...tokensArray,
        ...otherUser.expoPushTokens,
    ], []);
    const allUsersTitle = 'Playbook Updated';
    const allUsersBody = `A playbook has been updated: ${playbook.name}`;
    yield (0, notifications_1.sendNotifications)(allTokens, allUsersTitle, allUsersBody, 'PlaybookScreen');
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Playbook Update Successful',
        data: { playbook },
    });
});
exports.updatePlaybook = updatePlaybook;
const deletePlaybook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id }, } = req;
    const playbook = yield playbook_1.default.findOneAndDelete({
        _id: id,
    });
    if (!playbook) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            message: 'Playbook not found or not authorized for deletion',
            data: {},
        });
    }
    app_1.io.emit('delete_playbook', id);
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Playbook delete successfully!',
        data: { playbook },
    });
});
exports.deletePlaybook = deletePlaybook;
