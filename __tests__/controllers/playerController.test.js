import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeEach(async () => {
	await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
	await mongoose.connection.close();
});

describe('Player route and controller', () => {
	it('should get player by id', async () => {
		const token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRkYTc1N2E1MWNlNTRiMDMwZDM5ZTciLCJpYXQiOjE2ODQyODU5NjYsImV4cCI6MTY4Njg3Nzk2Nn0.6wyt9lTdeo6odV-KJrRjq0W2c7c7KPinB3mvaUxZfmY';

		const res = await request(app)
			.get('/api/v1/players/6459b84cf30ae6a526f6b179')
			.set('Authorization', `Bearer ${token}`);

		console.log(res.body);

		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Player Found');
		expect(res.body.data).toBeDefined();
		expect(res.body.data.player).toBeDefined();
	});
});
