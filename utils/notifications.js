import { Expo } from 'expo-server-sdk';

const expo = new Expo({ accessToken: process.env.JET_ACCESS_TOKEN });

const sendNotifications = async (tokens, title, body, badge) => {
	const messages = tokens.map((token) => ({
		to: token,
		sound: 'default',
		title,
		body,
		data: { badge },
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