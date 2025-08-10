const redis = require('../config/redisClient');
const WINDOW = 60; // seconds
const MAX = 100;

module.exports = async (req, res, next) => {
  const key = `rate:${req.ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, WINDOW);
  if (count > MAX) {
    const ttl = await redis.ttl(key);
    return res.set('Retry-After', ttl).status(429).json({ error: 'Too many requests', retryAfter: ttl });
  }
  next();
};
