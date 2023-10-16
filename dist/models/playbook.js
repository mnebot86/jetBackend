"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const playbookSchema = new mongoose_1.Schema({
    name: {
        type: String,
        enum: ['Offense', 'Defense', 'Special Teams'],
        required: [true, 'Please provide name'],
    },
    formations: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Formation',
        },
    ],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Playbook', playbookSchema);
