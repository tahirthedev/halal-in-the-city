import '../models/user.dart';
import '../config/constants.dart';
import 'api_service.dart';
import 'storage_service.dart';

/// Authentication service for user login, signup, and session management
class AuthService {
  final ApiService _api;

  AuthService(this._api);

  /// Register a new user
  Future<User> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    try {
      // Split name into first and last name
      final nameParts = name.trim().split(' ');
      final firstName = nameParts.first;
      final lastName =
          nameParts.length > 1 ? nameParts.sublist(1).join(' ') : '';

      // Build registration data
      final registrationData = {
        'email': email.trim(),
        'password': password,
        'firstName': firstName,
        'lastName': lastName.isEmpty
            ? firstName
            : lastName, // Use firstName as lastName if only one name provided
        'role': 'USER', // Default role for mobile app users
      };

      // Only add phone if it's not empty
      final trimmedPhone = phone.trim();
      if (trimmedPhone.isNotEmpty) {
        registrationData['phone'] = trimmedPhone;
      }

      final response = await _api.post(
        ApiEndpoints.register,
        data: registrationData,
      );

      print('Registration response: ${response.data}');

      // Extract user and token from response
      final data = response.data['data'];
      print('Data object: $data');
      print('User object: ${data['user']}');
      print('Tokens object: ${data['tokens']}');

      final user = User.fromJson(data['user']);
      final token = data['tokens']['accessToken']?.toString() ?? '';

      // Save token and user data
      await StorageService.saveToken(token);
      await StorageService.saveUserData(user.toJson());
      _api.setAuthToken(token);

      return user;
    } catch (e) {
      throw 'Registration failed: $e';
    }
  }

  /// Login with email and password
  Future<User> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _api.post(
        ApiEndpoints.login,
        data: {
          'email': email.trim(),
          'password': password,
        },
      );

      print('Login response: ${response.data}');

      // Extract user and token from response
      final data = response.data['data'];
      print('Data object: $data');
      print('User object: ${data['user']}');
      print('Tokens object: ${data['tokens']}');

      final user = User.fromJson(data['user']);
      final token = data['tokens']['accessToken']?.toString() ?? '';

      // Save token and user data
      await StorageService.saveToken(token);
      await StorageService.saveUserData(user.toJson());
      _api.setAuthToken(token);

      return user;
    } catch (e) {
      throw 'Login failed: $e';
    }
  }

  /// Logout current user
  Future<void> logout() async {
    try {
      // Call logout API endpoint
      await _api.post(ApiEndpoints.logout);
    } catch (e) {
      print('Logout API call failed: $e');
    } finally {
      // Clear local storage regardless of API call result
      await StorageService.removeToken();
      await StorageService.removeUserData();
      _api.clearAuthToken();
    }
  }

  /// Get current authenticated user
  Future<User?> getCurrentUser() async {
    try {
      // Check if token exists
      final token = StorageService.getToken();
      if (token == null) {
        return null;
      }

      // Set token in API service
      _api.setAuthToken(token);

      // Try to get user from local storage first
      final userData = StorageService.getUserData();
      if (userData != null) {
        return User.fromJson(userData);
      }

      // If not in storage, fetch from API
      final response = await _api.get(ApiEndpoints.me);
      final user = User.fromJson(response.data['data']);

      // Save to storage
      await StorageService.saveUserData(user.toJson());

      return user;
    } catch (e) {
      print('Failed to get current user: $e');
      // If token is invalid, clear it
      await logout();
      return null;
    }
  }

  /// Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = StorageService.getToken();
    if (token == null) {
      return false;
    }

    // Verify token is still valid
    final user = await getCurrentUser();
    return user != null;
  }

  /// Refresh user data from server
  Future<User?> refreshUser() async {
    try {
      final response = await _api.get(ApiEndpoints.me);
      final user = User.fromJson(response.data['data']);

      // Update storage
      await StorageService.saveUserData(user.toJson());

      return user;
    } catch (e) {
      print('Failed to refresh user data: $e');
      return null;
    }
  }
}
