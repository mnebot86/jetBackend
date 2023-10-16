"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const formationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
    },
    image: {
        url: String,
        cloudinaryId: String,
    },
    plays: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Play',
        }],
    playbook: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Playbook',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Formation', formationSchema);
