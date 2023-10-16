"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmailValid = exports.passwordValidation = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const passwordValidation = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*]/.test(password);
    const isLengthValid = password.length >= 8;
    if (!hasUppercase) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Must contain at least one uppercase letter.');
    }
    if (!hasDigit) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Must contain at least one digit.');
    }
    if (!hasSymbol) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Must contain at least one symbol (!@#$%^&*).');
    }
    if (!isLengthValid) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Must be at least 8 characters long.');
    }
};
exports.passwordValidation = passwordValidation;
const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = emailRegex.test(email);
    if (!isValid) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Provide a valid email.');
    }
};
exports.isEmailValid = isEmailValid;
