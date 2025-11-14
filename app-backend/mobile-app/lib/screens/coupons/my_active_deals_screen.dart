import 'package:flutter/material.dart';
import '../../services/storage_service.dart';
import '../deals/deal_detail_screen.dart';

class MyActiveDealsScreen extends StatefulWidget {
  const MyActiveDealsScreen({super.key});

  @override
  State<MyActiveDealsScreen> createState() => _MyActiveDealsScreenState();
}

class _MyActiveDealsScreenState extends State<MyActiveDealsScreen> {
  List<dynamic> _activeRedemptions = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadActiveRedemptions();
  }

  Future<void> _loadActiveRedemptions() async {
    setState(() => _isLoading = true);

    try {
      // Load active redemptions from local storage
      final redemptions = StorageService.get('active_redemptions');

      if (redemptions != null && redemptions is List) {
        setState(() {
          _activeRedemptions = List.from(redemptions);
          _isLoading = false;
        });
        print('Loaded ${_activeRedemptions.length} active redemptions');
        if (_activeRedemptions.isNotEmpty) {
          print('First redemption: ${_activeRedemptions[0]}');
        }
      } else {
        setState(() {
          _activeRedemptions = [];
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading active redemptions: $e');
      setState(() => _isLoading = false);
    }
  }

  String _getTimeRemaining(String? createdAt) {
    if (createdAt == null) return 'Unknown';

    try {
      final activationDate = DateTime.parse(createdAt);
      final expiryDate = activationDate.add(const Duration(hours: 24));
      final now = DateTime.now();
      final difference = expiryDate.difference(now);

      if (difference.isNegative) {
        return 'Expired';
      } else if (difference.inHours > 0) {
        return '${difference.inHours}h ${difference.inMinutes % 60}m left';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes}m left';
      } else {
        return 'Expires soon';
      }
    } catch (e) {
      return 'Unknown';
    }
  }

  Widget _buildImage(String imageUrl, double size) {
    // Handle both full URLs and relative paths
    final String fullImageUrl = imageUrl.startsWith('http')
        ? imageUrl
        : 'http://localhost:3000$imageUrl';

    return Image.network(
      fullImageUrl,
      width: size,
      height: size,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) {
        return Icon(
          Icons.fastfood,
          size: size / 2,
          color: Colors.grey[400],
        );
      },
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return Center(
          child: CircularProgressIndicator(
            strokeWidth: 2,
            value: loadingProgress.expectedTotalBytes != null
                ? loadingProgress.cumulativeBytesLoaded /
                    loadingProgress.expectedTotalBytes!
                : null,
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'My Active Deals',
          style: TextStyle(
            color: Colors.black,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _activeRedemptions.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.local_offer_outlined,
                        size: 80,
                        color: Colors.grey[300],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No active deals yet',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Activated deals will appear here',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[400],
                        ),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadActiveRedemptions,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _activeRedemptions.length,
                    itemBuilder: (context, index) {
                      final redemption = _activeRedemptions[index];
                      final deal = redemption['deal'] ?? {};
                      final restaurant = deal['restaurant'] ?? {};
                      final verificationCode =
                          redemption['verificationCode'] ?? 'N/A';
                      final dealImage = (deal['images'] != null &&
                              deal['images'] is List &&
                              (deal['images'] as List).isNotEmpty)
                          ? deal['images'][0]
                          : null;
                      final timeRemaining =
                          _getTimeRemaining(redemption['createdAt']);
                      final isExpired = timeRemaining == 'Expired';

                      print(
                          'Deal ${index + 1}: ${deal['title']}, Restaurant: ${restaurant['name']}, Image: $dealImage');

                      return GestureDetector(
                        onTap: () {
                          if (deal['id'] != null) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => DealDetailScreen(
                                  dealId: deal['id'],
                                ),
                              ),
                            );
                          }
                        },
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isExpired
                                  ? Colors.red[200]!
                                  : Colors.grey[200]!,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.grey.withOpacity(0.1),
                                spreadRadius: 1,
                                blurRadius: 3,
                                offset: const Offset(0, 1),
                              ),
                            ],
                          ),
                          child: Row(
                            children: [
                              // Deal Image
                              Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  color: Colors.grey[200],
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: dealImage != null
                                      ? _buildImage(dealImage, 60)
                                      : Icon(
                                          Icons.fastfood,
                                          size: 30,
                                          color: Colors.grey[400],
                                        ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              // Deal Info
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      deal['title'] ?? 'Deal',
                                      style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      restaurant['name'] ?? 'Restaurant',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 6),
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.access_time,
                                          size: 12,
                                          color: isExpired
                                              ? Colors.red
                                              : Colors.grey[500],
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          timeRemaining,
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: isExpired
                                                ? Colors.red
                                                : Colors.grey[600],
                                            fontWeight: isExpired
                                                ? FontWeight.bold
                                                : FontWeight.normal,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 12),
                              // Verification Code
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: isExpired
                                      ? Colors.grey.withOpacity(0.1)
                                      : const Color(0xFFB8860B)
                                          .withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: isExpired
                                        ? Colors.grey
                                        : const Color(0xFFB8860B),
                                    width: 1,
                                  ),
                                ),
                                child: Text(
                                  verificationCode,
                                  style: TextStyle(
                                    color: isExpired
                                        ? Colors.grey
                                        : const Color(0xFFB8860B),
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 2,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              // Arrow Icon
                              Icon(
                                Icons.arrow_forward_ios,
                                size: 16,
                                color: Colors.grey[400],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
