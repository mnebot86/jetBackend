"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        trim: true,
    },
    lastName: {
        type: String,
        maxlength: 20,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    phoneNumber: {
        type: String,
        minlength: 10,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    avatar: {
        url: {
            type: String,
            require: [true, 'Please Provide an url'],
        },
        cloudinaryId: {
            type: String,
            require: [true, 'CloudinaryId required'],
        },
    },
    roles: {
        type: [String],
        enum: ['COACH', 'TEAM_MOM', 'GUARDIAN', 'PLAYER'],
        default: ['COACH'],
    },
    position: {
        type: String,
        enum: [
            'N/A',
            'Head',
            'Assistant',
            'Defensive Coordinator',
            'Offensive Coordinator',
        ],
        default: 'N/A',
    },
    group: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Group',
    },
    backgroundCheck: {
        type: String,
        enum: ['Not Complete', 'Pending', 'Completed'],
        default: 'Not Complete',
    },
    players: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Player',
        },
    ],
    expoPushTokens: [
        {
            type: String,
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', userSchema);
