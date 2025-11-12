import 'api_service.dart';

/// Service for restaurant-related API calls
class RestaurantService {
  final ApiService _apiService;

  RestaurantService(this._apiService);

  /// Get all restaurants
  Future<List<dynamic>> getAllRestaurants({
    String? search,
    String? category,
    double? latitude,
    double? longitude,
    int? limit,
  }) async {
    try {
      final queryParams = <String, dynamic>{};

      if (search != null) queryParams['search'] = search;
      if (category != null) queryParams['category'] = category;
      if (latitude != null) queryParams['latitude'] = latitude;
      if (longitude != null) queryParams['longitude'] = longitude;
      if (limit != null) queryParams['limit'] = limit;

      final response = await _apiService.get(
        '/restaurants',
        queryParameters: queryParams,
      );

      // Backend returns: { success: true, data: { restaurants: [...] } }
      return response.data['data']['restaurants'] ?? [];
    } catch (e) {
      throw Exception('Failed to load restaurants: $e');
    }
  }

  /// Get restaurant by ID
  Future<Map<String, dynamic>> getRestaurantById(String id) async {
    try {
      final response = await _apiService.get('/restaurants/$id');
      return response.data['data']['restaurant'];
    } catch (e) {
      throw Exception('Failed to load restaurant: $e');
    }
  }

  /// Get nearest restaurants
  Future<List<dynamic>> getNearestRestaurants({
    required double latitude,
    required double longitude,
    int? limit,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'latitude': latitude,
        'longitude': longitude,
      };

      if (limit != null) queryParams['limit'] = limit;

      final response = await _apiService.get(
        '/restaurants',
        queryParameters: queryParams,
      );

      return response.data['data']['restaurants'] ?? [];
    } catch (e) {
      throw Exception('Failed to load nearest restaurants: $e');
    }
  }

  /// Get featured restaurants (with premium subscription)
  Future<List<dynamic>> getFeaturedRestaurants({int? limit}) async {
    try {
      final queryParams = <String, dynamic>{};

      if (limit != null) queryParams['limit'] = limit;

      final response = await _apiService.get(
        '/restaurants',
        queryParameters: queryParams,
      );

      // Filter for featured restaurants (with GROWTH subscription)
      final allRestaurants = response.data['data']['restaurants'] ?? [];
      return allRestaurants.where((restaurant) {
        return restaurant['subscriptionTier'] == 'GROWTH';
      }).toList();
    } catch (e) {
      throw Exception('Failed to load featured restaurants: $e');
    }
  }
}
