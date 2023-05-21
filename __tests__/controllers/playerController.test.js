import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { mongoConnect } from '../../db/connection.js';

dotenv.config();

beforeAll(async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
	} catch (err) {
		console.log(err);
	}
});

afterAll(async () => {
	try {
		await mongoose.connection.close();
	} catch (err) {
		console.log(err);
	}
});

describe('Player route and controller', () => {
	it('should get player by id', async () => {
		const token = process.env.TEST_TOKEN;

		const res = await request(app)
			.get('/api/v1/players/6459b84cf30ae6a526f6b179')
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Player Found');
		expect(res.body.data).toBeDefined();
		expect(res.body.data.player).toBeDefined();
	});
});
