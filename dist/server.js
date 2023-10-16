"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const app_1 = require("./app");
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const port = process.env.PORT || 5001;
(0, mongoose_1.connect)(validateEnv_1.default.MONGO_URI)
    .then(() => {
    app_1.server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})
    .catch(console.error);
exports.default = app_1.server;
