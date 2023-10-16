import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import env from '../../utils/validateEnv';

let USER_ID: string;

beforeEach(async () => {
	await mongoose.connect(env.MONGO_URI);
});

afterEach(async () => {
	await mongoose.connection.close();
});

describe('User route and controller', () => {	
	it('POST /register: should sign up', async () => {
		const res = await request(app)
			.post('/api/v1/auth/register').send({
				email: 'testing@gmail.com',
				password: 'Testing1!',
			});

		expect(res.statusCode).toBe(201);
		expect(res.body).toBeDefined();
		expect(res.body.email).toBeDefined()
		expect(res.body.password).toBeNull();
		expect(res.body.roles).toBeDefined();
		expect(res.body._id).toBeDefined();
		expect(res.body.expoPushTokens).toBeDefined();
		expect(res.body.createdAt).toBeDefined();
		expect(res.body.updatedAt).toBeDefined();
	});

	it('POST /login: should login account', async () => {
		const res = await request(app).post('/api/v1/auth/login').send({
			email: 'testing@gmail.com',
			password: 'Testing1!',
		});

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeDefined();
		expect(res.body.email).toBeDefined()
		expect(res.body.password).toBeNull();
		expect(res.body.roles).toBeDefined();
		expect(res.body._id).toBeDefined();
		expect(res.body.expoPushTokens).toBeDefined();
		expect(res.body.createdAt).toBeDefined();
		expect(res.body.updatedAt).toBeDefined();
		expect(res.header['set-cookie'][0]).toContain('connect.sid');

		USER_ID = res.body._id;
	});

	it('PATCH /auth/users: should update properties', async () => {
		const agent = request.agent(app);

		await agent.post('/api/v1/auth/login').send({
			email: 'testing@gmail.com',
			password: 'Testing1!',
		});
		
		const res = await agent.patch(`/api/v1/auth/users/${USER_ID}`).send({
			roles: ["ADMIN"]
		});

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeDefined();
		expect(res.body.email).toBeDefined()
		expect(res.body.password).toBeUndefined();
		expect(res.body.roles).toContain('ADMIN');
		expect(res.body._id).toBeDefined();
		expect(res.body.expoPushTokens).toBeDefined();
		expect(res.body.createdAt).toBeDefined();
		expect(res.body.updatedAt).toBeDefined();
	});

	it('GET /user/:userId: should get one user', async () => {
		const agent = request.agent(app);

		await agent.post('/api/v1/auth/login').send({
			email: 'testing@gmail.com',
			password: 'Testing1!',
		});

		const res = await agent.get(`/api/v1/auth/users/${USER_ID}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeDefined();
		expect(res.body.email).toBeDefined()
		expect(res.body.password).toBeUndefined();
		expect(res.body.roles).toBeDefined();
		expect(res.body._id).toBe(USER_ID);
		expect(res.body.expoPushTokens).toBeDefined();
		expect(res.body.createdAt).toBeDefined();
		expect(res.body.updatedAt).toBeDefined();
	});

	it('GET /auth/users: should get all users', async () => {
		const agent = request.agent(app);

		await agent.post('/api/v1/auth/login').send({
		  email: 'testing@gmail.com',
		  password: 'Testing1!',
		});

		const res = await agent.get('/api/v1/auth/users');

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeDefined();
	  });

	it('Post /logout: should logout user', async () => {
		const agent = request.agent(app);

		await agent.post('/api/v1/auth/login').send({
			email: 'testing@gmail.com',
			password: 'Testing1!',
		});

		const res = await request(app).post(`/api/v1/auth/logout`);

		expect(res.statusCode).toBe(200);
	});

	it('DELETE /auth/users/:userId: should delete user', async () => {
		const agent = request.agent(app);

		await agent.post('/api/v1/auth/login').send({
		  email: 'testing@gmail.com',
		  password: 'Testing1!',
		});

		const res = await agent.delete(`/api/v1/auth/users/${USER_ID}`);

		expect(res.statusCode).toBe(200);
	  });
});
