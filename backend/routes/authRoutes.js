// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Make sure this path is correct

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Verify token route
router.get('/verify', authController.verify); // This fixes the 404 error

module.exports = router;