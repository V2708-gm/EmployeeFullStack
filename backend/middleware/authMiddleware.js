const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) throw createError(401, 'Missing token');
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const stored = await req.redis.get(`session:${payload.id}`);
    if (!stored || stored !== token) {
      throw createError(401, 'Invalid session');
    }
    req.userId = payload.id;
    next();
  } catch (err) {
    next(createError(401, 'Unauthorized'));
  }
};
