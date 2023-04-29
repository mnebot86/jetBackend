import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

// db and authenticateUser
import { mongoConnect } from './db/connection.js';

// routers
import userRouter from './routes/userRouter.js';
import playerRouter from './routes/playerRouter.js';
import groupRouter from './routes/groupRouter.js';
import requestRouter from './routes/requestRouter.js';
import gameRouter from './routes/gameRouter.js';
import avatarRouter from './routes/avatarRouter.js';

// Middleware
import {
	notFoundMiddleware,
	errorHandlerMiddleware,
} from './middleware/index.js';

dotenv.config();

// Constants
const app = express();
export const server = http.createServer(app);
const io = new Server(server);

const mongoUri = process.env.MONGO_URI;

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/v1', (req, res) => {
	res.json({ msg: 'Hello World!' });
});

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/players', playerRouter);
app.use('/api/v1/requests', requestRouter);
app.use('/api/v1/games', gameRouter);
app.use('/api/v1/avatar', avatarRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

mongoConnect(mongoUri);

io.on('connection', (socket) => {
	console.log('A User connected');

	socket.on('disconnect', () => {
		console.log('A user disconnected');
	});
});

export default app;
