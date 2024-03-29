"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const groupSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Provide a name for role'],
        enum: [
            'Varsity',
            'Varsity Cheer',
            'Junior Varsity',
            'Junior Varsity Cheer',
            'Peewee',
            'Peewee Cheer',
            'Junior Peewee',
            'Junior Peewee Cheer',
            'Flag',
            'Flag Cheer',
        ],
    },
    ages: {
        min: {
            type: Number,
            required: [true, 'Provide a min age for this group'],
        },
        max: {
            type: Number,
            required: [true, 'Provide a max age for this group'],
        },
    },
    roster: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    coaches: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    teamMoms: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    games: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Game',
        },
    ],
    record: {
        wins: {
            type: Number,
            default: 0,
        },
        draws: {
            type: Number,
            default: 0,
        },
        loses: {
            type: Number,
            default: 0,
        },
    },
    gameFilms: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'GameFilm',
        },
    ],
    tutorials: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tutorial',
        },
    ],
    announcementChat: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AnnouncementChat',
    },
    huddleChat: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'HuddleChat',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Group', groupSchema);
