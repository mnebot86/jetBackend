"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const playerSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        trim: true,
        required: [true, 'Please provide first name'],
    },
    lastName: {
        type: String,
        maxlength: 20,
        required: [true, 'Please provide last name'],
    },
    phoneNumber: {
        type: String,
        minlength: 10,
        required: [true, 'Please provide phone number'],
    },
    avatar: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Avatar',
    },
    group: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Group',
        required: [true, 'Provided a group id'],
    },
    age: {
        type: Number,
        required: [true, 'Please provide age'],
    },
    weight: {
        type: Number,
    },
    isStriper: {
        type: Boolean,
        default: false,
    },
    positions: [
        {
            type: String,
            enum: [
                'N/A',
                'QB',
                'RB',
                'FB',
                'WR',
                'TE',
                'OL',
                'C',
                'G',
                'T',
                'K',
                'DL',
                'DT',
                'DE',
                'NT',
                'LB',
                'OLB',
                'MLB',
                'DB',
                'CB',
                'S',
                'P',
                'PR',
            ],
            default: 'N/A',
        },
    ],
    totalAbsent: {
        type: Number,
        default: 0,
    },
    jerseyNumber: {
        type: Number,
        default: null,
    },
    allergies: [
        {
            type: String,
        },
    ],
    medicalConditions: [
        {
            type: String,
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Player', playerSchema);
