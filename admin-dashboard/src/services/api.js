/**
 * API Service for Admin Dashboard
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
        throw new Error(data.error?.message || data.message || 'Request failed');
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

  // ==================== ADMIN ENDPOINTS ====================

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAllRestaurants(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/admin/restaurants${query ? `?${query}` : ''}`);
  }

  async getPendingRestaurants() {
    return this.request('/admin/restaurants/pending');
  }

  async approveRestaurant(id) {
    return this.request(`/admin/restaurants/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectRestaurant(id, reason) {
    return this.request(`/admin/restaurants/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }

  async getAllDeals(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/admin/deals${query ? `?${query}` : ''}`);
  }

  async getPendingDeals() {
    return this.request('/admin/deals/pending');
  }

  async approveDeal(id) {
    return this.request(`/admin/deals/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectDeal(id, reason) {
    return this.request(`/admin/deals/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }

  async getAllUsers(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }

  async toggleUserStatus(id) {
    return this.request(`/admin/users/${id}/toggle-status`, {
      method: 'PATCH',
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

  // ==================== RESTAURANT ENDPOINTS ====================

  async getRestaurants(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/restaurants${query ? `?${query}` : ''}`);
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

  async createRestaurantWithOwner(data) {
    return this.request('/admin/restaurants/create-with-owner', {
      method: 'POST',
      body: JSON.stringify(data),
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

  // ==================== SUBSCRIPTION ENDPOINTS ====================

  async getSubscriptionTiers() {
    return this.request('/subscriptions/tiers');
  }

  async getTierInfo(tier) {
    return this.request(`/subscriptions/tiers/${tier}`);
  }
}

export default new ApiService();
