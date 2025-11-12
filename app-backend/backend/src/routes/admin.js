const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  getPendingRestaurants,
  getAllRestaurants,
  approveRestaurant,
  rejectRestaurant,
  getPendingDeals,
  getAllDeals,
  approveDeal,
  rejectDeal,
  getAllUsers,
  toggleUserStatus,
  getStats,
  createRestaurantWithOwner,
} = require('../controllers/admin');

// Middleware: All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(requireRole('ADMIN'));

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Admin only
 */
router.get('/stats', getStats);

// ==================== RESTAURANT ROUTES ====================

/**
 * @route   GET /api/admin/restaurants
 * @desc    Get all restaurants (with optional filters)
 * @access  Admin only
 */
router.get('/restaurants', getAllRestaurants);

/**
 * @route   POST /api/admin/restaurants/create-with-owner
 * @desc    Create a new restaurant with owner account
 * @access  Admin only
 */
router.post('/restaurants/create-with-owner', createRestaurantWithOwner);

/**
 * @route   GET /api/admin/restaurants/pending
 * @desc    Get all pending restaurants
 * @access  Admin only
 */
router.get('/restaurants/pending', getPendingRestaurants);

/**
 * @route   PATCH /api/admin/restaurants/:id/approve
 * @desc    Approve a restaurant
 * @access  Admin only
 */
router.patch('/restaurants/:id/approve', approveRestaurant);

/**
 * @route   PATCH /api/admin/restaurants/:id/reject
 * @desc    Reject a restaurant
 * @access  Admin only
 */
router.patch('/restaurants/:id/reject', rejectRestaurant);

// ==================== DEAL ROUTES ====================

/**
 * @route   GET /api/admin/deals
 * @desc    Get all deals (with optional filters)
 * @access  Admin only
 */
router.get('/deals', getAllDeals);

/**
 * @route   GET /api/admin/deals/pending
 * @desc    Get all pending deals
 * @access  Admin only
 */
router.get('/deals/pending', getPendingDeals);

/**
 * @route   PATCH /api/admin/deals/:id/approve
 * @desc    Approve a deal
 * @access  Admin only
 */
router.patch('/deals/:id/approve', approveDeal);

/**
 * @route   PATCH /api/admin/deals/:id/reject
 * @desc    Reject a deal
 * @access  Admin only
 */
router.patch('/deals/:id/reject', rejectDeal);

// ==================== USER ROUTES ====================

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (with optional filters)
 * @access  Admin only
 */
router.get('/users', getAllUsers);

/**
 * @route   PATCH /api/admin/users/:id/toggle-status
 * @desc    Activate/deactivate a user
 * @access  Admin only
 */
router.patch('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
