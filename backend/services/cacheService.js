const { redisClient } = require("../configs/redis");

class CacheService {
  constructor(prefix = "cache", defaultTTL = 60 * 60) {
    this.prefix = prefix;
    this.ttl = defaultTTL;
  }

  buildKey(namespace, params) {
    return `${this.prefix}${namespace}:${JSON.stringify(params)}`;
  }

  async get(namespace, params) {
    const key = this.buildKey(namespace, params);
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  async set(namespace, params, data, ttl = this.ttl) {
    const key = this.buildKey(namespace, params);
    await redisClient.set(key, JSON.stringify(data), "EX", ttl);
  }

  async invalidate(namespace, params) {
    const key = this.buildKey(namespace, params);
    await redisClient.del(key);
  }

  async invalidateForNamespace(namespace) {
    const keys = await redisClient.keys(`${this.prefix}${namespace}:*`);
    if (keys.length) await redisClient.del(keys);
  }
}

module.exports = CacheService;
