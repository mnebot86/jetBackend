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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const validateEnv_1 = __importDefault(require("../../utils/validateEnv"));
let USER_ID;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(validateEnv_1.default.MONGO_URI);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('User route and controller', () => {
    it('POST /register: should sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/v1/auth/register').send({
            email: 'testing@gmail.com',
            password: 'Testing1!',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toBeDefined();
        expect(res.body.email).toBeDefined();
        expect(res.body.password).toBeNull();
        expect(res.body.roles).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.expoPushTokens).toBeDefined();
        expect(res.body.createdAt).toBeDefined();
        expect(res.body.updatedAt).toBeDefined();
    }));
    it('POST /login: should login account', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/v1/auth/login').send({
            email: 'testing@gmail.com',
            password: 'Testing1!',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.email).toBeDefined();
        expect(res.body.password).toBeNull();
        expect(res.body.roles).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.expoPushTokens).toBeDefined();
        expect(res.body.createdAt).toBeDefined();
        expect(res.body.updatedAt).toBeDefined();
        expect(res.header['set-cookie'][0]).toContain('connect.sid');
        USER_ID = res.body._id;
    }));
    it('PATCH /auth/users: should update properties', () => __awaiter(void 0, void 0, void 0, function* () {
        const agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/v1/auth/login').send({
            email: 'testing@gmail.com',
            password: 'Testing1!',
        });
        const res = yield agent.patch(`/api/v1/auth/users/${USER_ID}`).send({
            roles: ["ADMIN"]
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.email).toBeDefined();
        expect(res.body.password).toBeUndefined();
        expect(res.body.roles).toContain('ADMIN');
        expect(res.body._id).toBeDefined();
        expect(res.body.expoPushTokens).toBeDefined();
        expect(res.body.createdAt).toBeDefined();
        expect(res.body.updatedAt).toBeDefined();
    }));
    it('GET /user/:userId: should get one user', () => __awaiter(void 0, void 0, void 0, function* () {
        const agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/v1/auth/login').send({
            email: 'testing@gmail.com',
            password: 'Testing1!',
        });
        const res = yield agent.get(`/api/v1/auth/users/${USER_ID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.email).toBeDefined();
        expect(res.body.password).toBeUndefined();
        expect(res.body.roles).toBeDefined();
        expect(res.body._id).toBe(USER_ID);
        expect(res.body.expoPushTokens).toBeDefined();
        expect(res.body.createdAt).toBeDefined();
        expect(res.body.updatedAt).toBeDefined();
    }));
    it('GET /auth/users: should get all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/v1/auth/login').send({
            email: 'testing@gmail.com',
            password: 'Testing1!',
        });
        const res = yield agent.get('/api/v1/auth/users');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    }));
    it('Post /logout: should logout user', () => __awaiter(void 0, void 0, void 0, function* () {
        const agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/v1/auth/login').send({
            email: 'testing@gmail.com',
            password: 'Testing1!',
        });
        const res = yield (0, supertest_1.default)(app_1.default).post(`/api/v1/auth/logout`);
        expect(res.statusCode).toBe(200);
    }));
    it('DELETE /auth/users/:userId: should delete user', () => __awaiter(void 0, void 0, void 0, function* () {
        const agent = supertest_1.default.agent(app_1.default);
        yield agent.post('/api/v1/auth/login').send({
            email: 'testing@gmail.com',
            password: 'Testing1!',
        });
        const res = yield agent.delete(`/api/v1/auth/users/${USER_ID}`);
        expect(res.statusCode).toBe(200);
    }));
});
