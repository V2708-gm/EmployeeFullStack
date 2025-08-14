const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Authorization header missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token, req.redis); // Reuse the same verify function
    
    // Attach user to request
    req.userId = payload.id;
    next();
  } catch (err) {
    // Provide more detailed error messages
    const message = err.message.includes('expired') ? 
      'Your session has expired. Please login again.' : 
      'Authentication failed. Please login again.';
    
    res.status(401).json({ 
      error: message,
      code: err.code || 'AUTH_ERROR'
    });
  }
};