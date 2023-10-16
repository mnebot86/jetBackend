import { connect } from 'mongoose';
import { server } from './app';
import env from './utils/validateEnv';


const port = process.env.PORT || 5001;

connect(env.MONGO_URI)
	.then(() => {
		server.listen(port, (): void => {
			console.log(`Server listening on port ${port}`);
		});
	})
	.catch(console.error);

export default server;
