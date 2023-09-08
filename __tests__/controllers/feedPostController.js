import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let USER_TOKEN;

beforeEach(async () => {
	await mongoose.connect(process.env.MONGO_URI);

	const res = await request(app).post('/api/v1/auth/login').send({
		email: 'testaccount@gmail.com',
		password: 'Testing1!',
	});

	console.log('RES', res.body);
	USER_TOKEN = res.body.token;
});

afterEach(async () => {
	await mongoose.connection.close();
});

describe.skip('Feed Post route and controller', () => {
	let POST_ID;

	it('should create feed post', async () => {
		const res = await request(app).post('/api/v1/feedPosts')
			.set('Authorization', `Bearer ${USER_TOKEN}`)
			.send({
				message: 'Controller Test',
				group: 'ADMIN',
			});

		expect(res.statusCode).toBe(201);
		expect(res.body.message).toBe('Feed Post created successfully!');
		expect(res.body.data.feedPost).toBeDefined();
		expect(res.body.data.feedPost.message).toBe('Controller Test');

		POST_ID = res.body.data.feedPost._id;
	});

	it('should get all feed posts', async () => {
		const res = await request(app).get('/api/v1/feedPosts')
			.set('Authorization', `Bearer ${USER_TOKEN}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Successful');
		expect(res.body.data).toBeDefined();
		expect(res.body.data.currentPage).toBeDefined();
		expect(res.body.data.totalPages).toBeDefined();
	});

	it('should get feed post by id', async () => {
		const res = await request(app)
			.get(`/api/v1/feedPosts/${POST_ID}`)
			.set('Authorization', `Bearer ${USER_TOKEN}`);
			
		expect(res.statusCode).toBe(200);
		expect(res.body.data).toBeDefined();
		expect(res.body.message).toBe('Successful');
		expect(res.body.data.feedPost).toBeDefined();
	});

	it('should updated feed post', async () => {
		const res = await request(app).patch(`/api/v1/feedPosts/${POST_ID}`).set('Authorization', `Bearer ${USER_TOKEN}`).send({
			message: 'Update Post Controller',
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Post Updated Successfully');
		expect(res.body.data).toBeDefined();
		expect(res.body.data.feedPost._id).toBe(POST_ID);
		expect(res.body.data.feedPost.message).toBe('Update Post Controller');
	});

	it('should delete feed post', async () => {
		const res = await request(app).delete(`/api/v1/feedPosts/${POST_ID}`).set('Authorization', `Bearer ${USER_TOKEN}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Feed Post deleted successfully!');
		expect(res.body.data.deletedFeedPost).toBeDefined();
	});
});
