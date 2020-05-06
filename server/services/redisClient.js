const redis = require('redis');

const redisClient = redis.createClient({
    port: '6379',
    host: 'localhost',
    prefix: 'consensus:'
});

// redisClient.hgetall()

module.exports = redisClient;