const { PrismaClient } = require('@prisma/client');
const {
  notifyRestaurantOwner,
  notifyAdmins,
} = require('../services/notification');

const prisma = new PrismaClient();

/**
 * Get all pending restaurants
 * GET /api/admin/restaurants/pending
 */
const getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { approvalStatus: 'PENDING' },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error('Error getting pending restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending restaurants',
    });
  }
};

/**
 * Get all restaurants (with filter options)
 * GET /api/admin/restaurants
 */
const getAllRestaurants = async (req, res) => {
  try {
    const { status, approvalStatus } = req.query;
    const where = {};

    if (status) where.isActive = status === 'active';
    if (approvalStatus) where.approvalStatus = approvalStatus.toUpperCase();

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        subscription: true,
        _count: {
          select: { deals: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error('Error getting restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restaurants',
    });
  }
};

/**
 * Approve a restaurant
 * PATCH /api/admin/restaurants/:id/approve
 */
const approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        approvalStatus: 'APPROVED',
        approvedBy: adminId,
        approvedAt: new Date(),
        isActive: true,
      },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Send notification to restaurant owner
    await notifyRestaurantOwner(
      id,
      'RESTAURANT_APPROVAL',
      'Restaurant Approved! 🎉',
      `Your restaurant "${restaurant.name}" has been approved and is now live on Halal in the City!`,
      { restaurantId: id, restaurantName: restaurant.name }
    );

    res.json({
      success: true,
      message: 'Restaurant approved successfully',
      data: restaurant,
    });
  } catch (error) {
    console.error('Error approving restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve restaurant',
    });
  }
};

/**
 * Reject a restaurant
 * PATCH /api/admin/restaurants/:id/reject
 */
const rejectRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        approvalStatus: 'REJECTED',
        rejectionReason: reason,
        isActive: false,
      },
    });

    // Send notification to restaurant owner
    await notifyRestaurantOwner(
      id,
      'RESTAURANT_REJECTED',
      'Restaurant Application Update',
      `Your restaurant "${restaurant.name}" application needs attention. Reason: ${reason}`,
      { restaurantId: id, restaurantName: restaurant.name, reason }
    );

    res.json({
      success: true,
      message: 'Restaurant rejected',
      data: restaurant,
    });
  } catch (error) {
    console.error('Error rejecting restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject restaurant',
    });
  }
};

/**
 * Get all pending deals
 * GET /api/admin/deals/pending
 */
const getPendingDeals = async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      where: { approvalStatus: 'PENDING' },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            email: true,
            ownerId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: deals,
    });
  } catch (error) {
    console.error('Error getting pending deals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending deals',
    });
  }
};

/**
 * Get all deals (with filter options)
 * GET /api/admin/deals
 */
const getAllDeals = async (req, res) => {
  try {
    const { status, approvalStatus } = req.query;
    const where = {};

    if (status) where.status = status.toUpperCase();
    if (approvalStatus) where.approvalStatus = approvalStatus.toUpperCase();

    const deals = await prisma.deal.findMany({
      where,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
          },
        },
        _count: {
          select: { redemptions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: deals,
    });
  } catch (error) {
    console.error('Error getting deals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get deals',
    });
  }
};

/**
 * Approve a deal
 * PATCH /api/admin/deals/:id/approve
 */
const approveDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const deal = await prisma.deal.update({
      where: { id },
      data: {
        approvalStatus: 'APPROVED',
        approvedBy: adminId,
        approvedAt: new Date(),
        status: 'ACTIVE',
      },
      include: {
        restaurant: true,
      },
    });

    // Send notification to restaurant owner
    await notifyRestaurantOwner(
      deal.restaurantId,
      'DEAL_APPROVED',
      'Deal Approved! 🎯',
      `Your deal "${deal.title}" has been approved and is now live!`,
      { dealId: id, dealTitle: deal.title }
    );

    res.json({
      success: true,
      message: 'Deal approved successfully',
      data: deal,
    });
  } catch (error) {
    console.error('Error approving deal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve deal',
    });
  }
};

/**
 * Reject a deal
 * PATCH /api/admin/deals/:id/reject
 */
const rejectDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const deal = await prisma.deal.update({
      where: { id },
      data: {
        approvalStatus: 'REJECTED',
        rejectionReason: reason,
        status: 'DRAFT',
      },
      include: {
        restaurant: true,
      },
    });

    // Send notification to restaurant owner
    await notifyRestaurantOwner(
      deal.restaurantId,
      'DEAL_REJECTED',
      'Deal Update Required',
      `Your deal "${deal.title}" needs attention. Reason: ${reason}`,
      { dealId: id, dealTitle: deal.title, reason }
    );

    res.json({
      success: true,
      message: 'Deal rejected',
      data: deal,
    });
  } catch (error) {
    console.error('Error rejecting deal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject deal',
    });
  }
};

