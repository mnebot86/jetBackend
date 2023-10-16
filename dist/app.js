"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const connect_mongo_1 = __importDefault(require("connect-mongo"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const http_errors_1 = __importStar(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
// routers
const avatarRouter_1 = __importDefault(require("./routes/avatarRouter"));
const feedPostRouter_1 = __importDefault(require("./routes/feedPostRouter"));
const formationRouter_1 = __importDefault(require("./routes/formationRouter"));
const gameRouter_1 = __importDefault(require("./routes/gameRouter"));
const groupRouter_1 = __importDefault(require("./routes/groupRouter"));
const playBookRouter_1 = __importDefault(require("./routes/playBookRouter"));
const playRouter_1 = __importDefault(require("./routes/playRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
// Constants
const app = (0, express_1.default)();
exports.server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(exports.server);
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)('dev'));
}
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: validateEnv_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGO_URI,
    }),
}));
// Routes
app.get('/api/v1', (req, res) => {
    res.json({ msg: 'Hello World!' });
});
app.use('/api/v1/auth', userRouter_1.default);
app.use('/api/v1/groups', groupRouter_1.default);
app.use('/api/v1/games', gameRouter_1.default);
app.use('/api/v1/avatar', avatarRouter_1.default);
app.use('/api/v1/feedPosts', feedPostRouter_1.default);
app.use('/api/v1/playbooks', playBookRouter_1.default);
app.use('/api/v1/playbooks/:playbookId/formations', formationRouter_1.default);
app.use('/api/v1/playbooks/:playbookId/formations/:formationId/plays', playRouter_1.default);
app.use((req, res, next) => {
    next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, 'Endpoint not found'));
});
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    console.error(error);
    let errorMessage = 'An unknown error occurred';
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.io.on('connection', socket => {
    console.log('A User connected');
    socket.on('new_feed', feedPost => {
        console.log('New feed post received:', feedPost);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
exports.default = app;
