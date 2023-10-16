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
exports.deleteFeedPost = exports.updateFeedPost = exports.getFeedPost = exports.getFeedPosts = exports.createFeedPost = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_1 = require("../app");
const feedPost_1 = __importDefault(require("../models/feedPost"));
const user_1 = __importDefault(require("../models/user"));
const notifications_1 = require("../utils/notifications");
const createFeedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.session;
    const feedPost = yield feedPost_1.default.create(Object.assign(Object.assign({}, req.body), { createdBy: userId }));
    const usersWithTokens = yield user_1.default.find({
        $and: [
            { _id: { $ne: userId } },
            { expoPushTokens: { $exists: true, $not: { $size: 0 } } },
        ],
    });
    const tokens = usersWithTokens.reduce((allTokens, user) => [...allTokens, ...user.expoPushTokens], []);
    const title = 'New Feed Post';
    const body = feedPost.message || '';
    const screen = 'Feed';
    app_1.io.emit('new_feed', feedPost);
    yield (0, notifications_1.sendNotifications)(tokens, title, body, screen);
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({
        message: 'Feed Post created successfully!',
        data: {
            feedPost,
        },
    });
});
exports.createFeedPost = createFeedPost;
const getFeedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = '1', perPage = '15' } = req.query;
    const skip = (Number(page) - 1) * Number(perPage);
    const limit = Number(perPage);
    try {
        const totalPosts = yield feedPost_1.default.countDocuments();
        const feedPosts = yield feedPost_1.default.find({})
            .lean()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        if (!feedPosts || feedPosts.length === 0) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: 'No Feed Posts Found',
                data: {
                    feedPost: [],
                    currentPage: page,
                    totalPages: Math.ceil(totalPosts / Number(perPage)),
                },
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Successful',
            data: {
                feedPosts,
                currentPage: page,
                totalPages: Math.ceil(totalPosts / Number(perPage)),
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
exports.getFeedPosts = getFeedPosts;
const getFeedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id }, } = req;
    const feedPost = yield feedPost_1.default.findById(id);
    if (!feedPost) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            message: 'Post not found',
            data: {},
        });
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Successful',
        data: { feedPost },
    });
});
exports.getFeedPost = getFeedPost;
const updateFeedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, params: { id }, } = req;
    const feedPost = yield feedPost_1.default.findByIdAndUpdate(id, body, {
        new: true,
    }).lean();
    if (!feedPost) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            message: 'Feed Post not found',
            data: {},
        });
    }
    app_1.io.emit('update_feed', feedPost);
    const { createdBy } = feedPost;
    const user = yield user_1.default.findById(createdBy);
    if (!user) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            message: 'User not found',
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
    const allUsersTitle = 'Feed Post Update';
    const allUsersBody = `A feed post has been updated: ${feedPost.message}`;
    yield (0, notifications_1.sendNotifications)(allTokens, allUsersTitle, allUsersBody);
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Post Updated Successfully',
        data: { feedPost },
    });
});
exports.updateFeedPost = updateFeedPost;
const deleteFeedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.session;
    const deletedFeedPost = yield feedPost_1.default.findOneAndDelete({
        _id: id,
        createdBy: userId,
    });
    if (!deletedFeedPost) {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
            message: 'Feed Post not found or not authorized for deletion',
            data: {},
        });
    }
    app_1.io.emit('delete_feed', id);
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Feed Post deleted successfully!',
        data: { deletedFeedPost },
    });
});
exports.deleteFeedPost = deleteFeedPost;
