const redis = require('../config/redisClient');
const WINDOW_SIZE = 60; // 1 minute window in seconds
const MAX_REQUESTS = 10;

module.exports = async (req, res, next) => {
  // Get client IP (works behind proxies)
  const clientIp = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  const key = `rate_limit:${clientIp}`;

  try {
    const [[, count], [, ttl]] = await redis.multi()
      .get(key)
      .ttl(key)
      .exec();

    let currentCount = count ? parseInt(count) : 0;
    let resetTime = ttl > 0 ? ttl : WINDOW_SIZE;

    if (currentCount === 0) {
      await redis.setex(key, WINDOW_SIZE, 1);
      currentCount = 1;
    } else {
      currentCount = await redis.incr(key);
    }

    // Calculate remaining requests
    const remaining = Math.max(0, MAX_REQUESTS - currentCount);

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': MAX_REQUESTS,
      'X-RateLimit-Remaining': remaining,
      'X-RateLimit-Reset': resetTime,
      'Access-Control-Expose-Headers': 'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After'
    });

    // Check if limit exceeded
    if (currentCount > MAX_REQUESTS) {
      res.set('Retry-After', resetTime);
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${resetTime} seconds.`,
        retryAfter: resetTime
      });
    }

    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    // Fail open - allow request if Redis fails
    next();
  }
};