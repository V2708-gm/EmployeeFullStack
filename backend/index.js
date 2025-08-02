require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const createError = require('http-errors');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/employees', employeeRoutes);

// 404 handler
app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});