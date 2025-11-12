const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many authentication attempts, please try again later'
    }
  }
});

// Import route modules
const authRoutes = require('./auth');
const restaurantRoutes = require('./restaurant');
const dealRoutes = require('./deal');
const redemptionRoutes = require('./redemption');

// Mount routes with appropriate middleware
router.use('/auth', authLimiter, authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/deals', dealRoutes);
router.use('/redemptions', redemptionRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Halal in the City API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      restaurants: '/restaurants',
      deals: '/deals',
      redemptions: '/redemptions',
      users: '/users',
      admin: '/admin'
    },
    documentation: 'See API_DOCUMENTATION.md for detailed endpoint information'
  });
});

module.exports = router;
