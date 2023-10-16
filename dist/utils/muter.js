"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const setupMulter = () => {
    const storage = multer_1.default.diskStorage({});
    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    };
    return (0, multer_1.default)({ storage, fileFilter });
};
exports.setupMulter = setupMulter;
