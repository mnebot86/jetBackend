import { server } from './app.js';

const port = process.env.PORT || 5001;

server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

export default server;
