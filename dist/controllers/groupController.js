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
exports.deleteGroup = exports.updateGroup = exports.getGroup = exports.getGroups = exports.createGroup = void 0;
const http_status_codes_1 = require("http-status-codes");
const group_1 = __importDefault(require("../models/group"));
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, maxAge, minAge } = req.body;
    const groupAlreadyExist = yield group_1.default.findOne({ name });
    if (groupAlreadyExist) {
        res.json({ error: `A group with the name ${name} already exist!` });
        // throw new BadRequestError({
        // 	error: `A group with the name ${name} already exist!`,
        // });
    }
    const group = yield group_1.default.create({
        name,
        ages: {
            min: minAge,
            max: maxAge,
        },
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        message: 'Group Created',
        data: Object.assign({}, group),
    });
});
exports.createGroup = createGroup;
const getGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield group_1.default.find({});
    if (!groups) {
        return res.json({ msg: 'No groups found' });
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Found groups',
        data: Object.assign({}, groups),
    });
});
exports.getGroups = getGroups;
const getGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const group = yield group_1.default.findOne({ _id: id }).populate([
        { path: 'coaches' },
        { path: 'roster' },
    ]);
    if (!group) {
        return res
            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
            .json({ error: 'No group found' });
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Group Found',
        data: Object.assign({}, group),
    });
});
exports.getGroup = getGroup;
const updateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.json({ error: 'Please provide group id' });
    }
    const group = yield group_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Group Updated',
        data: Object.assign({}, group),
    });
});
exports.updateGroup = updateGroup;
const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield group_1.default.findByIdAndDelete(id);
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        data: {
            message: 'Delete Successful',
        },
    });
});
exports.deleteGroup = deleteGroup;
