const { PrismaClient } = require('@prisma/client');
const QRCode = require('qrcode');
const { formatDistanceToNow, isAfter, isBefore } = require('date-fns');
const { getDistance } = require('geolib');
const { notifyAdmins } = require('../services/notification');

const databaseService = require('../services/database');
const prisma = databaseService.getClient();

/**
 * Deal Controller
 * Handles all deal-related operations including creation, management, and QR code generation
 */

/**
 * Create a new deal
 * POST /api/v1/deals
 */
const createDeal = async (req, res) => {
  try {
    const {
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxUses,
      perUserLimit,
      startsAt,
      expiresAt,
      terms,
      restaurantId
    } = req.body;

    // Verify restaurant ownership
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        ownerId: req.user.id,
        isActive: true
      }
    });

    if (!restaurant) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'RESTAURANT_NOT_FOUND',
          message: 'Restaurant not found or you do not have permission to create deals for this restaurant'
        }
      });
    }

    // Check subscription tier limits
    const activeDealCount = await prisma.deal.count({
      where: {
        restaurantId,
        isActive: true,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date()
        }
      }
    });

    const tierLimits = {
      STARTER: 1,  // 1 active deal
      GROWTH: 3    // 3 active deals
    };

    const maxDeals = tierLimits[restaurant.subscriptionTier];
    if (maxDeals && activeDealCount >= maxDeals) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DEAL_LIMIT_REACHED',
          message: `Your ${restaurant.subscriptionTier} subscription allows maximum ${maxDeals} active deal${maxDeals > 1 ? 's' : ''}. You currently have ${activeDealCount} active deal${activeDealCount > 1 ? 's' : ''}.`
        }
      });
    }

    // Generate unique deal code
    const dealCode = `DEAL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create the deal with auto-approval
    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        code: dealCode,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
        maxUses: parseInt(maxUses) || 5, // Default 5 unique users
        perUserLimit: parseInt(perUserLimit) || 1,
        usedCount: 0,
        remainingUses: parseInt(maxUses) || 5,
        isActive: true,
        status: 'ACTIVE',
        approvalStatus: 'APPROVED', // Auto-approve deals
        approvedBy: 'SYSTEM',
        approvedAt: new Date(),
        startsAt: startsAt ? new Date(startsAt) : new Date(),
        expiresAt: new Date(expiresAt),
        terms: terms || null,
        restaurantId
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            province: true
          }
        }
      }
    });

    // Generate QR Code
    const qrData = {
      dealId: deal.id,
      code: deal.code,
      restaurantId: deal.restaurantId,
      type: 'DEAL_REDEMPTION'
    };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Update deal with QR code
    const updatedDeal = await prisma.deal.update({
      where: { id: deal.id },
      data: { qrCode: qrCodeDataURL },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            province: true,
            phone: true,
            email: true
          }
        }
      }
    });

    // Notify admins about new deal pending approval
    await notifyAdmins(
      'NEW_DEAL_PENDING',
      'New Deal Pending Approval',
      `${restaurant.name} created a new deal: "${title}"`,
      { dealId: updatedDeal.id, dealTitle: title, restaurantName: restaurant.name }
    );

    res.status(201).json({
      success: true,
      data: {
        deal: updatedDeal,
        qrCode: qrCodeDataURL
      },
      message: 'Deal created successfully'
    });

  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DEAL_CREATION_FAILED',
        message: 'Failed to create deal'
      }
    });
  }
};

/**
 * Get deals with filtering and pagination
 * GET /api/v1/deals
 */
const getDeals = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      latitude,
      longitude,
      radius = 10, // km
      restaurantId,
      discountType,
      active = true,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    let whereClause = {};

    if (active === 'true') {
      whereClause.isActive = true;
      whereClause.expiresAt = { gt: new Date() };
      whereClause.startsAt = { lte: new Date() };
    }

    if (restaurantId) {
      whereClause.restaurantId = restaurantId;
    }

    if (discountType) {
      whereClause.discountType = discountType;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { restaurant: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Get deals
    const deals = await prisma.deal.findMany({
      where: whereClause,
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
            averageRating: true,
            cuisineType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });

    // Filter by location if coordinates provided
    let filteredDeals = deals;
    if (latitude && longitude) {
      filteredDeals = deals.filter(deal => {
        if (!deal.restaurant.latitude || !deal.restaurant.longitude) return false;
        
        const distance = getDistance(
          { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
          { latitude: deal.restaurant.latitude, longitude: deal.restaurant.longitude }
        ) / 1000; // Convert to km

        return distance <= parseFloat(radius);
      });

      // Add distance to each deal
      filteredDeals = filteredDeals.map(deal => ({
        ...deal,
        distance: getDistance(
          { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
          { latitude: deal.restaurant.latitude, longitude: deal.restaurant.longitude }
        ) / 1000
      }));

      // Sort by distance
      filteredDeals.sort((a, b) => a.distance - b.distance);
    }

    // Get total count for pagination
    const totalCount = await prisma.deal.count({ where: whereClause });

    // Format response
    const formattedDeals = filteredDeals.map(deal => ({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      code: deal.code,
      discountType: deal.discountType,
      discountValue: deal.discountValue,
      minOrderAmount: deal.minOrderAmount,
      maxUses: deal.maxUses,
      usedCount: deal.usedCount,
      remainingUses: deal.remainingUses,
      perUserLimit: deal.perUserLimit,
      isActive: deal.isActive,
      startsAt: deal.startsAt,
      expiresAt: deal.expiresAt,
      terms: deal.terms,
      createdAt: deal.createdAt,
      restaurant: deal.restaurant,
      distance: deal.distance || null,
      timeRemaining: formatDistanceToNow(new Date(deal.expiresAt), { addSuffix: true })
    }));

    res.json({
      success: true,
      data: {
        deals: formattedDeals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredDeals.length,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          hasNext: parseInt(page) * parseInt(limit) < totalCount,
          hasPrev: parseInt(page) > 1
        },
        filters: {
          latitude: latitude || null,
          longitude: longitude || null,
          radius: parseFloat(radius),
          restaurantId: restaurantId || null,
          discountType: discountType || null,
          active: active === 'true'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DEALS_FETCH_FAILED',
        message: 'Failed to fetch deals'
      }
    });
  }
};

/**
 * Get specific deal by ID
 * GET /api/v1/deals/:id
 */
const getDealById = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.query;

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            description: true,
            address: true,
            city: true,
            province: true,
            postalCode: true,
            phone: true,
            email: true,
            website: true,
            latitude: true,
            longitude: true,
            averageRating: true,
            totalReviews: true,
            cuisineType: true,
            subscriptionTier: true
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

    // Calculate distance if coordinates provided
    let distance = null;
    if (latitude && longitude && deal.restaurant.latitude && deal.restaurant.longitude) {
      distance = getDistance(
        { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        { latitude: deal.restaurant.latitude, longitude: deal.restaurant.longitude }
      ) / 1000;
    }

    // Check if deal is currently valid
    const now = new Date();
    const isValid = deal.isActive && 
                   isAfter(deal.expiresAt, now) && 
                   isBefore(deal.startsAt, now) && 
                   deal.remainingUses > 0;

    res.json({
      success: true,
      data: {
        deal: {
          ...deal,
          distance,
          timeRemaining: formatDistanceToNow(new Date(deal.expiresAt), { addSuffix: true }),
          isValid,
          qrCode: deal.qrCode // Include QR code for scanning
        }
      }
    });

  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DEAL_FETCH_FAILED',
        message: 'Failed to fetch deal'
      }
    });
  }
};

/**
 * Update deal (owner only)
 * PUT /api/v1/deals/:id
 */
const updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find deal and verify ownership
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id,
        restaurant: {
          ownerId: req.user.id
        }
      },
      include: { restaurant: true }
    });

    if (!existingDeal) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DEAL_NOT_FOUND',
          message: 'Deal not found or you do not have permission to update it'
        }
      });
    }

    // Prevent updating if deal has been redeemed
    if (existingDeal.usedCount > 0 && (updates.discountType || updates.discountValue)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DEAL_ALREADY_REDEEMED',
          message: 'Cannot modify discount details for a deal that has already been redeemed'
        }
      });
    }

    // Prepare update data
    const updateData = {};
    const allowedFields = [
      'title', 'description', 'discountType', 'discountValue', 
      'minOrderAmount', 'maxUses', 'perUserLimit', 'expiresAt', 'terms'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        if (field === 'discountValue' || field === 'minOrderAmount') {
          updateData[field] = parseFloat(updates[field]);
        } else if (field === 'maxUses' || field === 'perUserLimit') {
          updateData[field] = parseInt(updates[field]);
        } else if (field === 'expiresAt') {
          updateData[field] = new Date(updates[field]);
        } else {
          updateData[field] = updates[field];
        }
      }
    });

    // Update remaining uses if maxUses changed
    if (updateData.maxUses) {
      updateData.remainingUses = updateData.maxUses - existingDeal.usedCount;
    }

    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            province: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: { deal: updatedDeal },
      message: 'Deal updated successfully'
    });

  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DEAL_UPDATE_FAILED',
        message: 'Failed to update deal'
      }
    });
  }
};

/**
 * Delete deal (soft delete)
 * DELETE /api/v1/deals/:id
 */
const deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;

    // Find deal and verify ownership
    const deal = await prisma.deal.findFirst({
      where: {
        id,
        restaurant: {
          ownerId: req.user.id
        }
      }
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DEAL_NOT_FOUND',
          message: 'Deal not found or you do not have permission to delete it'
        }
      });
    }

    // Soft delete by deactivating
    await prisma.deal.update({
      where: { id },
      data: {
        isActive: false,
        remainingUses: 0
      }
    });

    res.json({
      success: true,
      message: 'Deal deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DEAL_DELETE_FAILED',
        message: 'Failed to delete deal'
      }
    });
  }
};

/**
 * Toggle deal status (activate/deactivate)
 * PATCH /api/v1/deals/:id/status
 */
const toggleDealStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Find deal and verify ownership
    const deal = await prisma.deal.findFirst({
      where: {
        id,
        restaurant: {
          ownerId: req.user.id
        }
      },
      include: {
        restaurant: true
      }
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DEAL_NOT_FOUND',
          message: 'Deal not found or you do not have permission to modify it'
        }
      });
    }

    // If activating, check subscription tier limits
    if (isActive && !deal.isActive) {
      const activeDealCount = await prisma.deal.count({
        where: {
          restaurantId: deal.restaurantId,
          isActive: true,
          status: 'ACTIVE',
          expiresAt: {
            gt: new Date()
          },
          id: {
            not: id // Exclude current deal from count
          }
        }
      });

      const tierLimits = {
        STARTER: 1,
        GROWTH: 3
      };

      const maxDeals = tierLimits[deal.restaurant.subscriptionTier];
      if (maxDeals && activeDealCount >= maxDeals) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'DEAL_LIMIT_REACHED',
            message: `Your ${deal.restaurant.subscriptionTier} subscription allows maximum ${maxDeals} concurrent active deal${maxDeals > 1 ? 's' : ''}. You currently have ${activeDealCount} active deal${activeDealCount > 1 ? 's' : ''}. Please deactivate another deal first.`
          }
        });
      }
    }

    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: { deal: updatedDeal },
      message: `Deal ${isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Error toggling deal status:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DEAL_STATUS_UPDATE_FAILED',
        message: 'Failed to update deal status'
      }
    });
  }
};

