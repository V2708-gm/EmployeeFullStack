const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
  tls: {},  // Enable SSL for Redis Cloud
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error', err));

module.exports = redis;
