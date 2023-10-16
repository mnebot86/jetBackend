"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUsers = exports.getUser = exports.updateUser = exports.logout = exports.login = exports.register = exports.getAuthenticatedUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const user_1 = __importDefault(require("../models/user"));
const validators_1 = require("../utils/validators");
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.session.userId).exec();
        res.status(http_status_codes_1.StatusCodes.OK).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Parameters missing');
        }
        (0, validators_1.isEmailValid)(email);
        (0, validators_1.passwordValidation)(password);
        const userAlreadyExists = yield user_1.default.findOne({ email });
        if (userAlreadyExists) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.CONFLICT, 'Email already taken.');
        }
        const passwordHashed = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield user_1.default.create({
            email,
            password: passwordHashed,
        });
        req.session.userId = newUser._id;
        res.status(http_status_codes_1.StatusCodes.CREATED).json(Object.assign(Object.assign({}, newUser.toObject()), { password: null }));
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Parameters missing');
        }
        const user = yield user_1.default.findOne({ email }).select('+password').exec();
        if (!user) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid Credentials');
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid Credentials');
        }
        req.session.userId = user._id;
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign(Object.assign({}, user.toObject()), { password: null }));
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    });
};
exports.logout = logout;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please provide user id');
        }
        const user = yield user_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `No user with ID: ${id} found!`);
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json(user.toObject());
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User Id required');
        }
        const user = yield user_1.default.findOne({ _id: id }).exec();
        if (!user) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `User with Id: ${id} not found`);
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json(user.toObject());
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        if (!users) {
            res.status(http_status_codes_1.StatusCodes.OK).json({});
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please provide user id');
        }
        const user = yield user_1.default.findByIdAndDelete(id);
        if (!user) {
            throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, `User with Id: ${user} not found`);
        }
        return res.sendStatus(http_status_codes_1.StatusCodes.OK);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
