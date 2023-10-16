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
exports.deleteFormation = exports.updateFormation = exports.getFormation = exports.getAllFormations = exports.createFormation = void 0;
const formation_1 = __importDefault(require("../models/formation"));
const playbook_1 = __importDefault(require("../models/playbook"));
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = require("cloudinary");
const cloudinary_2 = require("../utils/cloudinary");
(0, cloudinary_2.initializeCloudinary)();
const createFormation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { playbookId } } = req;
    try {
        const { name } = req.body;
        const alreadyExist = yield formation_1.default.findOne({ name });
        if (alreadyExist) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                error: `${name} already exist`,
                field: 'name',
            });
        }
        const formation = yield formation_1.default.create(Object.assign(Object.assign({}, req.body), { playbook: playbookId }));
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                public_id: `formation/${formation._id}`,
            });
            formation.image = {
                url: result.secure_url,
                cloudinaryId: formation._id.toString(),
            };
            yield formation.save();
        }
        yield playbook_1.default.findByIdAndUpdate(playbookId, { $push: { formations: formation._id } }, { new: true });
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: 'Formation created successfully',
            data: {
                formation,
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
exports.createFormation = createFormation;
const getAllFormations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { playbookId } } = req;
    try {
        const formations = yield formation_1.default.find({ playbook: playbookId });
        if (!formations) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                error: 'No Formationfound',
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Formations Found',
            data: { formations },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An unexpected error occurred',
        });
    }
});
exports.getAllFormations = getAllFormations;
const getFormation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id } } = req;
    try {
        const formation = yield formation_1.default.findById(id);
        if (!formation) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: 'Formation Not Found',
                data: {},
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Success',
            data: {
                formation,
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
exports.getFormation = getFormation;
const updateFormation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id } } = req;
    try {
        const formation = yield formation_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!formation) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: 'Formation Not Found',
                data: {},
            });
        }
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                public_id: `formation/${formation._id}`,
                width: 500,
                height: 500,
                crop: 'fill',
            });
            formation.image = {
                url: result.secure_url,
                cloudinaryId: formation._id.toString(),
            };
            yield formation.save();
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Successfully Updated',
            data: { formation },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An unexpected error occurred',
        });
    }
});
exports.updateFormation = updateFormation;
const deleteFormation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { playbookId, id } } = req;
    try {
        const formation = yield formation_1.default.findByIdAndDelete(id);
        if (!formation) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: 'Formation Not Found',
                data: {},
            });
        }
        yield playbook_1.default.findByIdAndUpdate(playbookId, { $pull: { formations: id } }, { new: true });
        const public_id = `formation/${id}`;
        yield cloudinary_1.v2.uploader.destroy(public_id, (error, result) => {
            if (error) {
                console.error('Error deleting image:', error);
            }
            else {
                console.log('Image deleted:', result);
            }
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Successfully Delete',
            data: { formation },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'An unexpected error occurred',
        });
    }
});
exports.deleteFormation = deleteFormation;
