import 'package:hive_flutter/hive_flutter.dart';
import '../config/constants.dart';

/// Local storage service using Hive
class StorageService {
  static late Box _box;

  /// Initialize Hive storage
  static Future<void> init() async {
    await Hive.initFlutter();
    _box = await Hive.openBox('app_storage');
  }

  /// Save authentication token
  static Future<void> saveToken(String token) async {
    await _box.put(AppConstants.tokenKey, token);
  }

  /// Get authentication token
  static String? getToken() {
    return _box.get(AppConstants.tokenKey) as String?;
  }

  /// Remove authentication token
  static Future<void> removeToken() async {
    await _box.delete(AppConstants.tokenKey);
  }

  /// Save user data
  static Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _box.put(AppConstants.userKey, userData);
  }

  /// Get user data
  static Map<String, dynamic>? getUserData() {
    final data = _box.get(AppConstants.userKey);
    if (data is Map) {
      return Map<String, dynamic>.from(data);
    }
    return null;
  }

  /// Remove user data
  static Future<void> removeUserData() async {
    await _box.delete(AppConstants.userKey);
  }

  /// Save device token for push notifications
  static Future<void> saveDeviceToken(String token) async {
    await _box.put(AppConstants.deviceTokenKey, token);
  }

  /// Get device token
  static String? getDeviceToken() {
    return _box.get(AppConstants.deviceTokenKey) as String?;
  }

  /// Clear all storage
  static Future<void> clearAll() async {
    await _box.clear();
  }

  /// Save any key-value pair
  static Future<void> save(String key, dynamic value) async {
    await _box.put(key, value);
  }

  /// Get value by key
  static dynamic get(String key) {
    return _box.get(key);
  }

  /// Remove value by key
  static Future<void> remove(String key) async {
    await _box.delete(key);
  }

  /// Check if key exists
  static bool containsKey(String key) {
    return _box.containsKey(key);
  }
}
