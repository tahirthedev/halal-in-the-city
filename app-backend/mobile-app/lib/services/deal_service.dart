import 'api_service.dart';

/// Service for deal-related API calls
class DealService {
  final ApiService _apiService;

  DealService(this._apiService);

  /// Get all deals
  Future<List<dynamic>> getAllDeals({
    String? restaurantId,
    String? category,
    bool? isActive,
    int? limit,
  }) async {
    try {
      final queryParams = <String, dynamic>{};

      if (restaurantId != null) queryParams['restaurantId'] = restaurantId;
      if (category != null) queryParams['category'] = category;
      if (isActive != null) queryParams['isActive'] = isActive;
      if (limit != null) queryParams['limit'] = limit;

      final response = await _apiService.get(
        '/deals',
        queryParameters: queryParams,
      );

      // Backend returns: { success: true, data: { deals: [...] } }
      return response.data['data']['deals'] ?? [];
    } catch (e) {
      throw Exception('Failed to load deals: $e');
    }
  }

  /// Get deal by ID
  Future<Map<String, dynamic>> getDealById(String id) async {
    try {
      final response = await _apiService.get('/deals/$id');
      return response.data['data']['deal'];
    } catch (e) {
      throw Exception('Failed to load deal: $e');
    }
  }

  /// Get deals by restaurant ID
  Future<List<dynamic>> getDealsByRestaurant(String restaurantId) async {
    try {
      final response = await _apiService.get(
        '/deals',
        queryParameters: {'restaurantId': restaurantId, 'isActive': true},
      );

      return response.data['data']['deals'] ?? [];
    } catch (e) {
      throw Exception('Failed to load restaurant deals: $e');
    }
  }

  /// Get newest deals
  Future<List<dynamic>> getNewestDeals({int? limit}) async {
    try {
      final queryParams = <String, dynamic>{
        'active': 'true',
      };

      if (limit != null) queryParams['limit'] = limit;

      final response = await _apiService.get(
        '/deals',
        queryParameters: queryParams,
      );

      return response.data['data']['deals'] ?? [];
    } catch (e) {
      throw Exception('Failed to load newest deals: $e');
    }
  }

  /// Get featured deals (from premium restaurants)
  Future<List<dynamic>> getFeaturedDeals({int? limit}) async {
    try {
      final queryParams = <String, dynamic>{
        'active': 'true',
      };

      if (limit != null) queryParams['limit'] = limit;

      final response = await _apiService.get(
        '/deals',
        queryParameters: queryParams,
      );

      // Filter for featured deals (restaurants with GROWTH subscription)
      final allDeals = response.data['data']['deals'] ?? [];
      return allDeals.where((deal) {
        final restaurant = deal['restaurant'];
        return restaurant != null && restaurant['subscriptionTier'] == 'GROWTH';
      }).toList();
    } catch (e) {
      throw Exception('Failed to load featured deals: $e');
    }
  }

  /// Create a pending redemption and generate verification code
  Future<Map<String, dynamic>> createRedemption(String dealId) async {
    try {
      final response = await _apiService.post(
        '/redemptions/generate-code',
        data: {
          'dealId': dealId,
        },
      );

      // Backend returns: { success: true, data: { redemption: {...} } }
      if (response.data['success'] == true) {
        return response.data['data']['redemption'];
      } else {
        throw Exception(response.data['error']?['message'] ??
            'Failed to create redemption');
      }
    } catch (e) {
      print('❌ Create redemption error: $e');
      // Extract error message if available
      String errorMessage = 'Failed to generate verification code';
      if (e.toString().contains('ALREADY_REDEEMED')) {
        errorMessage = 'You have already claimed this deal';
      } else if (e.toString().contains('DEAL_EXPIRED')) {
        errorMessage = 'This deal has expired';
      } else if (e.toString().contains('DEAL_EXHAUSTED')) {
        errorMessage = 'This deal is no longer available';
      }
      throw Exception(errorMessage);
    }
  }

  /// Redeem a deal
  Future<Map<String, dynamic>> redeemDeal(String dealId) async {
    try {
      final response = await _apiService.post('/redemptions/redeem/$dealId');
      return response.data;
    } catch (e) {
      throw Exception('Failed to redeem deal: $e');
    }
  }
}
