const User = require('../models/User');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

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
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Store session
    await req.redis.set(`session:${u._id}`, token, 'EX', 3600);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
