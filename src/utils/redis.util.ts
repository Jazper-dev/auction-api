import Redis from 'ioredis';

const redis = new Redis.default();
export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key: string, value: any, ttl = 300) => {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
};

export const delCache = async (key: string) => {
  await redis.del(key);
};