/**
 * API Service for Merchant Dashboard
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get authentication token from localStorage
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Set authentication token in localStorage
   */
  setToken(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Remove authentication token
   */
  removeToken() {
    localStorage.removeItem('token');
  }

  /**
   * Make an HTTP request
   */
  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Log full error details for debugging
        console.error('API Error Response:', data);
        
        // Create detailed error message with status code
        let errorMessage = data.error?.message || data.message || 'Request failed';
        
        // Add validation details if available
        if (data.error?.details) {
          const validationErrors = Object.entries(data.error.details)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          errorMessage += ` - ${validationErrors}`;
        }
        
        // Include status code in error message for proper handling
        throw new Error(`${response.status}: ${errorMessage}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // ==================== AUTH ENDPOINTS ====================

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store the access token
    if (data.data?.tokens?.accessToken) {
      this.setToken(data.data.tokens.accessToken);
    }
    
    return data;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    const data = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.removeToken();
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ==================== RESTAURANT ENDPOINTS ====================

  async getMyRestaurants() {
    return this.request('/restaurants/my');
  }

  async getRestaurantById(id) {
    return this.request(`/restaurants/${id}`);
  }

  async createRestaurant(restaurantData) {
    return this.request('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    });
  }

  async updateRestaurant(id, restaurantData) {
    return this.request(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(restaurantData),
    });
  }

  async deleteRestaurant(id) {
    return this.request(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== DEAL ENDPOINTS ====================

  async getMyDeals() {
    return this.request('/deals/my');
  }

  async getDealById(id) {
    return this.request(`/deals/${id}`);
  }

  async getRestaurantDeals(restaurantId) {
    return this.request(`/deals/restaurant/${restaurantId}`);
  }

  async createDeal(dealData) {
    return this.request('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  }

  async updateDeal(id, dealData) {
    return this.request(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dealData),
    });
  }

  async toggleDealStatus(id, isActive) {
    return this.request(`/deals/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async deleteDeal(id) {
    return this.request(`/deals/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== NOTIFICATION ENDPOINTS ====================

  async getNotifications(unreadOnly = false) {
    const query = unreadOnly ? '?unreadOnly=true' : '';
    return this.request(`/notifications${query}`);
  }

  async getNotificationCount() {
    return this.request('/notifications/count');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH',
    });
  }

  // ==================== SUBSCRIPTION ENDPOINTS ====================

  async getSubscriptionTiers() {
    return this.request('/subscriptions/tiers');
  }

  async getTierInfo(tier) {
    return this.request(`/subscriptions/tiers/${tier}`);
  }

  async createUpgradeCheckout(email, targetTier = 'GROWTH') {
    // Call the landing page's Stripe checkout API
    const LANDING_API = 'http://localhost:3000/api'; // Update this to your landing page URL
    
    // Map tier to Stripe price IDs (these should match your Stripe products)
    const tierPriceIds = {
      'STARTER': 'price_1SOJAICxxJUWv23VYVexmRYV', // $49/month
      'GROWTH': 'price_1SOJAICxxJUWv23VYVexmRYV', // $99/month (update with correct price ID)
    };

    const response = await fetch(`${LANDING_API}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: tierPriceIds[targetTier],
        planName: targetTier === 'GROWTH' ? 'Professional' : 'Starter',
        email: email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  }

  // ==================== REDEMPTION ENDPOINTS ====================

  async getMyRedemptions() {
    return this.request('/redemptions');
  }

  async getRestaurantRedemptions(restaurantId) {
    return this.request(`/redemptions/restaurant/${restaurantId}`);
  }

  async redeemDeal(dealId, code, orderAmount) {
    return this.request('/redemptions/redeem', {
      method: 'POST',
      body: JSON.stringify({
        dealId,
        code,
        orderAmount
      }),
    });
  }

  async validateRedemption(dealId, code) {
    return this.request('/redemptions/validate', {
      method: 'POST',
      body: JSON.stringify({
        dealId,
        code
      }),
    });
  }

  async verifyCode(verificationCode, orderAmount = 0) {
    return this.request('/redemptions/verify-code', {
      method: 'POST',
      body: JSON.stringify({
        verificationCode,
        orderAmount
      }),
    });
  }
}

export default new ApiService();