/**
 * Get deals for a specific restaurant
 * GET /api/v1/deals/restaurant/:restaurantId
 */
const getRestaurantDeals = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    const { page = 1, limit = 20, active } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    let whereClause = { restaurantId };

    if (active === 'true') {
      whereClause.isActive = true;
      whereClause.expiresAt = { gt: new Date() };
    } else if (active === 'false') {
      whereClause.OR = [
        { isActive: false },
        { expiresAt: { lte: new Date() } }
      ];
    }

    const deals = await prisma.deal.findMany({
      where: whereClause,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            province: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });

    const totalCount = await prisma.deal.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        deals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          hasNext: parseInt(page) * parseInt(limit) < totalCount,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching restaurant deals:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'RESTAURANT_DEALS_FETCH_FAILED',
        message: 'Failed to fetch restaurant deals'
      }
    });
  }
};

/**
 * Get deals for the logged-in merchant's restaurants
 * GET /api/v1/deals/my
 */
const getMyDeals = async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause - get all deals for restaurants owned by this user
    let whereClause = {
      restaurant: {
        ownerId: req.user.id
      }
    };

    if (active === 'true') {
      whereClause.isActive = true;
      whereClause.expiresAt = { gt: new Date() };
      whereClause.startsAt = { lte: new Date() };
    }

    // Get deals
    const deals = await prisma.deal.findMany({
      where: whereClause,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            province: true,
            logo: true,
            cuisineType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });

    const totalCount = await prisma.deal.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        deals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          hasNext: parseInt(page) * parseInt(limit) < totalCount,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching my deals:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'MY_DEALS_FETCH_FAILED',
        message: 'Failed to fetch your deals'
      }
    });
  }
};

module.exports = {
  createDeal,
  getDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  toggleDealStatus,
  getRestaurantDeals,
  getMyDeals
};
