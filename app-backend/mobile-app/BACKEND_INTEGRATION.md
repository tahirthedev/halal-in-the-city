# Backend Integration - Mobile App

## Overview
This document describes the backend API integration for the Halal in the City Flutter mobile app.

## Architecture

### Service Layer
The app uses a service layer pattern to communicate with the backend API:

```
┌─────────────────┐
│   UI Screens    │
│  (home_screen)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Domain Services │
│ (restaurant_    │
│  deal_service)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Service   │
│  (dio wrapper)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  (Node.js/      │
│   Express)      │
└─────────────────┘
```

### API Configuration
- **Base URL**: `http://localhost:3000/api/v1`
- **Timeout**: 30 seconds connect, 30 seconds receive
- **Authentication**: Bearer token in Authorization header

## Services

### 1. ApiService (`lib/services/api_service.dart`)
Base HTTP client using Dio package.

**Features:**
- Automatic auth token injection via interceptors
- Request/response logging in debug mode
- Error handling and DioException wrapping
- Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`

**Usage:**
```dart
final apiService = ApiService();
final response = await apiService.get('/restaurants');
```

### 2. RestaurantService (`lib/services/restaurant_service.dart`)
Handles restaurant-related API calls.

**Methods:**
- `getAllRestaurants({search, category, latitude, longitude, limit})` - Get all restaurants with filters
- `getRestaurantById(id)` - Get single restaurant details
- `getNearestRestaurants({latitude, longitude, limit})` - Get restaurants by proximity
- `getFeaturedRestaurants({limit})` - Get premium restaurants

**Usage:**
```dart
final restaurantService = RestaurantService(apiService);
final restaurants = await restaurantService.getAllRestaurants(category: 'Burger');
```

### 3. DealService (`lib/services/deal_service.dart`)
Handles deal/coupon-related API calls.

**Methods:**
- `getAllDeals({restaurantId, category, isActive, limit})` - Get all deals with filters
- `getDealById(id)` - Get single deal details
- `getDealsByRestaurant(restaurantId)` - Get deals for specific restaurant
- `getNewestDeals({limit})` - Get recently created deals
- `getFeaturedDeals({limit})` - Get deals from premium restaurants
- `redeemDeal(dealId)` - Redeem a deal/coupon

**Usage:**
```dart
final dealService = DealService(apiService);
final deals = await dealService.getNewestDeals(limit: 20);
```

## Backend API Endpoints

### Restaurants
- `GET /api/v1/restaurants` - List all restaurants
  - Query params: `search`, `category`, `latitude`, `longitude`, `limit`
- `GET /api/v1/restaurants/:id` - Get restaurant by ID

### Deals
- `GET /api/v1/deals` - List all deals
  - Query params: `restaurantId`, `category`, `isActive`, `featured`, `sortBy`, `sortOrder`, `limit`
- `GET /api/v1/deals/:id` - Get deal by ID

### Redemptions
- `POST /api/v1/redemptions/redeem/:dealId` - Redeem a deal
  - Requires authentication

### Auth
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout

## Home Screen Integration

### Tab Implementation
The home screen has 3 tabs that load different data:

1. **Newest Tab**: Shows recently created deals
   - Calls: `dealService.getNewestDeals()`
   - Sorted by creation date (descending)

2. **Featured Tab**: Shows deals from premium restaurants
   - Calls: `dealService.getFeaturedDeals()`
   - Filters restaurants with growth/premium subscription plans

3. **Nearest Tab**: Shows deals from nearby restaurants
   - Calls: `dealService.getAllDeals()` (placeholder)
   - TODO: Implement geolocation and call with user coordinates

### Category Filter
Users can filter by food category (Burger, Pizza, Sandwich):
- When category is selected, deals are filtered client-side
- Filters based on restaurant's category field
- Clicking again clears the filter

### Loading States
- Shows `CircularProgressIndicator` while fetching data
- Shows "No deals available" message when empty
- Shows error SnackBar on API failures

### Data Flow
```dart
initState() → Initialize services → Load initial deals
  ↓
Tab change → _loadDeals() → Fetch data based on tab
  ↓
Category selection → _loadDeals() → Filter by category
  ↓
setState() → Rebuild UI with new data
```

## Data Models

### Deal Object (from API)
```json
{
  "id": "deal_123",
  "title": "50% Off Chicken Burger",
  "description": "Special discount on all chicken burgers",
  "restaurant": {
    "id": "rest_456",
    "name": "Burger Palace",
    "address": "123 Main St, Surrey BC",
    "category": "Burger",
    "rating": 4.5
  },
  "discountPercentage": 50,
  "validFrom": "2024-01-01T00:00:00Z",
  "validUntil": "2024-12-31T23:59:59Z",
  "isActive": true,
  "redeemCount": 42
}
```

### Restaurant Object (from API)
```json
{
  "id": "rest_456",
  "name": "Burger Palace",
  "address": "123 Main St, Surrey BC",
  "category": "Burger",
  "rating": 4.5,
  "latitude": 49.1234,
  "longitude": -122.5678,
  "subscriptionTier": "premium",
  "deals": []
}
```

## Next Steps

### TODO
1. **Geolocation**: 
   - Add `geolocator` package
   - Request location permissions
   - Implement nearest deals based on user location

2. **Deal Images**:
   - Update deal cards to show actual images from API
   - Handle image loading states and errors

3. **Search Functionality**:
   - Connect search bar to API
   - Implement debounced search queries

4. **Error Handling**:
   - Add retry mechanism for failed requests
   - Implement offline mode with cached data

5. **Remaining Screens**:
   - Restaurant Detail Screen
   - Deal Detail Screen
   - QR Code Screen (for redemption)
   - Thank You Screen (success state)

6. **Navigation**:
   - Implement tap handlers on deal cards
   - Navigate to detail screens with deal/restaurant data

## Testing

### Running the Backend
```bash
cd app-backend
docker-compose up
```
Backend will be available at `http://localhost:3000`

### Running the Mobile App
```bash
cd mobile-app
flutter run
```

### Testing API Calls
1. Login to the app
2. Navigate to Welcome Screen
3. Click "Halal Eats & Deals" button
4. Home Screen will automatically load deals from backend
5. Switch between tabs to see different data
6. Click category chips to filter

## Troubleshooting

### Connection Refused
- Ensure backend is running on `localhost:3000`
- Check if Android emulator can reach host machine (use `10.0.2.2` for localhost)
- For iOS simulator, `localhost` should work

### Authentication Errors
- Ensure user is logged in before making authenticated requests
- Check if auth token is properly stored and injected
- Verify token hasn't expired

### No Data Loading
- Check backend logs for errors
- Verify API endpoints are returning correct data structure
- Check Flutter console for error messages
- Use API testing tool (Postman) to verify endpoints work
