import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

beforeEach(async () => {
	await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
	await mongoose.connection.close();
});

describe.skip('User route and controller', () => {
	let USER_TOKEN;

	it('should register a user', async () => {
		const res = await request(app).post('/api/v1/auth/register').send({
			email: 'testing@gmail.com',
			password: 'Testing1!',
			confirmPassword: 'Testing1!',
			role: 'COACH',
		});

		expect(res.statusCode).toBe(201);
		expect(res.body.token).toBeDefined();
	});

	it('should login in user', async () => {
		const res = await request(app).post('/api/v1/auth/login').send({
			email: 'testing@gmail.com',
			password: 'Testing1!',
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.token).toBeDefined();

		USER_TOKEN = res.body.token;
	});

	it('should update user', async () => {
		const { userId } = jwt.decode(USER_TOKEN);

		const res = await request(app)
			.patch(`/api/v1/auth/users/${userId}`)
			.send({
				email: 'testing!@gmail.com',
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.email).toBe('testing!@gmail.com');
	});

	it('should get one user by id', async () => {
		const { userId } = jwt.decode(USER_TOKEN);

		const res = await request(app).get(`/api/v1/auth/users/${userId}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeDefined();
		expect(res.body._id).toBe(userId);
	});

	it('should get all users', async () => {
		const res = await request(app).get('/api/v1/auth/users');

		expect(res.statusCode).toBe(200);
		expect(res.body.count).toBeGreaterThan(0);
	});

	it('should delete user', async () => {
		const { userId } = jwt.decode(USER_TOKEN);

		const res = await request(app).delete(`/api/v1/auth/users/${userId}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeDefined();
		expect(res.body.msg).toBe('Deleted!');
	});
});
