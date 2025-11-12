/// App-wide constants
class AppConstants {
  // API Configuration
  static const String apiBaseUrl =
      'http://localhost:3000/api/v1'; // For web/Chrome
  // For Android emulator: 'http://10.0.2.2:3000/api/v1'
  // For physical device: 'http://192.168.x.x:3000/api/v1' (your computer's IP)

  // App Information
  static const String appName = 'Halal in the City';
  static const String appVersion = '1.0.0';

  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String deviceTokenKey = 'device_token';

  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Pagination
  static const int dealsPerPage = 20;

  // Validation
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 50;

  // Map Configuration
  static const double defaultLatitude = 24.8607; // Karachi
  static const double defaultLongitude = 67.0011;
  static const double defaultZoom = 12.0;
}

/// API Endpoints
class ApiEndpoints {
  // Auth
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String me = '/auth/me';

  // Deals
  static const String deals = '/deals';
  static String dealById(String id) => '/deals/$id';

  // Redemptions
  static const String redemptions = '/redemptions';
  static const String myRedemptions = '/redemptions/my';
  static String redeemDeal(String dealId) => '/redemptions/redeem/$dealId';

  // Restaurants
  static const String restaurants = '/restaurants';
  static String restaurantById(String id) => '/restaurants/$id';

  // Notifications
  static const String notifications = '/notifications';
  static const String notificationCount = '/notifications/count';
  static String markAsRead(String id) => '/notifications/$id/read';
  static const String markAllAsRead = '/notifications/read-all';
}
