import { Expo } from 'expo-server-sdk';

const expo = new Expo({ accessToken: process.env.JET_ACCESS_TOKEN });

const sendNotifications = async (tokens:string[], title: string, body: string, screen?: string): Promise<void> => {
	const messages = tokens.map(token => ({
		to: token,
		sound: 'default' as 'default',
		title,
		body,
		data: { screen },
	}));

	const chunks = expo.chunkPushNotifications(messages);

	for (const chunk of chunks) {
		try {
			await expo.sendPushNotificationsAsync(chunk);
		} catch (error) {
			console.error(error);
		}
	}
};

export { sendNotifications };
