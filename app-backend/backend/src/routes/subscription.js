const express = require('express');
const router = express.Router();
const { getTiers, getTierInfo } = require('../controllers/subscription');

/**
 * @route   GET /api/subscriptions/tiers
 * @desc    Get all subscription tiers
 * @access  Public
 */
router.get('/tiers', getTiers);

/**
 * @route   GET /api/subscriptions/tiers/:tier
 * @desc    Get specific tier details
 * @access  Public
 */
router.get('/tiers/:tier', getTierInfo);

module.exports = router;
