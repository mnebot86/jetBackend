"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const feedPostSchema = new mongoose_1.Schema({
    message: {
        type: String,
        require: [true, 'Please provide a message'],
    },
    group: {
        type: String,
        enum: [
            'ADMIN',
            'VARSITY',
            'JUNIOR_VARSITY',
            'PEEWEE',
            'JUNIOR_PEEWEE',
            'FLAG',
            'VARSITY_CHEER',
            'JV_CHEER',
            'PEEWEE_CHEER',
            'JUNIOR_PEEWEE_CHEER',
            'FLAG_CHEER',
        ],
        require: [true, 'Please provide a group name'],
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('FeedPost', feedPostSchema);
