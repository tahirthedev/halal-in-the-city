import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'dart:async';
import '../../services/api_service.dart';
import '../../services/deal_service.dart';
import '../../services/storage_service.dart';

class DealRedemptionScreen extends StatefulWidget {
  final String dealId;
  final String dealTitle;
  final String restaurantName;
  final Map<String, dynamic>? dealData;
  final Map<String, dynamic>? restaurantData;

  const DealRedemptionScreen({
    super.key,
    required this.dealId,
    required this.dealTitle,
    required this.restaurantName,
    this.dealData,
    this.restaurantData,
  });

  @override
  State<DealRedemptionScreen> createState() => _DealRedemptionScreenState();
}

class _DealRedemptionScreenState extends State<DealRedemptionScreen> {
  late final DealService _dealService;
  String? _redemptionCode;
  bool _isGenerating = true;
  String? _error;
  int _timeRemaining = 86400; // 24 hours (24 * 60 * 60 seconds)
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _initializeService();
  }

  Future<void> _initializeService() async {
    final apiService = ApiService();

    // Get token from storage and set it
    final token = StorageService.getToken();
    if (token != null) {
      apiService.setAuthToken(token);
    }

    _dealService = DealService(apiService);
    _generateRedemptionCode();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _generateRedemptionCode() async {
    setState(() => _isGenerating = true);

    try {
      print('🎫 Generating redemption code for deal ${widget.dealId}...');

      // Call backend API to create redemption
      final redemption = await _dealService.createRedemption(widget.dealId);

      setState(() {
        _redemptionCode = redemption['verificationCode'] ?? redemption['code'];
        _isGenerating = false;
        _error = null;
      });

      // Save to local storage for "My Active Deals" screen
      _saveActiveRedemption(redemption);

      // Start countdown timer
      _startTimer();

      print('✅ Generated redemption code: $_redemptionCode');
    } catch (e) {
      print('❌ Error generating redemption code: $e');
      setState(() {
        _isGenerating = false;
        _error = e.toString().replaceAll('Exception: ', '');
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_error ?? 'Failed to generate code'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _saveActiveRedemption(Map<String, dynamic> redemption) async {
    try {
      // Get existing active redemptions
      final existing = StorageService.get('active_redemptions');
      List<dynamic> redemptions = [];

      if (existing != null && existing is List) {
        redemptions = List.from(existing);
      }

      // Create enhanced redemption with deal and restaurant data
      final enhancedRedemption = {
        ...redemption,
        'deal': widget.dealData ??
            {
              'id': widget.dealId,
              'title': widget.dealTitle,
            },
        'restaurant': widget.restaurantData ??
            {
              'name': widget.restaurantName,
            },
        'createdAt': DateTime.now().toIso8601String(),
      };

      // Add new redemption
      redemptions.add(enhancedRedemption);

      // Save back to storage
      await StorageService.save('active_redemptions', redemptions);
      print('💾 Saved redemption to local storage');
      print('📦 Redemption data: $enhancedRedemption');
    } catch (e) {
      print('❌ Error saving redemption: $e');
    }
  }

  void _startTimer() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (_timeRemaining > 0) {
        setState(() => _timeRemaining--);
      } else {
        timer.cancel();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Code expired. Please generate a new one.'),
              action: SnackBarAction(
                label: 'Refresh',
                onPressed: () {
                  setState(() {
                    _timeRemaining = 86400; // 24 hours
                    _generateRedemptionCode();
                  });
                },
              ),
            ),
          );
        }
      }
    });
  }

  String _formatTime(int seconds) {
    final hours = seconds ~/ 3600;
    final minutes = (seconds % 3600) ~/ 60;
    final secs = seconds % 60;

    if (hours > 0) {
      return '${hours}h ${minutes}m';
    } else if (minutes > 0) {
      return '${minutes}m ${secs}s';
    } else {
      return '${secs}s';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Color(0xFFB8860B),
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Redeem Deal',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: _isGenerating
          ? Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFB8860B)),
              ),
            )
          : _error != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Colors.red,
                        ),
                        SizedBox(height: 16),
                        Text(
                          _error!,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.black87,
                          ),
                        ),
                        SizedBox(height: 24),
                        ElevatedButton(
                          onPressed: () => Navigator.pop(context),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFFB8860B),
                            padding: EdgeInsets.symmetric(
                              horizontal: 32,
                              vertical: 16,
                            ),
                          ),
                          child: Text('Go Back'),
                        ),
                      ],
                    ),
                  ),
                )
              : SingleChildScrollView(
                  padding: EdgeInsets.all(24),
                  child: Column(
                    children: [
                      SizedBox(height: 20),

                      // Success Icon
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.check_circle,
                          size: 50,
                          color: Colors.green,
                        ),
                      ),

                      SizedBox(height: 24),

                      // Title
                      Text(
                        'Deal Activated!',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      SizedBox(height: 8),

                      Text(
                        widget.dealTitle,
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey[600],
                        ),
                        textAlign: TextAlign.center,
                      ),

                      SizedBox(height: 4),

                      Text(
                        widget.restaurantName,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[500],
                        ),
                      ),

                      SizedBox(height: 32),

                      // QR Code
                      Container(
                        padding: EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey[300]!),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: _redemptionCode != null
                            ? QrImageView(
                                data: '${widget.dealId}:$_redemptionCode',
                                version: QrVersions.auto,
                                size: 200.0,
                                backgroundColor: Colors.white,
                              )
                            : Container(
                                width: 200,
                                height: 200,
                                color: Colors.grey[200],
                              ),
                      ),

                      SizedBox(height: 24),

                      // 2FA Code Display
                      Container(
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Color(0xFFB8860B).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Color(0xFFB8860B).withOpacity(0.3),
                          ),
                        ),
                        child: Column(
                          children: [
                            Text(
                              'Verification Code',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            SizedBox(height: 12),
                            Text(
                              _redemptionCode ?? '------',
                              style: TextStyle(
                                fontSize: 36,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 8,
                                color: Color(0xFFB8860B),
                              ),
                            ),
                          ],
                        ),
                      ),

                      SizedBox(height: 24),

                      // Timer
                      Container(
                        padding:
                            EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        decoration: BoxDecoration(
                          color: _timeRemaining < 3600
                              ? Colors.red.withOpacity(0.1)
                              : Colors.grey[100],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.timer,
                              size: 20,
                              color: _timeRemaining < 3600
                                  ? Colors.red
                                  : Colors.grey[600],
                            ),
                            SizedBox(width: 8),
                            Text(
                              'Expires in ${_formatTime(_timeRemaining)}',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: _timeRemaining < 3600
                                    ? Colors.red
                                    : Colors.grey[700],
                              ),
                            ),
                          ],
                        ),
                      ),

                      SizedBox(height: 32),

                      // Instructions
                      Container(
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(12),
                          border:
                              Border.all(color: Colors.blue.withOpacity(0.2)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.info_outline,
                                    color: Colors.blue, size: 20),
                                SizedBox(width: 8),
                                Text(
                                  'How to Redeem',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.blue[900],
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 12),
                            _buildInstructionStep('1',
                                'Show this QR code or verification code to the merchant'),
                            SizedBox(height: 8),
                            _buildInstructionStep('2',
                                'Merchant will scan QR code or enter the 6-digit code'),
                            SizedBox(height: 8),
                            _buildInstructionStep(
                                '3', 'Enjoy your deal once verified!'),
                          ],
                        ),
                      ),

                      SizedBox(height: 24),

                      // Refresh Button
                      if (_timeRemaining < 60)
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: () {
                              setState(() {
                                _timeRemaining = 300;
                                _generateRedemptionCode();
                              });
                            },
                            icon: Icon(Icons.refresh),
                            label: Text('Generate New Code'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Color(0xFFB8860B),
                              side: BorderSide(color: Color(0xFFB8860B)),
                              padding: EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),

                      SizedBox(height: 40),
                    ],
                  ),
                ),
    );
  }

  Widget _buildInstructionStep(String number, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: Colors.blue,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              number,
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[700],
              height: 1.5,
            ),
          ),
        ),
      ],
    );
  }
}
