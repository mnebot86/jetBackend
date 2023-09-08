import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { Server } from 'socket.io';
import http from 'http';
import 'express-async-errors';

// db and authenticateUser
import { mongoConnect } from './db/connection.js';

// routers
import userRouter from './routes/userRouter.js';
import playerRouter from './routes/playerRouter.js';
import groupRouter from './routes/groupRouter.js';
import gameRouter from './routes/gameRouter.js';
import avatarRouter from './routes/avatarRouter.js';
import feedPostRouter from './routes/feedPostRouter.js';
import playbookRouter from './routes/playBookRouter.js';
import formationRouter from './routes/formationRouter.js';
import playRouter from './routes/playRouter.js';

// Middleware
import {
	notFoundMiddleware,
	errorHandlerMiddleware,
} from './middleware/index.js';

dotenv.config();

// Constants
const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

const mongoUri = process.env.MONGO_URI;

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

app.use(express.json());

// Routes
app.get('/api/v1', (req, res) => {
	res.json({ msg: 'Hello World!' });
});

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/players', playerRouter);
app.use('/api/v1/games', gameRouter);
app.use('/api/v1/avatar', avatarRouter);
app.use('/api/v1/feedPosts', feedPostRouter);
app.use('/api/v1/playbooks', playbookRouter);
app.use('/api/v1/playbooks/:playbookId/formations', formationRouter);
app.use('/api/v1/playbooks/:playbookId/formations/:formationId/plays', playRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

mongoConnect(mongoUri);

io.on('connection', socket => {
	console.log('A User connected');

	socket.on('new_feed', feedPost => {
		console.log('New feed post received:', feedPost);
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected');
	});
});

export default app;
