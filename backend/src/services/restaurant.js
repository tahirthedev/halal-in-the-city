const databaseService = require('./database');

class RestaurantService {
  constructor() {
    this.prisma = databaseService.getClient();
  }

  // Get restaurants with pagination and filtering
  async getRestaurants(filters = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      city,
      latitude,
      longitude,
      radius = 10
    } = filters;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50); // Max 50 items per page

    // Build where clause
    const where = {
      isActive: true
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cuisineType: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    // Get restaurants
    const restaurants = await this.prisma.restaurant.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        cuisineType: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        phone: true,
        email: true,
        website: true,
        isActive: true,
        averageRating: true,
        totalReviews: true,
        subscriptionTier: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        deals: {
          where: {
            isActive: true,
            expiresAt: { gt: new Date() }
          },
          select: {
            id: true,
            title: true,
            discountType: true,
            discountValue: true
          }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate distance if coordinates provided
    if (latitude && longitude) {
      restaurants.forEach(restaurant => {
        if (restaurant.latitude && restaurant.longitude) {
          restaurant.distance = this.calculateDistance(
            latitude, longitude,
            restaurant.latitude, restaurant.longitude
          );
        }
      });

      // Sort by distance
      restaurants.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    // Get total count
    const total = await this.prisma.restaurant.count({ where });

    return {
      restaurants: restaurants.map(restaurant => ({
        ...restaurant,
        currentDeals: restaurant.deals.length,
        deals: undefined // Remove deals from response, only include count
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(take),
        total,
        pages: Math.ceil(total / take)
      }
    };
  }

  // Get restaurant by ID
  async getRestaurantById(id) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        deals: {
          where: {
            isActive: true,
            expiresAt: { gt: new Date() }
          },
          select: {
            id: true,
            title: true,
            description: true,
            discountType: true,
            discountValue: true,
            maxUses: true,
            usedCount: true,
            remainingUses: true,
            expiresAt: true
          }
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!restaurant) {
      throw new Error('RESTAURANT_NOT_FOUND');
    }

    return {
      ...restaurant,
      activeDeals: restaurant.deals
    };
  }

  // Create new restaurant
  async createRestaurant(restaurantData, ownerId) {
    // Generate coordinates from address (in production, use geocoding service)
    const coordinates = await this.geocodeAddress(restaurantData.address, restaurantData.city);

    const restaurant = await this.prisma.restaurant.create({
      data: {
        ...restaurantData,
        ownerId,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        isActive: true,
        averageRating: 0,
        totalReviews: 0
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        subscriptionTier: true,
        isActive: true,
        createdAt: true
      }
    });

    return restaurant;
  }

  // Update restaurant
  async updateRestaurant(id, updateData, userId, userRole) {
    // Check if restaurant exists
    const existingRestaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { ownerId: true }
    });

    if (!existingRestaurant) {
      throw new Error('RESTAURANT_NOT_FOUND');
    }

    // Check permissions
    if (userRole !== 'ADMIN' && existingRestaurant.ownerId !== userId) {
      throw new Error('FORBIDDEN');
    }

    // Update coordinates if address changed
    if (updateData.address || updateData.city) {
      const coordinates = await this.geocodeAddress(
        updateData.address || existingRestaurant.address,
        updateData.city || existingRestaurant.city
      );
      updateData.latitude = coordinates.latitude;
      updateData.longitude = coordinates.longitude;
    }

    const restaurant = await this.prisma.restaurant.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        updatedAt: true
      }
    });

    return restaurant;
  }

  // Delete/deactivate restaurant
  async deleteRestaurant(id, userId, userRole) {
    // Check if restaurant exists
    const existingRestaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { ownerId: true }
    });

    if (!existingRestaurant) {
      throw new Error('RESTAURANT_NOT_FOUND');
    }

    // Check permissions
    if (userRole !== 'ADMIN' && existingRestaurant.ownerId !== userId) {
      throw new Error('FORBIDDEN');
    }

    // Soft delete by setting isActive to false
    await this.prisma.restaurant.update({
      where: { id },
      data: { isActive: false }
    });

    return true;
  }

  // Get restaurants by owner
  async getRestaurantsByOwner(ownerId) {
    const restaurants = await this.prisma.restaurant.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        city: true,
        isActive: true,
        subscriptionTier: true,
        createdAt: true,
        deals: {
          where: { isActive: true },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return restaurants.map(restaurant => ({
      ...restaurant,
      activeDealsCount: restaurant.deals.length,
      deals: undefined
    }));
  }

  // Helper: Calculate distance between two coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Helper: Geocode address (mock implementation)
  async geocodeAddress(address, city) {
    // In production, use Google Maps Geocoding API or similar
    // For now, return Toronto coordinates with some random variation
    const torontoLat = 43.6532;
    const torontoLng = -79.3832;
    
    return {
      latitude: torontoLat + (Math.random() - 0.5) * 0.1,
      longitude: torontoLng + (Math.random() - 0.5) * 0.1
    };
  }
}

module.exports = new RestaurantService();
