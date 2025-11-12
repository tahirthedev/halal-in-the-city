import 'package:flutter/material.dart';
import '../../services/restaurant_service.dart';
import '../../services/deal_service.dart';
import '../../services/api_service.dart';
import '../restaurants/restaurant_detail_screen.dart';
import '../deals/deal_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  String _selectedCategory = '';

  // Services
  late final RestaurantService
      _restaurantService; // TODO: Use for nearest tab with geolocation
  late final DealService _dealService;

  // Data
  List<dynamic>? _deals;
  List<dynamic>? _restaurants;
  bool _isLoading = true;
  bool _isLoadingRestaurants = true;

  @override
  void initState() {
    super.initState();
    print('🏠 HomeScreen initState called');
    _tabController = TabController(length: 3, vsync: this);

    // Initialize services
    final apiService = ApiService();
    _restaurantService = RestaurantService(apiService);
    _dealService = DealService(apiService);

    // Load initial data after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      print('⏰ PostFrameCallback executing');
      _loadDeals();
      _loadRestaurants();
    });

    // Listen to tab changes
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        _loadDeals();
      }
    });
  }

  Future<void> _loadDeals() async {
    setState(() => _isLoading = true);

    try {
      List<dynamic> deals;

      // Load deals based on selected tab
      switch (_tabController.index) {
        case 0: // Newest
          print('📊 Loading newest deals...');
          deals = await _dealService.getNewestDeals(limit: 20);
          break;
        case 1: // Featured
          print('📊 Loading featured deals...');
          deals = await _dealService.getFeaturedDeals(limit: 20);
          break;
        case 2: // Nearest
          print('📊 Loading nearest deals...');
          // TODO: Get user location and fetch nearest deals
          deals = await _dealService.getAllDeals(limit: 20);
          break;
        default:
          deals = await _dealService.getAllDeals(limit: 20);
      }

      print('✅ Loaded ${deals.length} deals');

      // Filter by category if selected
      if (_selectedCategory.isNotEmpty) {
        deals = deals.where((deal) {
          final restaurant = deal['restaurant'];
          return restaurant != null &&
              restaurant['category'] == _selectedCategory;
        }).toList();
        print(
            '🔍 Filtered to ${deals.length} deals for category: $_selectedCategory');
      }

      setState(() {
        _deals = deals;
        _isLoading = false;
      });
    } catch (e) {
      print('❌ Error loading deals: $e');
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load deals: $e')),
        );
      }
    }
  }

  Future<void> _loadRestaurants() async {
    print('🏪 _loadRestaurants called');
    setState(() => _isLoadingRestaurants = true);

    try {
      print('📊 Loading latest restaurants...');

      // Get latest restaurants (sorted by creation date)
      final restaurants = await _restaurantService.getAllRestaurants(limit: 10);

      print('✅ Loaded ${restaurants.length} restaurants');

      setState(() {
        _restaurants = restaurants;
        _isLoadingRestaurants = false;
      });
    } catch (e) {
      print('❌ Error loading restaurants: $e');
      setState(() => _isLoadingRestaurants = false);
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.white,
      drawer: _buildDrawer(),
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  // Menu Icon
                  GestureDetector(
                    onTap: () => _scaffoldKey.currentState?.openDrawer(),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey[300]!),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.menu, size: 24),
                    ),
                  ),
                  const Spacer(),
                  // Profile Icon
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: const Color(0xFFB8860B),
                    child: const Icon(
                      Icons.person,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                ],
              ),
            ),

            // Tabs
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              child: TabBar(
                controller: _tabController,
                labelColor: Colors.white,
                unselectedLabelColor: Colors.black,
                indicator: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(25),
                ),
                dividerColor: Colors.transparent,
                labelStyle: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
                tabs: const [
                  Tab(text: 'Newest'),
                  Tab(text: 'Featured'),
                  Tab(text: 'Nearest'),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const SizedBox(width: 16),
                    Icon(Icons.search, color: Colors.grey[600]),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Search',
                          hintStyle: TextStyle(color: Colors.grey[600]),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Content
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildNewestTab(),
                  _buildFeaturedTab(),
                  _buildNearestTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNewestTab() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner Carousel
          _buildBannerCarousel(),

          const SizedBox(height: 20),

          // Categories
          _buildCategories(),

          const SizedBox(height: 20),

          // Deal Cards
          _buildDealsList(),

          const SizedBox(height: 20),

          // Popular Meal Menu
          _buildPopularMealMenu(),
        ],
      ),
    );
  }

  Widget _buildFeaturedTab() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildBannerCarousel(),
          const SizedBox(height: 20),
          _buildCategories(),
          const SizedBox(height: 20),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'Featured Deals (Premium Restaurants)',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 12),
          _buildDealsList(),
        ],
      ),
    );
  }

  Widget _buildNearestTab() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildBannerCarousel(),
          const SizedBox(height: 20),
          _buildCategories(),
          const SizedBox(height: 20),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'Nearest Restaurants',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 12),
          _buildDealsList(),
        ],
      ),
    );
  }

  Widget _buildBannerCarousel() {
    return SizedBox(
      height: 160,
      child: PageView(
        children: [
          _buildBannerCard(
            title: 'Special Offer\nfor March',
            subtitle: 'We are here, with the best\ndeserts in town.',
            buttonText: 'Avail Now',
          ),
          _buildBannerCard(
            title: 'Weekend Deal\nExtra 20% Off',
            subtitle: 'Limited time offer on\nall menu items.',
            buttonText: 'Grab Now',
          ),
          _buildBannerCard(
            title: 'Family Feast\nBundle',
            subtitle: 'Perfect combo for your\nfamily gathering.',
            buttonText: 'Order Now',
          ),
        ],
      ),
    );
  }

  Widget _buildBannerCard({
    required String title,
    required String subtitle,
    required String buttonText,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFB8860B), Color(0xFFDAA520)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    height: 1.2,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 11,
                    height: 1.3,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () {
                    // Static for now
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFFB8860B),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 6,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    minimumSize: const Size(0, 32),
                  ),
                  child: Text(
                    buttonText,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // Burger image
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.asset(
              'assets/images/burger-banner.png',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.fastfood,
                    size: 50,
                    color: Colors.white,
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategories() {
    final categories = [
      {'name': 'Burger', 'icon': '🍔'},
      {'name': 'Pizza', 'icon': '🍕'},
      {'name': 'Sandwich', 'icon': '🥪'},
    ];

    return SizedBox(
      height: 80,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final category = categories[index];
          final isSelected = _selectedCategory == category['name'];

          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCategory = isSelected ? '' : category['name']!;
              });
              _loadDeals(); // Reload deals with new category filter
            },
            child: Container(
              margin: const EdgeInsets.only(right: 12),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: isSelected ? Colors.black : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? Colors.black : Colors.grey[300]!,
                ),
              ),
              child: Row(
                children: [
                  Text(
                    category['icon']!,
                    style: const TextStyle(fontSize: 24),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    category['name']!,
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.black,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildDealsList() {
    if (_isLoading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFB8860B)),
          ),
        ),
      );
    }

    if (_deals == null || _deals!.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Text(
            'No deals available',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
        ),
      );
    }

    // Display deals in a grid
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: _deals!.length,
        itemBuilder: (context, index) {
          final deal = _deals![index];
          final restaurant = deal['restaurant'] ?? {};

          return _buildDealCard(
            deal['title'] ?? 'Special Deal',
            restaurant['address'] ?? 'Address not available',
            (deal['rating'] ?? 0.0).toDouble(),
            (deal['distance'] ?? 0.0).toDouble(),
            deal['redeemCount'] ?? 0,
            dealId: deal['id'],
          );
        },
      ),
    );
  }

  Widget _buildDealCard(
      String name, String address, double rating, double distance, int deals,
      {String? dealId}) {
    return GestureDetector(
      onTap: () {
        if (dealId != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => DealDetailScreen(
                dealId: dealId,
              ),
            ),
          );
        }
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[200]!),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Container(
              height: 120,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(12)),
              ),
              child: Center(
                child: Icon(Icons.fastfood, size: 50, color: Colors.grey[400]),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    address,
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.grey[600],
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.star,
                          color: Color(0xFFB8860B), size: 14),
                      const SizedBox(width: 4),
                      Text('$rating', style: const TextStyle(fontSize: 12)),
                      const Spacer(),
                      const Icon(Icons.location_on,
                          color: Colors.red, size: 14),
                      const SizedBox(width: 4),
                      Text('${distance} Km',
                          style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFB8860B),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Popular',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '$deals Deal',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPopularMealMenu() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Popular Restaurants',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          if (_isLoadingRestaurants)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(20.0),
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFB8860B)),
                ),
              ),
            )
          else if (_restaurants == null || _restaurants!.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(20.0),
                child: Text(
                  'No restaurants available',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
              ),
            )
          else
            ..._restaurants!.take(5).map((restaurant) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: _buildPopularMealItem(
                  restaurant['name'] ?? 'Restaurant',
                  restaurant['address'] ?? 'Address not available',
                  (restaurant['averageRating'] ?? 0.0).toDouble(),
                  0.0, // Distance - will be calculated when geolocation is added
                  (restaurant['deals']?.length ?? 0),
                  restaurantId: restaurant['id'],
                ),
              );
            }).toList(),
        ],
      ),
    );
  }

  Widget _buildPopularMealItem(
      String name, String address, double rating, double distance, int deals,
      {String? restaurantId}) {
    return GestureDetector(
      onTap: () {
        if (restaurantId != null) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => RestaurantDetailScreen(
                restaurantId: restaurantId,
              ),
            ),
          );
        }
      },
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[200]!),
        ),
        child: Row(
          children: [
            Container(
              width: 70,
              height: 70,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(Icons.local_pizza, size: 35, color: Colors.grey[400]),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    address,
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.grey[600],
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.star,
                          color: Color(0xFFB8860B), size: 14),
                      const SizedBox(width: 4),
                      Text('$rating', style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Row(
                  children: [
                    const Icon(Icons.location_on, color: Colors.red, size: 14),
                    const SizedBox(width: 4),
                    Text('${distance} Km',
                        style: const TextStyle(fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '$deals Deals',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      child: Container(
        color: const Color(0xFFB8860B),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 40),

              // Close button
              Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: const EdgeInsets.only(right: 16),
                  child: GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.close,
                        color: Color(0xFFB8860B),
                        size: 20,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 40),

              // Menu Items
              _buildDrawerItem(Icons.star_border, 'Featured'),
              _buildDrawerItem(Icons.category_outlined, 'Categories'),
              _buildDrawerItem(Icons.local_offer_outlined, 'My Active Deal'),
              _buildDrawerItem(Icons.favorite_border, 'Favorites'),

              const Spacer(),

              // Sign Out Button
              Padding(
                padding: const EdgeInsets.all(32),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamedAndRemoveUntil(
                        context,
                        '/login',
                        (route) => false,
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFFB8860B),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(25),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Sign Out',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.arrow_forward, size: 18),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 32, vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: Colors.white, size: 24),
          const SizedBox(width: 16),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
