import MongoStore from 'connect-mongo';
import 'dotenv/config';
import express, { Application, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import createHttpError, { isHttpError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import { Server } from 'socket.io';
import env from './utils/validateEnv';

// routers
import avatarRouter from './routes/avatarRouter';
import feedPostRouter from './routes/feedPostRouter';
import formationRouter from './routes/formationRouter';
// import gameRouter from './routes/gameRouter';
import groupRouter from './routes/groupRouter';
import playbookRouter from './routes/playBookRouter';
import playRouter from './routes/playRouter';
import playerRouter from './routes/playerRouter';
import userRouter from './routes/userRouter';
import videoRouter from './routes/videoRouter';
import gameFilmRouter from './routes/gameFilmRouter';
import messageRouter from './routes/messagesRouter';

// Constants
const app: Application = express();
export const server = http.createServer(app);
export const io = new Server(server);

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

app.use(express.json());

app.use(session({
	secret: env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 60 * 60 * 1000,
	},
	rolling: true, 
	store: MongoStore.create({
		mongoUrl: process.env.MONGO_URI,
	}),
}));

// Routes
app.get('/api/v1', (req, res) => {
	res.json({ msg: 'Hello World!' });
});

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/groups', groupRouter);
// app.use('/api/v1/games', gameRouter);
app.use('/api/v1/avatar', avatarRouter);
app.use('/api/v1/feedPosts', feedPostRouter);
app.use('/api/v1/playbooks', playbookRouter);
app.use('/api/v1/players', playerRouter);
app.use('/api/v1/playbooks/:playbookId/formations', formationRouter);
app.use('/api/v1/playbooks/:playbookId/formations/:formationId/plays', playRouter);
app.use('/api/v1/game-films', gameFilmRouter);
app.use('/api/v1/game-films/:gameFilmId/videos', videoRouter);
app.use('/api/v1/messages', messageRouter);

app.use((req, res, next) => {
	next(createHttpError(StatusCodes.NOT_FOUND, 'Endpoint not found'));
});

// eslint-disable-next-line no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
	let errorMessage = 'An unknown error occurred';
	let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

	if (isHttpError(error)) {
		statusCode = error.status;
		errorMessage = error.message;
	}

	res.status(statusCode).json({ error: errorMessage });
});

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
