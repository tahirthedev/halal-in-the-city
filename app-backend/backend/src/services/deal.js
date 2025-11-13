const databaseService = require('./database');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

class DealService {
  constructor() {
    this.prisma = databaseService.getClient();
  }

  // Get deals with pagination and filtering
  async getDeals(filters = {}) {
    const {
      page = 1,
      limit = 10,
      restaurantId,
      city,
      latitude,
      longitude,
      radius = 10,
      discountType,
      search
    } = filters;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    // Build where clause
    const where = {
      isActive: true,
      expiresAt: { gt: new Date() }
    };

    if (restaurantId) {
      where.restaurantId = restaurantId;
    }

    if (discountType) {
      where.discountType = discountType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add city filter through restaurant
    if (city) {
      where.restaurant = {
        city: { contains: city, mode: 'insensitive' }
      };
    }

    const deals = await this.prisma.deal.findMany({
      where,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            city: true,
            logo: true,
            latitude: true,
            longitude: true
          }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate distance and remaining uses
    const processedDeals = deals.map(deal => {
      let distance = null;
      if (latitude && longitude && deal.restaurant.latitude && deal.restaurant.longitude) {
        distance = this.calculateDistance(
          latitude, longitude,
          deal.restaurant.latitude, deal.restaurant.longitude
        );
      }

      return {
        ...deal,
        remainingUses: deal.maxUses - deal.usedCount,
        restaurant: {
          ...deal.restaurant,
          distance
        }
      };
    });

    // Sort by distance if coordinates provided
    if (latitude && longitude) {
      processedDeals.sort((a, b) => 
        (a.restaurant.distance || Infinity) - (b.restaurant.distance || Infinity)
      );
    }

    const total = await this.prisma.deal.count({ where });

    return {
      deals: processedDeals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(take),
        total,
        pages: Math.ceil(total / take)
      }
    };
  }

  // Get deal by ID
  async getDealById(id) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            phone: true,
            logo: true,
            hours: true
          }
        }
      }
    });

    if (!deal) {
      throw new Error('DEAL_NOT_FOUND');
    }

    return {
      ...deal,
      remainingUses: deal.maxUses - deal.usedCount
    };
  }

  // Create new deal
  async createDeal(dealData, userId, userRole) {
    // Check restaurant ownership
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dealData.restaurantId },
      select: { ownerId: true, subscriptionTier: true }
    });

    if (!restaurant) {
      throw new Error('RESTAURANT_NOT_FOUND');
    }

    if (userRole !== 'ADMIN' && restaurant.ownerId !== userId) {
      throw new Error('FORBIDDEN');
    }

    // Check subscription limits
    const activeDealCount = await this.prisma.deal.count({
      where: {
        restaurantId: dealData.restaurantId,
        isActive: true,
        expiresAt: { gt: new Date() }
      }
    });

    const maxDeals = this.getMaxDealsForTier(restaurant.subscriptionTier);
    if (activeDealCount >= maxDeals) {
      throw new Error('DEAL_LIMIT_REACHED');
    }

    // Generate unique code
    const code = this.generateDealCode();
    
    // Generate QR code
    const qrCode = await this.generateQRCode(code);

    const deal = await this.prisma.deal.create({
      data: {
        ...dealData,
        code,
        qrCode,
        usedCount: 0,
        remainingUses: dealData.maxUses,
        isActive: true
      },
      select: {
        id: true,
        title: true,
        code: true,
        qrCode: true,
        images: true,
        isActive: true,
        createdAt: true
      }
    });

    return deal;
  }

  // Update deal
  async updateDeal(id, updateData, userId, userRole) {
    const existingDeal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: { ownerId: true }
        }
      }
    });

    if (!existingDeal) {
      throw new Error('DEAL_NOT_FOUND');
    }

    if (userRole !== 'ADMIN' && existingDeal.restaurant.ownerId !== userId) {
      throw new Error('FORBIDDEN');
    }

    const deal = await this.prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            city: true,
            logo: true
          }
        }
      }
    });

    return deal;
  }

  // Delete/deactivate deal
  async deleteDeal(id, userId, userRole) {
    const existingDeal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: { ownerId: true }
        }
      }
    });

    if (!existingDeal) {
      throw new Error('DEAL_NOT_FOUND');
    }

    if (userRole !== 'ADMIN' && existingDeal.restaurant.ownerId !== userId) {
      throw new Error('FORBIDDEN');
    }

    await this.prisma.deal.update({
      where: { id },
      data: { isActive: false }
    });

    return true;
  }

  // Helper methods
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  generateDealCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async generateQRCode(code) {
    try {
      return await QRCode.toDataURL(code);
    } catch (error) {
      console.error('QR code generation failed:', error);
      return null;
    }
  }

  getMaxDealsForTier(tier) {
    const limits = {
      'BRONZE': 2,
      'SILVER': 5,
      'GOLD': 10,
      'DIAMOND': 20
    };
    return limits[tier] || 2;
  }
}

module.exports = new DealService();
