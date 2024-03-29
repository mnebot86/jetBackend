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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotifications = void 0;
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo({ accessToken: process.env.JET_ACCESS_TOKEN });
const sendNotifications = (tokens, title, body, screen) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title,
        body,
        data: { screen },
    }));
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
        try {
            yield expo.sendPushNotificationsAsync(chunk);
        }
        catch (error) {
            console.error(error);
        }
    }
});
exports.sendNotifications = sendNotifications;
