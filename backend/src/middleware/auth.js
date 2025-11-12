const authService = require('../services/auth');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token required'
        }
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = authService.verifyToken(token);
      
      if (decoded.type !== 'access') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_INVALID',
            message: 'Invalid token type'
          }
        });
      }

      // Get user details
      const user = await authService.getUserById(decoded.id);
      req.user = user;
      
      next();
    } catch (error) {
      let errorCode = 'TOKEN_INVALID';
      let errorMessage = 'Invalid access token';

      if (error.message === 'TOKEN_EXPIRED') {
        errorCode = 'TOKEN_EXPIRED';
        errorMessage = 'Access token has expired';
      } else if (error.message === 'USER_NOT_FOUND') {
        errorCode = 'USER_NOT_FOUND';
        errorMessage = 'User not found';
      } else if (error.message === 'ACCOUNT_DISABLED') {
        errorCode = 'ACCOUNT_DISABLED';
        errorMessage = 'Account has been disabled';
      }

      return res.status(401).json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

// Role-based authorization middleware
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
};

// Owner or admin authorization (for restaurant endpoints)
const authorizeOwnerOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Admin can access anything
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Restaurant owner can only access their own restaurant
    if (req.user.role === 'RESTAURANT_OWNER') {
      const restaurantId = req.params.id || req.body.restaurantId;
      
      if (restaurantId) {
        const databaseService = require('../services/database');
        const prisma = databaseService.getClient();
        
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: restaurantId },
          select: { ownerId: true }
        });

        if (!restaurant) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Restaurant not found'
            }
          });
        }

        if (restaurant.ownerId !== req.user.id) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Can only manage your own restaurant'
            }
          });
        }
      }

      return next();
    }

    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Insufficient permissions'
      }
    });
  } catch (error) {
    console.error('Authorization middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authorization failed'
      }
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  authorizeOwnerOrAdmin
};
