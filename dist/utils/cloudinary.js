"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCloudinary = void 0;
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const cloudinary_1 = require("cloudinary");
const initializeCloudinary = () => {
    cloudinary_1.v2.config({
        cloud_name: validateEnv_1.default.CLOUD_NAME,
        api_key: validateEnv_1.default.CLOUD_API_KEY,
        api_secret: validateEnv_1.default.CLOUD_API_SECRET,
    });
};
exports.initializeCloudinary = initializeCloudinary;
