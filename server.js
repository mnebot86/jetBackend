import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { server } from './app.js';

dotenv.config();

const port = process.env.PORT || 5001;

connect(process.env.MONGO_URI)
	.then(() => {
		server.listen(port, () => {
			console.log(`Server listening on port ${port}`);
		});
	})
	.catch(console.error);

export default server;
