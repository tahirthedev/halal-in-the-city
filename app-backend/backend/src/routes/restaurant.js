const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurant');
const { authenticate, authorize, authorizeOwnerOrAdmin } = require('../middleware/auth');
const {
  restaurantValidation,
  restaurantUpdateValidation,
  paginationValidation,
  idValidation
} = require('../middleware/validation');

// GET /api/v1/restaurants
router.get('/', paginationValidation, restaurantController.getRestaurants);

// GET /api/v1/restaurants/my - Must come before /:id route
router.get('/my', 
  authenticate, 
  authorize(['RESTAURANT_OWNER', 'ADMIN']), 
  restaurantController.getMyRestaurants
);

// GET /api/v1/restaurants/:id
router.get('/:id', idValidation, restaurantController.getRestaurantById);

// POST /api/v1/restaurants
router.post('/', 
  authenticate, 
  authorize(['RESTAURANT_OWNER', 'ADMIN']), 
  restaurantValidation, 
  restaurantController.createRestaurant
);

// PUT /api/v1/restaurants/:id
router.put('/:id', 
  authenticate, 
  idValidation, 
  authorizeOwnerOrAdmin, 
  restaurantUpdateValidation, 
  restaurantController.updateRestaurant
);

// DELETE /api/v1/restaurants/:id
router.delete('/:id', 
  authenticate, 
  idValidation, 
  authorizeOwnerOrAdmin, 
  restaurantController.deleteRestaurant
);

module.exports = router;
