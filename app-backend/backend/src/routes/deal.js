const express = require('express');
const router = express.Router();

// Import controllers and middleware
const dealController = require('../controllers/deal');
const { authenticate, authorize, authorizeOwnerOrAdmin } = require('../middleware/auth');
const {
  dealValidation,
  dealUpdateValidation,
  paginationValidation,
  idValidation
} = require('../middleware/validation');

/**
 * Deal Routes
 * All routes for deal management, creation, and retrieval
 */

/**
 * GET /api/v1/deals
 * Get all deals with filtering and pagination
 * Query params: page, limit, latitude, longitude, radius, restaurantId, discountType, active, search
 */
router.get('/', 
  paginationValidation,
  dealController.getDeals
);

/**
 * GET /api/v1/deals/my
 * Get all deals for the logged-in merchant's restaurants
 * Requires authentication and restaurant owner role
 * Query params: page, limit, active
 */
router.get('/my',
  authenticate,
  authorize(['RESTAURANT_OWNER', 'ADMIN']),
  paginationValidation,
  dealController.getMyDeals
);

/**
 * GET /api/v1/deals/restaurant/:id
 * Get all deals for a specific restaurant
 * Query params: page, limit, active
 */
router.get('/restaurant/:id',
  idValidation,
  paginationValidation,
  dealController.getRestaurantDeals
);

/**
 * GET /api/v1/deals/:id
 * Get specific deal by ID
 * Query params: latitude, longitude (optional for distance calculation)
 */
router.get('/:id',
  idValidation,
  dealController.getDealById
);

/**
 * POST /api/v1/deals
 * Create new deal (restaurant owners only)
 * Requires authentication and restaurant owner role
 */
router.post('/',
  authenticate,
  authorize(['RESTAURANT_OWNER', 'ADMIN']),
  dealValidation,
  dealController.createDeal
);

/**
 * PUT /api/v1/deals/:id
 * Update existing deal (owner/admin only)
 * Requires authentication and ownership verification
 */
router.put('/:id',
  authenticate,
  authorize(['RESTAURANT_OWNER', 'ADMIN']),
  idValidation,
  dealUpdateValidation,
  dealController.updateDeal
);

/**
 * PATCH /api/v1/deals/:id/status
 * Toggle deal active status (owner/admin only)
 * Requires authentication and ownership verification
 */
router.patch('/:id/status',
  authenticate,
  authorize(['RESTAURANT_OWNER', 'ADMIN']),
  idValidation,
  dealController.toggleDealStatus
);

/**
 * DELETE /api/v1/deals/:id
 * Delete deal (soft delete - owner/admin only)
 * Requires authentication and ownership verification
 */
router.delete('/:id',
  authenticate,
  authorize(['RESTAURANT_OWNER', 'ADMIN']),
  idValidation,
  dealController.deleteDeal
);

module.exports = router;
