"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const avatarSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: [true, 'Provide a url for image'],
    },
    cloudinaryId: String,
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Avatar', avatarSchema);
