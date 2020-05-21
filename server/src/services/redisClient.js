const redis = require('redis');

const redisClient = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    prefix: process.env.REDIS_PREFIX
});


module.exports = redisClient;