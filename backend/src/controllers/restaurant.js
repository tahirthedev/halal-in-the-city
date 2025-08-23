const restaurantService = require('../services/restaurant');

class RestaurantController {
  // GET /api/v1/restaurants
  async getRestaurants(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search,
        city: req.query.city,
        latitude: req.query.latitude ? parseFloat(req.query.latitude) : null,
        longitude: req.query.longitude ? parseFloat(req.query.longitude) : null,
        radius: parseInt(req.query.radius) || 10
      };

      const result = await restaurantService.getRestaurants(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get restaurants error:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get restaurants'
        }
      });
    }
  }

  // GET /api/v1/restaurants/:id
  async getRestaurantById(req, res) {
    try {
      const { id } = req.params;
      
      const restaurant = await restaurantService.getRestaurantById(id);

      res.json({
        success: true,
        data: { restaurant }
      });
    } catch (error) {
      console.error('Get restaurant error:', error);
      
      let statusCode = 500;
      let errorCode = 'INTERNAL_ERROR';
      let errorMessage = 'Failed to get restaurant';

      if (error.message === 'RESTAURANT_NOT_FOUND') {
        statusCode = 404;
        errorCode = 'NOT_FOUND';
        errorMessage = 'Restaurant not found';
      }

      res.status(statusCode).json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      });
    }
  }

  // POST /api/v1/restaurants
  async createRestaurant(req, res) {
    try {
      const restaurantData = req.body;
      const ownerId = req.user.role === 'ADMIN' ? restaurantData.ownerId || req.user.id : req.user.id;

      const restaurant = await restaurantService.createRestaurant(restaurantData, ownerId);

      res.status(201).json({
        success: true,
        data: { restaurant }
      });
    } catch (error) {
      console.error('Create restaurant error:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create restaurant'
        }
      });
    }
  }

  // PUT /api/v1/restaurants/:id
  async updateRestaurant(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const restaurant = await restaurantService.updateRestaurant(
        id, 
        updateData, 
        req.user.id, 
        req.user.role
      );

      res.json({
        success: true,
        data: { restaurant }
      });
    } catch (error) {
      console.error('Update restaurant error:', error);
      
      let statusCode = 500;
      let errorCode = 'INTERNAL_ERROR';
      let errorMessage = 'Failed to update restaurant';

      if (error.message === 'RESTAURANT_NOT_FOUND') {
        statusCode = 404;
        errorCode = 'NOT_FOUND';
        errorMessage = 'Restaurant not found';
      } else if (error.message === 'FORBIDDEN') {
        statusCode = 403;
        errorCode = 'FORBIDDEN';
        errorMessage = 'Cannot update restaurant';
      }

      res.status(statusCode).json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      });
    }
  }

  // DELETE /api/v1/restaurants/:id
  async deleteRestaurant(req, res) {
    try {
      const { id } = req.params;
      
      await restaurantService.deleteRestaurant(id, req.user.id, req.user.role);

      res.json({
        success: true,
        message: 'Restaurant deactivated successfully'
      });
    } catch (error) {
      console.error('Delete restaurant error:', error);
      
      let statusCode = 500;
      let errorCode = 'INTERNAL_ERROR';
      let errorMessage = 'Failed to delete restaurant';

      if (error.message === 'RESTAURANT_NOT_FOUND') {
        statusCode = 404;
        errorCode = 'NOT_FOUND';
        errorMessage = 'Restaurant not found';
      } else if (error.message === 'FORBIDDEN') {
        statusCode = 403;
        errorCode = 'FORBIDDEN';
        errorMessage = 'Cannot delete restaurant';
      }

      res.status(statusCode).json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      });
    }
  }

  // GET /api/v1/restaurants/my
  async getMyRestaurants(req, res) {
    try {
      const restaurants = await restaurantService.getRestaurantsByOwner(req.user.id);

      res.json({
        success: true,
        data: { restaurants }
      });
    } catch (error) {
      console.error('Get my restaurants error:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get restaurants'
        }
      });
    }
  }
}

module.exports = new RestaurantController();
