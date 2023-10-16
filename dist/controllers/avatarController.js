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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAvatar = void 0;
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = require("cloudinary");
const cloudinary_2 = require("../utils/cloudinary");
(0, cloudinary_2.initializeCloudinary)();
const createAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.session;
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                public_id: `user_profile/${userId}`,
                width: 500,
                height: 500,
                crop: 'fill',
            });
            res.status(http_status_codes_1.StatusCodes.OK).json({
                url: result.secure_url,
                cloudinaryId: userId,
            });
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.createAvatar = createAvatar;
