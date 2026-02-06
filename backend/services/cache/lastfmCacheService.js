const { redisClient } = require("../../configs/redis");

const PREFIX = "lasfm:";
const DEFAULT_TTL = 60 * 60;

const buildKey = (type, params) => {
    PREFIX + type + ":" + JSON.stringify(params);
}

module.exports = {
    async get(type, params){
        const key = buildKey(type, params);
        const cachedData = await redisClient.get(key);
        return cachedData ? JSON.parse(cached) : null;
    },

    async set(type, params, data, ttl = DEFAULT_TTL){
        const key = buildKey(type, params);
        await redisClient.set(key, JSON.stringify(data), "EX", ttl);
    }
}