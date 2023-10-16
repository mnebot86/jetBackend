"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    fileName: {
        type: String,
        required: [true, 'Provide a filename'],
    },
    description: {
        type: String,
    },
    url: {
        type: String,
        required: [true, 'Provide a url'],
    },
    thumbnailUrl: {
        type: String,
    },
    duration: {
        type: Number,
    },
    size: {
        type: Number,
    },
    mimeType: {
        type: String,
    },
    uploadedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        enum: ['GameFile', 'Tutorial'],
    },
    group: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Group',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Video', videoSchema);
