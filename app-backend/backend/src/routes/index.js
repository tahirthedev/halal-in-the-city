const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 auth requests per windowMs (increased for development)
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
const subscriptionRoutes = require('./subscription');
const notificationRoutes = require('./notification');
const adminRoutes = require('./admin');

// Mount routes with appropriate middleware
router.use('/auth', authLimiter, authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/deals', dealRoutes);
router.use('/redemptions', redemptionRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

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
      subscriptions: '/subscriptions',
      notifications: '/notifications',
      admin: '/admin'
    },
    documentation: 'See API_DOCUMENTATION.md for detailed endpoint information'
  });
});

module.exports = router;
