"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const playSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        cloudinaryId: String,
    },
    formation: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Formation',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Play', playSchema);
