import 'package:flutter/material.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            children: [
              const SizedBox(height: 60),

              // Logo
              Image.asset(
                'assets/images/logo.png',
                height: 180,
                width: 180,
                errorBuilder: (context, error, stackTrace) {
                  // Fallback if logo doesn't exist
                  return Container(
                    height: 180,
                    width: 180,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Color(0xFFB8860B), Color(0xFFDAA520)],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.mosque_outlined,
                      size: 80,
                      color: Colors.white,
                    ),
                  );
                },
              ),

              const Spacer(),

              // Halal Eats & Deals Button (Black)
              _buildButton(
                context,
                text: 'Halal Eats & Deals',
                backgroundColor: Colors.black,
                textColor: Colors.white,
                onTap: () {
                  Navigator.pushReplacementNamed(context, '/home');
                },
              ),

              const SizedBox(height: 16),

              // Discounts Button (Gold)
              _buildButton(
                context,
                text: 'Discounts',
                backgroundColor: const Color(0xFFB8860B),
                textColor: Colors.white,
                onTap: () {
                  // Navigate to deals/discounts
                  Navigator.pushReplacementNamed(context, '/home');
                },
              ),

              const SizedBox(height: 16),

              // Prayer Location Button (Gold)
              _buildButton(
                context,
                text: 'Prayer Location',
                backgroundColor: const Color(0xFFB8860B),
                textColor: Colors.white,
                onTap: () {
                  // Navigate to prayer locations
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Prayer Location coming soon!')),
                  );
                },
              ),

              const SizedBox(height: 16),

              // Accessories Button (Gold)
              _buildButton(
                context,
                text: 'Accessories',
                backgroundColor: const Color(0xFFB8860B),
                textColor: Colors.white,
                onTap: () {
                  // Navigate to accessories
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Accessories coming soon!')),
                  );
                },
              ),

              const SizedBox(height: 60),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildButton(
    BuildContext context, {
    required String text,
    required Color backgroundColor,
    required Color textColor,
    required VoidCallback onTap,
  }) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: textColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
          elevation: 0,
        ),
        child: Text(
          text,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