/**
 * Get all users
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    const where = {};

    if (role) where.role = role.toUpperCase();
    if (status) where.isActive = status === 'active';

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            restaurants: true,
            redemptions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
    });
  }
};

/**
 * Toggle user active status
 * PATCH /api/admin/users/:id/toggle-status
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Cannot deactivate admin users',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    res.json({
      success: true,
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status',
    });
  }
};

/**
 * Get admin dashboard statistics
 * GET /api/admin/stats
 */
const getStats = async (req, res) => {
  try {
    // Basic counts
    const [
      totalRestaurants,
      pendingRestaurants,
      activeRestaurants,
      totalDeals,
      pendingDeals,
      activeDeals,
      totalUsers,
      totalRedemptions,
    ] = await Promise.all([
      prisma.restaurant.count(),
      prisma.restaurant.count({ where: { approvalStatus: 'PENDING' } }),
      prisma.restaurant.count({ where: { isActive: true, approvalStatus: 'APPROVED' } }),
      prisma.deal.count(),
      prisma.deal.count({ where: { approvalStatus: 'PENDING' } }),
      prisma.deal.count({ where: { status: 'ACTIVE', approvalStatus: 'APPROVED' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.redemption.count(),
    ]);

    // Aggregate views and visits from deals
    const viewsResult = await prisma.deal.aggregate({ _sum: { viewCount: true } });
    const visitsResult = await prisma.deal.aggregate({ _sum: { usedCount: true } });
    const totalViews = viewsResult._sum.viewCount || 0;
    const totalVisits = visitsResult._sum.usedCount || 0;

    // New users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLast7 = await prisma.user.count({ where: { role: 'USER', createdAt: { gte: sevenDaysAgo } } });

    // Active users (isActive true)
    const activeUsers = await prisma.user.count({ where: { role: 'USER', isActive: true } });

    res.json({
      success: true,
      data: {
        restaurants: {
          total: totalRestaurants,
          pending: pendingRestaurants,
          active: activeRestaurants,
        },
        deals: {
          total: totalDeals,
          pending: pendingDeals,
          active: activeDeals,
        },
        users: {
          total: totalUsers,
          newLast7Days: newUsersLast7,
          active: activeUsers,
        },
        redemptions: {
          total: totalRedemptions,
        },
        metrics: {
          views: totalViews,
          visits: totalVisits,
        },
      },
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
    });
  }
};

/**
 * Create restaurant with owner account
 * POST /api/admin/restaurants/create-with-owner
 */
const createRestaurantWithOwner = async (req, res) => {
  try {
    const {
      restaurantName,
      cuisine,
      description,
      website,
      phone,
      address,
      city,
      postalCode,
      province,
      ownerName,
      ownerEmail,
    } = req.body;

    // Generate a random password
    const generatePassword = () => {
      const length = 12;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    };

    const temporaryPassword = generatePassword();

    // Hash the password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Split owner name
    const nameParts = ownerName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Create user and restaurant in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check if user already exists
      const existingUser = await tx.user.findUnique({
        where: { email: ownerEmail },
      });

      let owner;
      if (existingUser) {
        // Update existing user to restaurant owner role
        owner = await tx.user.update({
          where: { email: ownerEmail },
          data: {
            role: 'RESTAURANT_OWNER',
            firstName,
            lastName,
            phone,
          },
        });
      } else {
        // Create new user
        owner = await tx.user.create({
          data: {
            email: ownerEmail,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            role: 'RESTAURANT_OWNER',
            isActive: true,
          },
        });
      }

      // Create restaurant
      const restaurant = await tx.restaurant.create({
        data: {
          name: restaurantName,
          email: ownerEmail,
          cuisineType: cuisine,
          description: description || '',
          website: website || '',
          phone,
          address,
          city,
          postalCode: postalCode || '00000', // Default if not provided
          province: province || '',
          ownerId: owner.id,
          approvalStatus: 'APPROVED', // Auto-approve when admin creates
          isActive: true,
        },
      });

      return { owner, restaurant };
    });

    // TODO: Send email with credentials
    // For now, we'll return the password in the response
    // In production, you should send this via email using a service like SendGrid or AWS SES

    console.log(`New restaurant owner created:
Email: ${ownerEmail}
Temporary Password: ${temporaryPassword}
Restaurant: ${restaurantName}`);

    res.status(201).json({
      success: true,
      message: 'Restaurant and owner account created successfully',
      data: {
        restaurant: result.restaurant,
        owner: {
          id: result.owner.id,
          email: result.owner.email,
          name: `${result.owner.firstName} ${result.owner.lastName}`,
        },
        temporaryPassword, // Remove this in production and send via email
      },
    });
  } catch (error) {
    console.error('Error creating restaurant with owner:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create restaurant with owner',
    });
  }
};

module.exports = {
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
};
