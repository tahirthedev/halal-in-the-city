const { PrismaClient } = require('@prisma/client');
const { getDistance } = require('geolib');
const { formatDistanceToNow } = require('date-fns');

const databaseService = require('../services/database');
const prisma = databaseService.getClient();

/**
 * Redemption Controller
 * Handles all redemption-related operations including QR scanning, validation, and processing
 */

/**
 * Redeem a deal via QR code
 * POST /api/v1/redemptions/redeem
 */
const redeemDeal = async (req, res) => {
  try {
    const {
      dealId,
      code,
      orderAmount,
      latitude,
      longitude
    } = req.body;

    const userId = req.user.id;

    // Validate deal exists and is active
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            province: true,
            latitude: true,
            longitude: true,
            phone: true
          }
        }
      }
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DEAL_NOT_FOUND',
          message: 'Deal not found'
        }
      });
    }

    // Verify deal code matches
    if (deal.code !== code) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DEAL_CODE',
          message: 'Invalid deal code'
        }
      });
    }

    // Check if deal is currently valid
    const now = new Date();
    
    if (!deal.isActive) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DEAL_INACTIVE',
          message: 'This deal is no longer active'
        }
      });
    }

    if (deal.expiresAt <= now) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DEAL_EXPIRED',
          message: 'This deal has expired'
        }
      });
    }

    if (deal.startsAt > now) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DEAL_NOT_STARTED',
          message: 'This deal has not started yet'
        }
      });
    }

    // Check if deal has remaining uses
    if (deal.remainingUses <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DEAL_EXHAUSTED',
          message: 'This deal has been fully redeemed'
        }
      });
    }

    // Check per-user redemption limit
    const userRedemptionCount = await prisma.redemption.count({
      where: {
        userId,
        dealId,
        status: 'COMPLETED'
      }
    });

    if (userRedemptionCount >= deal.perUserLimit) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_LIMIT_EXCEEDED',
          message: `You have already redeemed this deal the maximum number of times (${deal.perUserLimit})`
        }
      });
    }

    // Check minimum order amount
    if (deal.minOrderAmount && orderAmount < deal.minOrderAmount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MINIMUM_ORDER_NOT_MET',
          message: `Minimum order amount of $${deal.minOrderAmount} required`
        }
      });
    }

    // Location verification (if coordinates provided)
    let locationVerified = true;
    let distance = null;

    if (latitude && longitude && deal.restaurant.latitude && deal.restaurant.longitude) {
      distance = getDistance(
        { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        { latitude: deal.restaurant.latitude, longitude: deal.restaurant.longitude }
      );

      // Allow redemption within 100 meters of restaurant
      const maxDistance = 100; // meters
      locationVerified = distance <= maxDistance;

      if (!locationVerified) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'LOCATION_VERIFICATION_FAILED',
            message: `You must be within ${maxDistance}m of the restaurant to redeem this deal`
          },
          data: {
            distance: Math.round(distance),
            maxDistance,
            restaurant: {
              name: deal.restaurant.name,
              address: deal.restaurant.address
            }
          }
        });
      }
    }

    // Calculate discount amount based on deal type
    let discountAmount = 0;
    let finalAmount = orderAmount;

    switch (deal.discountType) {
      case 'PERCENTAGE':
        discountAmount = (orderAmount * deal.discountValue) / 100;
        finalAmount = orderAmount - discountAmount;
        break;
      case 'FIXED':
        discountAmount = Math.min(deal.discountValue, orderAmount);
        finalAmount = orderAmount - discountAmount;
        break;
      case 'BOGO':
        // For BOGO, discount is 50% of order amount
        discountAmount = orderAmount * 0.5;
        finalAmount = orderAmount - discountAmount;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DISCOUNT_TYPE',
            message: 'Invalid discount type'
          }
        });
    }

    // Create redemption in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create redemption record
      const redemption = await tx.redemption.create({
        data: {
          userId,
          dealId,
          code: `RED-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          orderAmount: parseFloat(orderAmount),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          finalAmount: parseFloat(finalAmount.toFixed(2)),
          status: 'COMPLETED',
          redeemedAt: new Date(),
          location: latitude && longitude ? {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            verified: locationVerified,
            distance: distance
          } : null
        },
        include: {
          deal: {
            include: {
              restaurant: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  city: true,
                  province: true,
                  phone: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      // Update deal usage counts
      await tx.deal.update({
        where: { id: dealId },
        data: {
          usedCount: { increment: 1 },
          remainingUses: { decrement: 1 }
        }
      });

      return redemption;
    });

    res.status(201).json({
      success: true,
      data: {
        redemption: result,
        savings: discountAmount.toFixed(2),
        message: 'Deal redeemed successfully!'
      },
      message: 'Deal redeemed successfully'
    });

  } catch (error) {
    console.error('Error redeeming deal:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REDEMPTION_FAILED',
        message: 'Failed to redeem deal'
      }
    });
  }
};

/**
 * Validate redemption before processing
 * POST /api/v1/redemptions/validate
 */
const validateRedemption = async (req, res) => {
  try {
    const {
      dealId,
      code,
      orderAmount,
      latitude,
      longitude
    } = req.body;

    const userId = req.user.id;

    // Validate deal exists and is active
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            province: true,
            latitude: true,
            longitude: true
          }
        }
      }
    });

    if (!deal || deal.code !== code) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DEAL_NOT_FOUND',
          message: 'Deal not found or invalid code'
        }
      });
    }

    // Check deal validity
    const now = new Date();
    const validationErrors = [];

    if (!deal.isActive) {
      validationErrors.push('Deal is no longer active');
    }

    if (deal.expiresAt <= now) {
      validationErrors.push('Deal has expired');
    }

    if (deal.startsAt > now) {
      validationErrors.push('Deal has not started yet');
    }

    if (deal.remainingUses <= 0) {
      validationErrors.push('Deal has been fully redeemed');
    }

    // Check per-user redemption limit
    const userRedemptionCount = await prisma.redemption.count({
      where: {
        userId,
        dealId,
        status: 'COMPLETED'
      }
    });

    if (userRedemptionCount >= deal.perUserLimit) {
      validationErrors.push(`You have already redeemed this deal ${userRedemptionCount} time(s). Limit: ${deal.perUserLimit}`);
    }

    // Check minimum order amount
    if (deal.minOrderAmount && orderAmount < deal.minOrderAmount) {
      validationErrors.push(`Minimum order amount of $${deal.minOrderAmount} required`);
    }

    // Location verification
    let locationVerified = true;
    let distance = null;

    if (latitude && longitude && deal.restaurant.latitude && deal.restaurant.longitude) {
      distance = getDistance(
        { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        { latitude: deal.restaurant.latitude, longitude: deal.restaurant.longitude }
      );

      const maxDistance = 100; // meters
      locationVerified = distance <= maxDistance;

      if (!locationVerified) {
        validationErrors.push(`You must be within ${maxDistance}m of the restaurant (currently ${Math.round(distance)}m away)`);
      }
    }

    // Calculate potential discount
    let discountAmount = 0;
    let finalAmount = orderAmount;

    if (validationErrors.length === 0) {
      switch (deal.discountType) {
        case 'PERCENTAGE':
          discountAmount = (orderAmount * deal.discountValue) / 100;
          break;
        case 'FIXED':
          discountAmount = Math.min(deal.discountValue, orderAmount);
          break;
        case 'BOGO':
          discountAmount = orderAmount * 0.5;
          break;
      }
      finalAmount = orderAmount - discountAmount;
    }

    const isValid = validationErrors.length === 0;

    res.json({
      success: true,
      data: {
        isValid,
        validationErrors,
        deal: {
          id: deal.id,
          title: deal.title,
          description: deal.description,
          discountType: deal.discountType,
          discountValue: deal.discountValue,
          minOrderAmount: deal.minOrderAmount,
          remainingUses: deal.remainingUses,
          expiresAt: deal.expiresAt,
          restaurant: deal.restaurant
        },
        calculation: isValid ? {
          orderAmount: parseFloat(orderAmount),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          finalAmount: parseFloat(finalAmount.toFixed(2)),
          savings: parseFloat(discountAmount.toFixed(2))
        } : null,
        location: {
          verified: locationVerified,
          distance: distance ? Math.round(distance) : null,
          maxDistance: 100
        }
      },
      message: isValid ? 'Deal is valid for redemption' : 'Deal validation failed'
    });

  } catch (error) {
    console.error('Error validating redemption:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Failed to validate redemption'
      }
    });
  }
};

/**
 * Get user's redemption history
 * GET /api/v1/redemptions
 */
const getRedemptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    let whereClause = { userId };
    
    if (status) {
      whereClause.status = status;
    }

    const redemptions = await prisma.redemption.findMany({
      where: whereClause,
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            discountType: true,
            discountValue: true,
            expiresAt: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { redeemedAt: 'desc' },
      skip,
      take
    });

    const totalCount = await prisma.redemption.count({ where: whereClause });

    // Calculate total savings
    const totalSavings = await prisma.redemption.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { discountAmount: true }
    });

    res.json({
      success: true,
      data: {
        redemptions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          hasNext: parseInt(page) * parseInt(limit) < totalCount,
          hasPrev: parseInt(page) > 1
        },
        summary: {
          totalRedemptions: totalCount,
          totalSavings: totalSavings._sum.discountAmount || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching redemptions:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REDEMPTIONS_FETCH_FAILED',
        message: 'Failed to fetch redemptions'
      }
    });
  }
};

/**
 * Get specific redemption by ID
 * GET /api/v1/redemptions/:id
 */
const getRedemptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const redemption = await prisma.redemption.findFirst({
      where: {
        id,
        userId
      },
      include: {
        deal: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                province: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!redemption) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REDEMPTION_NOT_FOUND',
          message: 'Redemption not found'
        }
      });
    }

    res.json({
      success: true,
      data: { redemption }
    });

  } catch (error) {
    console.error('Error fetching redemption:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REDEMPTION_FETCH_FAILED',
        message: 'Failed to fetch redemption'
      }
    });
  }
};

/**
 * Get restaurant's redemptions (owner/admin only)
 * GET /api/v1/redemptions/restaurant/:restaurantId
 */
const getRestaurantRedemptions = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    // Verify restaurant ownership (unless admin)
    if (req.user.role !== 'ADMIN') {
      const restaurant = await prisma.restaurant.findFirst({
        where: {
          id: restaurantId,
          ownerId: req.user.id
        }
      });

      if (!restaurant) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'RESTAURANT_ACCESS_DENIED',
            message: 'You do not have access to this restaurant\'s redemptions'
          }
        });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    let whereClause = {
      deal: {
        restaurantId
      }
    };

    if (status) {
      whereClause.status = status;
    }

    if (startDate || endDate) {
      whereClause.redeemedAt = {};
      if (startDate) {
        whereClause.redeemedAt.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.redeemedAt.lte = new Date(endDate);
      }
    }

    const redemptions = await prisma.redemption.findMany({
      where: whereClause,
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            discountType: true,
            discountValue: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { redeemedAt: 'desc' },
      skip,
      take
    });

    const totalCount = await prisma.redemption.count({ where: whereClause });

    // Calculate analytics
    const analytics = await prisma.redemption.aggregate({
      where: {
        deal: { restaurantId },
        status: 'COMPLETED'
      },
      _sum: {
        orderAmount: true,
        discountAmount: true,
        finalAmount: true
      },
      _count: true
    });

    res.json({
      success: true,
      data: {
        redemptions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          hasNext: parseInt(page) * parseInt(limit) < totalCount,
          hasPrev: parseInt(page) > 1
        },
        analytics: {
          totalRedemptions: analytics._count,
          totalOrderValue: analytics._sum.orderAmount || 0,
          totalDiscountGiven: analytics._sum.discountAmount || 0,
          totalRevenue: analytics._sum.finalAmount || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching restaurant redemptions:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'RESTAURANT_REDEMPTIONS_FETCH_FAILED',
        message: 'Failed to fetch restaurant redemptions'
      }
    });
  }
};

module.exports = {
  redeemDeal,
  validateRedemption,
  getRedemptions,
  getRedemptionById,
  getRestaurantRedemptions
};
