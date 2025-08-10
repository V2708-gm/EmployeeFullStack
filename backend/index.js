require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const createError = require('http-errors');

const redis = require('./config/redisClient');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => { req.redis = redis; next(); });
app.use(rateLimiter);

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Mongo connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use((req,res,next) => next(createError(404, 'Not found')));
app.use((err, req, res, next) => res.status(err.status || 500).json({
  error: { status: err.status || 500, message: err.message }
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
