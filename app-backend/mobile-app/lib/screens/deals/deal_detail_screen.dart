import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import '../../services/api_service.dart';
import '../../services/deal_service.dart';
import '../../services/restaurant_service.dart';
import 'deal_redemption_screen.dart';

class DealDetailScreen extends StatefulWidget {
  final String dealId;

  const DealDetailScreen({
    super.key,
    required this.dealId,
  });

  @override
  State<DealDetailScreen> createState() => _DealDetailScreenState();
}

class _DealDetailScreenState extends State<DealDetailScreen> {
  late final DealService _dealService;
  late final RestaurantService _restaurantService;

  Map<String, dynamic>? _deal;
  Map<String, dynamic>? _restaurant;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    final apiService = ApiService();
    _dealService = DealService(apiService);
    _restaurantService = RestaurantService(apiService);
    _loadDealDetails();
  }

  Future<void> _loadDealDetails() async {
    setState(() => _isLoading = true);

    try {
      print('🎯 Loading deal details for ${widget.dealId}...');

      // Load deal first
      final deal = await _dealService.getDealById(widget.dealId);

      // Then load restaurant
      Map<String, dynamic>? restaurant;
      if (deal['restaurantId'] != null) {
        try {
          restaurant =
              await _restaurantService.getRestaurantById(deal['restaurantId']);
        } catch (e) {
          print('⚠️ Could not load restaurant: $e');
        }
      }

      setState(() {
        _deal = deal;
        _restaurant = restaurant;
        _isLoading = false;
      });

      print('✅ Loaded deal: ${_deal?['title']}');
    } catch (e) {
      print('❌ Error loading deal details: $e');
      setState(() => _isLoading = false);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load deal details: $e')),
        );
      }
    }
  }

  void _handleStealNow() {
    if (_deal == null) return;

    // Navigate to redemption screen with QR code
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DealRedemptionScreen(
          dealId: widget.dealId,
          dealTitle: _deal!['title'] ?? 'Deal',
          restaurantName: _restaurant?['name'] ?? 'Restaurant',
        ),
      ),
    );
  }

  void _handleShare() {
    if (_deal == null) return;

    final text =
        '${_deal!['title']} at ${_restaurant?['name'] ?? 'Restaurant'}\n'
        '${_deal!['description'] ?? ''}\n\n'
        'Check out this deal on Halal in the City!';

    Share.share(text);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFB8860B)),
          ),
        ),
      );
    }

    if (_deal == null) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Color(0xFFB8860B),
          elevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 64, color: Colors.grey),
              SizedBox(height: 16),
              Text(
                'Deal not found',
                style: TextStyle(fontSize: 18, color: Colors.grey),
              ),
            ],
          ),
        ),
      );
    }

    final discountType = _deal!['discountType'] ?? 'PERCENTAGE';
    final discountValue = _deal!['discountValue'] ?? 0;
    final title = _deal!['title'] ?? 'Special Offer';
    final description = _deal!['description'] ?? '';
    final terms =
        _deal!['terms'] ?? 'Not Valid with other offers or discounts.';
    final remainingUses =
        _deal!['totalLimit'] != null && _deal!['redeemedCount'] != null
            ? (_deal!['totalLimit'] - _deal!['redeemedCount'])
            : null;

    return Scaffold(
      backgroundColor: Color(0xFFB8860B),
      body: Column(
        children: [
          // Header with back button
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.3),
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                  Expanded(
                    child: Center(
                      child: Text(
                        title,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                  SizedBox(width: 48), // Balance the back button
                ],
              ),
            ),
          ),

          // Deal Image
          Container(
            height: 200,
            margin: EdgeInsets.symmetric(horizontal: 32),
            child: _deal!['images'] != null && _deal!['images'].isNotEmpty
                ? _buildDealImage(_deal!['images'][0])
                : _buildPlaceholderImage(),
          ),

          SizedBox(height: 16),

          // Page indicator dots
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ],
          ),

          SizedBox(height: 24),

          // White content card
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
              ),
              child: SingleChildScrollView(
                padding: EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Action icons (location, favorite)
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: Colors.black,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(Icons.location_on,
                              color: Colors.white, size: 20),
                        ),
                        SizedBox(width: 12),
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey[300]!),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(Icons.favorite_border,
                              color: Colors.black, size: 20),
                        ),
                      ],
                    ),

                    SizedBox(height: 20),

                    // Deal Title
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    SizedBox(height: 8),

                    // Restaurant Address
                    Text(
                      _restaurant?['address'] ??
                          '10153 King George Hwy Surrey BC',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),

                    SizedBox(height: 12),

                    // Rating
                    Row(
                      children: [
                        Icon(Icons.star, color: Color(0xFFB8860B), size: 18),
                        SizedBox(width: 4),
                        Text(
                          '${_restaurant?['averageRating'] ?? 4.8} Rating',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),

                    SizedBox(height: 20),

                    // Description
                    Text(
                      description.isNotEmpty
                          ? description
                          : 'Buy One burger at regular price and receive a second burger ${discountType == 'PERCENTAGE' ? '${discountValue.toInt()}% off' : '\$${discountValue} off'}',
                      style: TextStyle(
                        fontSize: 14,
                        height: 1.5,
                      ),
                    ),

                    SizedBox(height: 24),

                    // Fine Print
                    Text(
                      'Fine Print',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      terms,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[700],
                      ),
                    ),

                    SizedBox(height: 24),

                    // Share Section
                    Text(
                      'Share with Family and Friends',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 16),

                    // Social Media Icons
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildSocialIcon('facebook', Colors.blue[700]!),
                        SizedBox(width: 12),
                        _buildSocialIcon('instagram', Colors.pink[400]!),
                        SizedBox(width: 12),
                        _buildSocialIcon('twitter', Colors.blue[400]!),
                        SizedBox(width: 12),
                        _buildSocialIcon('tiktok', Colors.black),
                      ],
                    ),

                    SizedBox(height: 32),

                    // Steal it now button
                    Row(
                      children: [
                        if (remainingUses != null)
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 16, vertical: 12),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey[300]!),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              'Only $remainingUses',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        if (remainingUses != null) SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _handleStealNow,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFFB8860B),
                              foregroundColor: Colors.white,
                              padding: EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              elevation: 0,
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Steal it now',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(width: 12),
                                Container(
                                  padding: EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.3),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    Icons.qr_code,
                                    size: 20,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                    SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceholderImage() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Icon(
          Icons.fastfood,
          size: 80,
          color: Colors.white.withOpacity(0.5),
        ),
      ),
    );
  }

  Widget _buildSocialIcon(String platform, Color color) {
    IconData icon;
    switch (platform) {
      case 'facebook':
        icon = Icons.facebook;
        break;
      case 'instagram':
        icon = Icons.camera_alt;
        break;
      case 'twitter':
        icon = Icons.flutter_dash; // Using as placeholder
        break;
      case 'tiktok':
        icon = Icons.music_note;
        break;
      default:
        icon = Icons.share;
    }

    return GestureDetector(
      onTap: _handleShare,
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          color: Colors.white,
          size: 24,
        ),
      ),
    );
  }

  // Helper method to build image from base64 or URL
  Widget _buildDealImage(String? imageData) {
    if (imageData == null || imageData.isEmpty) {
      return _buildPlaceholderImage();
    }

    // Check if it's a base64 string
    if (imageData.startsWith('data:image')) {
      try {
        // Extract base64 data after the comma
        final base64String = imageData.split(',').last;
        final Uint8List bytes = base64Decode(base64String);

        return ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.memory(
            bytes,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              print('❌ Error loading base64 image: $error');
              return _buildPlaceholderImage();
            },
          ),
        );
      } catch (e) {
        print('❌ Error decoding base64 image: $e');
        return _buildPlaceholderImage();
      }
    }

    // If it's a URL, use Image.network
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Image.network(
        imageData,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          print('❌ Error loading network image: $error');
          return _buildPlaceholderImage();
        },
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return Center(
            child: CircularProgressIndicator(
              value: loadingProgress.expectedTotalBytes != null
                  ? loadingProgress.cumulativeBytesLoaded /
                      loadingProgress.expectedTotalBytes!
                  : null,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(Color(0xFFB8860B)),
            ),
          );
        },
      ),
    );
  }
}
