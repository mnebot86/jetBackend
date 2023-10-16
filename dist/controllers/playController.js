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
exports.deletePlay = exports.updatePlay = exports.getPlay = exports.getAllPlays = exports.createPlay = void 0;
const cloudinary_1 = require("cloudinary");
const http_status_codes_1 = require("http-status-codes");
const formation_1 = __importDefault(require("../models/formation"));
const play_1 = __importDefault(require("../models/play"));
const cloudinary_2 = require("../utils/cloudinary");
(0, cloudinary_2.initializeCloudinary)();
const createPlay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { formationId } } = req;
    try {
        const { name } = req.body;
        const alreadyExist = yield play_1.default.findOne({ name });
        if (alreadyExist) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                error: `${name} already exists`,
                field: 'name',
            });
        }
        const play = yield play_1.default.create(Object.assign(Object.assign({}, req.body), { formation: formationId }));
        yield formation_1.default.findByIdAndUpdate(formationId, { $push: { plays: play._id } }, { new: true });
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                public_id: `play/${play._id}`,
                width: 500,
                height: 500,
                crop: 'fill',
            });
            play.image = {
                url: result.secure_url,
                cloudinaryId: play._id.toString(),
            };
            yield play.save();
        }
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: 'Play created successfully',
            data: {
                play,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An unexpected error occurred',
        });
    }
});
exports.createPlay = createPlay;
const getAllPlays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { formationId }, } = req;
    try {
        const plays = yield play_1.default.find({ formation: formationId });
        if (!plays) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                error: 'No plays found',
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Success',
            data: {
                plays,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An unexpected error occurred',
        });
    }
});
exports.getAllPlays = getAllPlays;
const getPlay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id }, } = req;
    try {
        const play = yield play_1.default.findById(id);
        if (!play) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                error: 'No play by that id',
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Success',
            data: {
                play,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An unexpected error occurred',
        });
    }
});
exports.getPlay = getPlay;
const updatePlay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id } } = req;
    try {
        const play = yield play_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!play) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                error: 'No play by that id',
            });
        }
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                public_id: `play/${play._id}`,
                width: 500,
                height: 500,
                crop: 'fill',
            });
            play.image = {
                url: result.secure_url,
                cloudinaryId: play._id.toString(),
            };
            yield play.save();
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Success',
            data: {
                play,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An unexpected error occurred',
        });
    }
});
exports.updatePlay = updatePlay;
const deletePlay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { formationId, id } } = req;
    try {
        const play = yield play_1.default.findByIdAndDelete(id, { new: true });
        if (!play) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                error: 'No play by that id',
            });
        }
        yield formation_1.default.findByIdAndUpdate(formationId, { $pull: { plays: play._id } }, { new: true });
        const public_id = `play/${id}`;
        yield cloudinary_1.v2.uploader.destroy(public_id, (error, result) => {
            if (error) {
                console.error('Error deleting image:', error);
            }
            else {
                console.log('Image deleted:', result);
            }
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Success',
            data: {
                play,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An unexpected error occurred',
        });
    }
});
exports.deletePlay = deletePlay;
