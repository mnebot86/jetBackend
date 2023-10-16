"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    MONGO_URI: (0, envalid_1.str)(),
    SESSION_SECRET: (0, envalid_1.str)(),
    CLOUD_NAME: (0, envalid_1.str)(),
    CLOUD_API_KEY: (0, envalid_1.str)(),
    CLOUD_API_SECRET: (0, envalid_1.str)(),
});
