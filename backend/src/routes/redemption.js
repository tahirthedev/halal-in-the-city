const express = require('express');
const router = express.Router();

// Import controllers and middleware
const redemptionController = require('../controllers/redemption');
const { authenticate, authorize } = require('../middleware/auth');
const {
  redemptionValidation,
  paginationValidation,
  idValidation
} = require('../middleware/validation');

/**
 * Redemption Routes
 * All routes for deal redemption, validation, and history
 */

/**
 * POST /api/v1/redemptions/redeem
 * Redeem a deal via QR code scan
 * Requires authentication
 */
router.post('/redeem',
  authenticate,
  redemptionValidation,
  redemptionController.redeemDeal
);

/**
 * POST /api/v1/redemptions/validate
 * Validate redemption before processing (dry-run)
 * Requires authentication
 */
router.post('/validate',
  authenticate,
  redemptionValidation,
  redemptionController.validateRedemption
);

/**
 * GET /api/v1/redemptions
 * Get user's redemption history
 * Requires authentication
 * Query params: page, limit, status
 */
router.get('/',
  authenticate,
  paginationValidation,
  redemptionController.getRedemptions
);

/**
 * GET /api/v1/redemptions/restaurant/:restaurantId
 * Get restaurant's redemptions (owner/admin only)
 * Requires authentication and appropriate role
 * Query params: page, limit, status, startDate, endDate
 */
router.get('/restaurant/:restaurantId',
  authenticate,
  authorize(['RESTAURANT_OWNER', 'ADMIN']),
  idValidation,
  paginationValidation,
  redemptionController.getRestaurantRedemptions
);

/**
 * GET /api/v1/redemptions/:id
 * Get specific redemption by ID
 * Requires authentication (users can only see their own redemptions)
 */
router.get('/:id',
  authenticate,
  idValidation,
  redemptionController.getRedemptionById
);

module.exports = router;
