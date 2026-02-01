const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis client connected");
  } catch (err) {
    console.error("Failed to connect redis client", err);
    process.exit(1);
  }
};

const saveRefreshToken = async (userId, token, ttl) => {
  await redisClient.set(`refresh_token:${userId}`, token, {
    expiration: { type: "EX", value: ttl },
  });
};

const getRefreshToken = async (userId) => {
  return await redisClient.get(`refresh_token:${userId}`);
};

const deleteRefreshToken = async (userId) => {
  await redisClient.del(`refresh_token:${userId}`);
};

module.exports = {
  redisClient,
  connectRedis,
  saveRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
};
