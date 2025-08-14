import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import createError from 'http-errors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import redis from './config/redisClient.js';
import rateLimiter from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.redis = redis;
  next();
});

// Call tracking
app.use(async (req, res, next) => {
  try {
    await req.redis.incr('analytics:total_calls');
  } catch (e) {
    console.error(e);
  }
  next();
});
app.use('/api', rateLimiter);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Employee Management API',
    status: 'running',
    routes: {
      auth: '/api/auth',
      employees: '/api/employees',
      analytics: '/api/analytics'
    }
  });
});

// 404 handler
app.use((req, res, next) => next(createError(404, 'Not found')));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: { status: err.status || 500, message: err.message },
  });
});

// ✅ Redis Pub/Sub setup
const subscriber = redis.duplicate();

await subscriber.subscribe('new-employee');
await subscriber.subscribe('employee-updated');
await subscriber.subscribe('employee-deleted');

subscriber.on('message', (channel, message) => {
  const data = JSON.parse(message);
  if (channel === 'new-employee') {
    io.emit('employeeEvent', { type: 'created', data });
  } else if (channel === 'employee-updated') {
    io.emit('employeeEvent', { type: 'updated', data });
  } else if (channel === 'employee-deleted') {
    io.emit('employeeEvent', { type: 'deleted', data });
  }
});

// Connect DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Mongo connected'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
