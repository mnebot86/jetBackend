"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gameSchema = new mongoose_1.Schema({
    opposingTeam: {
        type: String,
        required: [true, 'Provide opposing team name'],
    },
    dateTime: {
        type: Date,
        required: [true, 'Provide a date and time'],
    },
    location: {
        name: {
            type: String,
            required: [true, 'Provide location name'],
        },
        streetNumber: {
            type: String,
            required: [true, 'Provide street number'],
        },
        streetName: {
            type: String,
            required: [true, 'Provide street name'],
        },
        city: {
            type: String,
            required: [true, 'Provide city/town name'],
        },
        state: {
            type: String,
            maxlength: 2,
            required: [true, 'Provide state'],
        },
        zip: {
            type: String,
            required: [true, 'Provide a zip code'],
        },
    },
    playerArrivalTime: {
        type: Date,
    },
    finalScore: {
        home: {
            type: Number,
            default: 0,
        },
        away: {
            type: Number,
            default: 0,
        },
    },
    group: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Group',
        required: [true, 'Provide team id'],
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Game', gameSchema);
