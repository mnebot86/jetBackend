import { cleanEnv, str } from 'envalid';

export default cleanEnv(process.env, {
	MONGO_URI: str(),
	SESSION_SECRET: str(),
	CLOUD_NAME: str(),
	CLOUD_API_KEY: str(),
	CLOUD_API_SECRET: str(),
});
