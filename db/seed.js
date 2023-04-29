import mongoose from 'mongoose';
import User from '../models/user.js';
import Group from '../models/group.js';
import Game from '../models/game.js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const groups = [
	{
		name: 'Varsity',
		ages: { min: 12, max: 14 },
	},
	{
		name: 'Junior Varsity',
		ages: { min: 10, max: 11 },
	},
	{
		name: 'Peewee',
		ages: { min: 8, max: 9 },
	},
	{
		name: 'Junior Peewee',
		ages: { min: 6, max: 7 },
	},
	{
		name: 'Flag',
		ages: { min: 4, max: 5 },
	},
];

const createGroup = async (name, min, max) => {
	const group = await Group.create({
		name,
		ages: {
			min,
			max,
		},
		coaches: [],
		roster: [],
		games: [],
	});

	return group;
};

const createGroups = async () => {
	try {
		await Game.deleteMany();
		await User.deleteMany();
		await Group.deleteMany();
		console.log('All Models deleted');
	} catch (err) {
		console.error(err);
		console.log('Error deleting models');
		process.exit(1);
	}

	for (let i = 0; i < groups.length; i++) {
		try {
			const group = await createGroup(
				groups[i].name,
				groups[i].ages.min,
				groups[i].ages.max
			);

			console.log(`Group ${i + 1} created`);

			const numCoaches = 5;

			for (let j = 0; j < numCoaches; j++) {
				try {
					const coach = await User.create({
						firstName: faker.name.firstName(),
						lastName: faker.name.lastName(),
						avatar: faker.image.avatar(),
						role: 'COACH',
						email: faker.internet.email(),
						password: 'Testing1!',
						confirmPassword: 'Testing1!',
						groups: [group._id],
					});

					group.coaches.push(coach);

					await group.save();

					console.log(`Coach ${j + 1} added to group`);
				} catch (err) {
					console.error(err);
					console.log('Error creating coach');
					process.exit(1);
				}
			}

			if (i === groups.length - 1) {
				console.log('All Groups uploaded');
			}

			const numGames = 8;

			for (let j = 0; j < numGames; j++) {
				try {
					const game = await Game.create({
						opposingTeam: faker.animal.type(),
						dateTime: faker.date.soon(),
						location: {
							name: faker.company.name(),
							streetNumber: faker.address.buildingNumber(),
							streetName: faker.address.street(),
							city: faker.address.cityName(),
							state: faker.address.stateAbbr(),
							zip: faker.address.zipCode(),
						},
						group: group._id,
					});

					group.games.push(game);

					await group.save();

					console.log(`Game ${j + 1} added to group`);
				} catch (err) {
					console.error(err);
					console.log('Error creating game');
					process.exit(1);
				}
			}

			const numPlayers = 11;

			for (let j = 0; j < numPlayers; j++) {
				try {
					const player = await User.create({
						firstName: faker.name.firstName(),
						lastName: faker.name.lastName(),
						avatar: faker.image.avatar(),
						role: 'PLAYER',
						email: faker.internet.email(),
						password: 'Testing1!',
						confirmPassword: 'Testing1!',
						groups: [group._id],
					});

					group.roster.push(player);

					await group.save();

					console.log(`Player ${j + 1} added to group`);

					if (
						i === groups.length - 1 &&
						group.roster.length === numPlayers
					) {
						console.log('All Groups uploaded');
						process.exit(0);
					}
				} catch (err) {
					console.error(err);
					console.log('Error creating player');
					process.exit(1);
				}
			}
		} catch (err) {
			console.error(err);
			console.log('Error creating group');
			process.exit(1);
		}
	}
};

(async () => {
	await createGroups();
})();
