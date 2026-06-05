const redis = require('redis');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected successfully!'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        logger.error('Failed to connect to Redis:', err);
    }
})();

module.exports = redisClient;