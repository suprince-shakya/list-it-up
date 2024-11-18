import { createClient, RedisClientOptions, RedisClientType } from 'redis';

export let redisClient: RedisClientType;

const cacheOptions = {
	url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
};

export const setupRedisClient = async () => {
	redisClient = await createClient({ ...cacheOptions });
	redisClient
		.on('error', (err) => {
			console.log('Redis Client Error', err);
		})
		.on('connect', () => {
			console.log('Connected to redis client');
		})
		.connect();
};

export const setValue = async (key: string, value: string | number, time: number) => {
	await redisClient.set(key, value, {
		EX: time,
		NX: true,
	});
};

export const getValue = async (key: string) => {
	return await redisClient.get(key);
};
