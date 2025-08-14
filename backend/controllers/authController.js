const User = require('../models/User');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// Helper function to verify tokens consistently
const verifyToken = async (token, redis) => {
  if (!token) throw createError(401, 'Authorization token required');
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // const storedToken = await redis.get(`session:${payload.id}`);
    
    // if (!storedToken || storedToken !== token) {
    //   throw createError(401, 'Session expired');
    // }
    return payload;
  } catch (err) {
    // Distinguish between different types of JWT errors
    if (err.name === 'TokenExpiredError') {
      throw createError(401, 'Token expired');
    }
    if (err.name === 'JsonWebTokenError') {
      throw createError(401, 'Invalid token');
    }
    throw createError(401, 'Authentication failed');
  }
};

exports.verify = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    await verifyToken(token, req.redis);
    res.json({ valid: true });
  } catch (err) {
    next(err);
  }
};

// Keep your existing register and login methods
exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const exists = await User.findOne({ username });
    if (exists) throw createError(400, 'Username taken');
    const user = await new User({ username, password }).save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const u = await User.findOne({ username });
    if (!u || !(await u.comparePassword(password))) {
      throw createError(401, 'Invalid credentials');
    }
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '5m' }); // 5 minutes
    res.json({ 
      token,
      expiresIn: 300 // 5 minutes in seconds
    });
  } catch (err) {
    next(err);
  }
};

