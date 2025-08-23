# Halal in the City - API Documentation

## Overview
RESTful API for the Halal in the City subscription-based restaurant deals platform.

**Base URL:** `http://localhost:3000/api/v1`  
**Authentication:** JWT Bearer tokens  
**Content Type:** `application/json`

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "USER" // USER | RESTAURANT_OWNER | ADMIN
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### POST /auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### POST /auth/refresh
Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token"
  }
}
```

### POST /auth/logout
Invalidate current session.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🏪 Restaurant Endpoints

### GET /restaurants
Get list of restaurants with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `search`: Search by name or cuisine
- `city`: Filter by city
- `latitude`: User latitude for distance sorting
- `longitude`: User longitude for distance sorting
- `radius`: Search radius in km (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "cuid",
        "name": "Halal Bistro",
        "description": "Authentic halal cuisine",
        "cuisineType": "Pakistani",
        "address": "123 Main St",
        "city": "Toronto",
        "postalCode": "M5V 1A1",
        "phone": "+14161234567",
        "email": "info@halalbistro.com",
        "isActive": true,
        "averageRating": 4.5,
        "totalReviews": 127,
        "distance": 2.3,
        "currentDeals": 3,
        "subscriptionTier": "GOLD",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

### GET /restaurants/:id
Get detailed restaurant information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "restaurant": {
      "id": "cuid",
      "name": "Halal Bistro",
      "description": "Authentic halal cuisine with modern twist",
      "cuisineType": "Pakistani",
      "address": "123 Main St",
      "city": "Toronto",
      "province": "ON",
      "postalCode": "M5V 1A1",
      "phone": "+14161234567",
      "email": "info@halalbistro.com",
      "website": "https://halalbistro.com",
      "isActive": true,
      "averageRating": 4.5,
      "totalReviews": 127,
      "subscriptionTier": "GOLD",
      "hours": {
        "monday": { "open": "11:00", "close": "22:00" },
        "tuesday": { "open": "11:00", "close": "22:00" },
        "wednesday": { "open": "11:00", "close": "22:00" },
        "thursday": { "open": "11:00", "close": "22:00" },
        "friday": { "open": "11:00", "close": "23:00" },
        "saturday": { "open": "10:00", "close": "23:00" },
        "sunday": { "open": "12:00", "close": "21:00" }
      },
      "activeDeals": [
        {
          "id": "deal_cuid",
          "title": "20% off lunch special",
          "description": "Valid Monday-Friday 11:30AM-3:00PM",
          "discountType": "PERCENTAGE",
          "discountValue": 20,
          "maxUses": 5,
          "usedCount": 2,
          "remainingUses": 3,
          "expiresAt": "2024-02-01T23:59:59.000Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### POST /restaurants
Create new restaurant (RESTAURANT_OWNER or ADMIN only).

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "name": "New Halal Restaurant",
  "description": "Fresh halal food daily",
  "cuisineType": "Mediterranean",
  "address": "456 Oak Avenue",
  "city": "Toronto",
  "province": "ON",
  "postalCode": "M4E 2B2",
  "phone": "+14167654321",
  "email": "info@newhalal.com",
  "website": "https://newhalal.com",
  "subscriptionTier": "BRONZE",
  "hours": {
    "monday": { "open": "09:00", "close": "21:00" },
    "tuesday": { "open": "09:00", "close": "21:00" },
    "wednesday": { "open": "09:00", "close": "21:00" },
    "thursday": { "open": "09:00", "close": "21:00" },
    "friday": { "open": "09:00", "close": "22:00" },
    "saturday": { "open": "10:00", "close": "22:00" },
    "sunday": { "open": "11:00", "close": "20:00" }
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "restaurant": {
      "id": "new_cuid",
      "name": "New Halal Restaurant",
      "ownerId": "owner_cuid",
      "subscriptionTier": "BRONZE",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 🎁 Deal Endpoints

### GET /deals
Get list of active deals with filtering and search.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `restaurantId`: Filter by specific restaurant
- `city`: Filter by city
- `latitude` & `longitude`: For location-based filtering
- `radius`: Search radius in km (default: 10)
- `discountType`: PERCENTAGE | FIXED_AMOUNT | BUY_ONE_GET_ONE
- `search`: Search deal titles and descriptions

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "id": "deal_cuid",
        "title": "20% Off Lunch Special",
        "description": "Valid Monday-Friday 11:30AM-3:00PM. Cannot be combined with other offers.",
        "discountType": "PERCENTAGE",
        "discountValue": 20,
        "minOrderAmount": 15.00,
        "maxUses": 5,
        "usedCount": 2,
        "remainingUses": 3,
        "perUserLimit": 1,
        "code": "LUNCH20",
        "qrCode": "data:image/png;base64,iVBORw0KGgoAAAAN...",
        "isActive": true,
        "startsAt": "2024-01-01T00:00:00.000Z",
        "expiresAt": "2024-02-01T23:59:59.000Z",
        "restaurant": {
          "id": "restaurant_cuid",
          "name": "Halal Bistro",
          "city": "Toronto",
          "distance": 2.3
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 23,
      "pages": 3
    }
  }
}
```

### GET /deals/:id
Get detailed deal information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deal": {
      "id": "deal_cuid",
      "title": "20% Off Lunch Special",
      "description": "Valid Monday-Friday 11:30AM-3:00PM. Cannot be combined with other offers.",
      "terms": "Valid for dine-in only. Not valid on public holidays.",
      "discountType": "PERCENTAGE",
      "discountValue": 20,
      "minOrderAmount": 15.00,
      "maxUses": 5,
      "usedCount": 2,
      "remainingUses": 3,
      "perUserLimit": 1,
      "code": "LUNCH20",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAAN...",
      "isActive": true,
      "startsAt": "2024-01-01T00:00:00.000Z",
      "expiresAt": "2024-02-01T23:59:59.000Z",
      "restaurant": {
        "id": "restaurant_cuid",
        "name": "Halal Bistro",
        "address": "123 Main St",
        "city": "Toronto",
        "phone": "+14161234567",
        "hours": { /* restaurant hours object */ }
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### POST /deals
Create new deal (RESTAURANT_OWNER for own restaurant, ADMIN for any).

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "restaurantId": "restaurant_cuid",
  "title": "Weekend Special",
  "description": "50% off all appetizers on weekends",
  "terms": "Valid Saturday-Sunday only. Dine-in only.",
  "discountType": "PERCENTAGE",
  "discountValue": 50,
  "minOrderAmount": 10.00,
  "maxUses": 10,
  "perUserLimit": 1,
  "startsAt": "2024-01-06T00:00:00.000Z",
  "expiresAt": "2024-01-31T23:59:59.000Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "deal": {
      "id": "new_deal_cuid",
      "title": "Weekend Special",
      "code": "WKD50APP",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAAN...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### PUT /deals/:id
Update existing deal (owner or admin only).

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:** Same as POST /deals (partial updates allowed)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deal": {
      "id": "deal_cuid",
      "title": "Updated Deal Title",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### DELETE /deals/:id
Delete/deactivate deal (owner or admin only).

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Deal deactivated successfully"
}
```

---

## 🎫 Redemption Endpoints

### POST /redemptions/redeem
Redeem a deal using code or QR scan.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "dealId": "deal_cuid",
  "code": "LUNCH20",
  "orderAmount": 25.50,
  "location": {
    "latitude": 43.6532,
    "longitude": -79.3832
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "redemption": {
      "id": "redemption_cuid",
      "dealId": "deal_cuid",
      "userId": "user_cuid",
      "code": "LUNCH20",
      "originalAmount": 25.50,
      "discountAmount": 5.10,
      "finalAmount": 20.40,
      "status": "COMPLETED",
      "redeemedAt": "2024-01-01T12:30:00.000Z"
    },
    "deal": {
      "title": "20% Off Lunch Special",
      "remainingUses": 2
    },
    "restaurant": {
      "name": "Halal Bistro",
      "address": "123 Main St"
    }
  }
}
```

### GET /redemptions
Get user's redemption history.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: PENDING | COMPLETED | CANCELLED
- `restaurantId`: Filter by restaurant

**Response (200):**
```json
{
  "success": true,
  "data": {
    "redemptions": [
      {
        "id": "redemption_cuid",
        "originalAmount": 25.50,
        "discountAmount": 5.10,
        "finalAmount": 20.40,
        "status": "COMPLETED",
        "redeemedAt": "2024-01-01T12:30:00.000Z",
        "deal": {
          "title": "20% Off Lunch Special",
          "discountType": "PERCENTAGE",
          "discountValue": 20
        },
        "restaurant": {
          "name": "Halal Bistro",
          "city": "Toronto"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    },
    "summary": {
      "totalSavings": 127.50,
      "totalRedemptions": 15,
      "favoriteRestaurant": "Halal Bistro"
    }
  }
}
```

### GET /redemptions/:id
Get specific redemption details.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "redemption": {
      "id": "redemption_cuid",
      "code": "LUNCH20",
      "originalAmount": 25.50,
      "discountAmount": 5.10,
      "finalAmount": 20.40,
      "status": "COMPLETED",
      "redeemedAt": "2024-01-01T12:30:00.000Z",
      "location": {
        "latitude": 43.6532,
        "longitude": -79.3832
      },
      "deal": {
        "title": "20% Off Lunch Special",
        "description": "Valid Monday-Friday 11:30AM-3:00PM",
        "terms": "Cannot be combined with other offers"
      },
      "restaurant": {
        "name": "Halal Bistro",
        "address": "123 Main St",
        "phone": "+14161234567"
      }
    }
  }
}
```

---

## 🎯 Deal Management Endpoints

### POST /deals
Create a new deal (RESTAURANT_OWNER only).

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "50% Off Pizza Special",
  "description": "Get 50% off any large pizza. Valid for dine-in only.",
  "discountType": "PERCENTAGE",
  "discountValue": 50,
  "startDate": "2025-08-24T00:00:00Z",
  "endDate": "2025-09-24T23:59:59Z",
  "expiresAt": "2025-09-24T23:59:59Z",
  "maxRedemptions": 100,
  "restaurantId": "restaurant_cuid",
  "terms": "Valid for dine-in only. Cannot be combined with other offers.",
  "subscriptionTierRequired": "BRONZE"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "deal": {
      "id": "deal_cuid",
      "restaurantId": "restaurant_cuid",
      "title": "50% Off Pizza Special",
      "description": "Get 50% off any large pizza. Valid for dine-in only.",
      "code": "DEAL-1755987622417-QCYZZN",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwA...",
      "discountType": "PERCENTAGE",
      "discountValue": 50,
      "startDate": "2025-08-24T00:00:00Z",
      "endDate": "2025-09-24T23:59:59Z",
      "expiresAt": "2025-09-24T23:59:59Z",
      "maxRedemptions": 100,
      "currentRedemptions": 0,
      "isActive": true,
      "terms": "Valid for dine-in only. Cannot be combined with other offers.",
      "subscriptionTierRequired": "BRONZE",
      "createdAt": "2025-08-24T10:00:00.000Z"
    }
  }
}
```

### GET /deals
Get all active deals with optional filtering.

**Query Parameters:**
- `restaurantId` (optional): Filter by restaurant
- `cuisineType` (optional): Filter by cuisine type
- `discountType` (optional): PERCENTAGE | FIXED_AMOUNT
- `minDiscount` (optional): Minimum discount value
- `maxDiscount` (optional): Maximum discount value
- `latitude` & `longitude` (optional): Filter by location
- `radius` (optional): Search radius in km (default: 10)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "id": "deal_cuid",
        "title": "50% Off Pizza Special",
        "description": "Get 50% off any large pizza. Valid for dine-in only.",
        "code": "DEAL-1755987622417-QCYZZN",
        "discountType": "PERCENTAGE",
        "discountValue": 50,
        "maxRedemptions": 100,
        "currentRedemptions": 5,
        "expiresAt": "2025-09-24T23:59:59Z",
        "restaurant": {
          "id": "restaurant_cuid",
          "name": "Halal Bites",
          "cuisineType": "MIDDLE_EASTERN",
          "address": "123 Main Street",
          "distance": 2.3
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### GET /deals/:id
Get specific deal details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deal": {
      "id": "deal_cuid",
      "restaurantId": "restaurant_cuid",
      "title": "50% Off Pizza Special",
      "description": "Get 50% off any large pizza. Valid for dine-in only.",
      "code": "DEAL-1755987622417-QCYZZN",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwA...",
      "discountType": "PERCENTAGE",
      "discountValue": 50,
      "maxRedemptions": 100,
      "currentRedemptions": 5,
      "isActive": true,
      "terms": "Valid for dine-in only. Cannot be combined with other offers.",
      "restaurant": {
        "name": "Halal Bites",
        "address": "123 Main Street",
        "phone": "+14165551234"
      }
    }
  }
}
```

### PUT /deals/:id
Update deal (RESTAURANT_OWNER only, own deals).

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Pizza Special",
  "description": "Updated description",
  "discountValue": 60,
  "maxRedemptions": 150,
  "terms": "Updated terms and conditions"
}
```

### DELETE /deals/:id
Delete deal (RESTAURANT_OWNER only, own deals).

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Deal deleted successfully"
}
```

---

## 🎫 Redemption Endpoints

### POST /redemptions/redeem
Redeem a deal via QR code scan.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "dealId": "deal_cuid",
  "code": "DEAL-1755987622417-QCYZZN",
  "orderAmount": 25.99,
  "location": {
    "latitude": 43.6532,
    "longitude": -79.3832
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "redemption": {
      "id": "redemption_cuid",
      "userId": "user_cuid",
      "dealId": "deal_cuid",
      "code": "RED-1755987708904-HETYYO",
      "orderAmount": 25.99,
      "discountApplied": 12.995,
      "finalAmount": 12.995,
      "location": {
        "latitude": 43.6532,
        "longitude": -79.3832
      },
      "redeemedAt": "2025-08-24T10:15:00.000Z",
      "deal": {
        "title": "50% Off Pizza Special",
        "discountType": "PERCENTAGE",
        "discountValue": 50
      },
      "restaurant": {
        "name": "Halal Bites",
        "address": "123 Main Street"
      }
    }
  }
}
```

### POST /redemptions/validate
Validate a redemption before processing (preview).

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "dealId": "deal_cuid",
  "orderAmount": 25.99,
  "location": {
    "latitude": 43.6532,
    "longitude": -79.3832
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "validation": {
      "isValid": true,
      "dealDetails": {
        "title": "50% Off Pizza Special",
        "discountType": "PERCENTAGE",
        "discountValue": 50
      },
      "calculatedDiscount": 12.995,
      "finalAmount": 12.995,
      "eligibilityChecks": {
        "dealActive": true,
        "withinRedemptionLimit": true,
        "subscriptionValid": true,
        "locationValid": true
      }
    }
  }
}
```

### GET /redemptions
Get user's redemption history.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response (200):**
```json
{
  "success": true,
  "data": {
    "redemptions": [
      {
        "id": "redemption_cuid",
        "code": "RED-1755987708904-HETYYO",
        "orderAmount": 25.99,
        "discountApplied": 12.995,
        "finalAmount": 12.995,
        "redeemedAt": "2025-08-24T10:15:00.000Z",
        "deal": {
          "title": "50% Off Pizza Special",
          "discountType": "PERCENTAGE",
          "discountValue": 50
        },
        "restaurant": {
          "name": "Halal Bites",
          "address": "123 Main Street"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "summary": {
      "totalRedemptions": 1,
      "totalSavings": 12.995
    }
  }
}
```

### GET /redemptions/:id
Get specific redemption details.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "redemption": {
      "id": "redemption_cuid",
      "userId": "user_cuid",
      "dealId": "deal_cuid",
      "code": "RED-1755987708904-HETYYO",
      "orderAmount": 25.99,
      "discountApplied": 12.995,
      "finalAmount": 12.995,
      "location": {
        "latitude": 43.6532,
        "longitude": -79.3832
      },
      "redeemedAt": "2025-08-24T10:15:00.000Z",
      "deal": {
        "title": "50% Off Pizza Special",
        "discountType": "PERCENTAGE",
        "discountValue": 50,
        "terms": "Valid for dine-in only. Cannot be combined with other offers."
      },
      "restaurant": {
        "name": "Halal Bites",
        "address": "123 Main Street",
        "phone": "+14165551234"
      }
    }
  }
}
```

---

## 👤 User Profile Endpoints

### GET /users/profile
Get current user's profile.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_cuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "role": "USER",
      "isActive": true,
      "preferences": {
        "notifications": true,
        "emailOffers": true,
        "favoriteCategories": ["Pakistani", "Mediterranean"]
      },
      "stats": {
        "totalRedemptions": 15,
        "totalSavings": 127.50,
        "favoriteRestaurant": "Halal Bistro"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### PUT /users/profile
Update user profile.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "preferences": {
    "notifications": true,
    "emailOffers": false,
    "favoriteCategories": ["Pakistani", "Indian", "Mediterranean"]
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_cuid",
      "firstName": "John",
      "lastName": "Smith",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

---

## 🛡️ Admin Endpoints

### GET /admin/stats
Get platform statistics (ADMIN only).

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "users": {
        "total": 2547,
        "active": 2134,
        "newThisMonth": 234
      },
      "restaurants": {
        "total": 89,
        "active": 76,
        "newThisMonth": 5
      },
      "deals": {
        "total": 156,
        "active": 89,
        "expiringSoon": 12
      },
      "redemptions": {
        "total": 5634,
        "thisMonth": 456,
        "totalValue": 67890.50
      },
      "revenue": {
        "thisMonth": 4567.89,
        "lastMonth": 3987.45,
        "growth": 14.5
      }
    }
  }
}
```

### GET /admin/restaurants
Get all restaurants with management info (ADMIN only).

### POST /admin/restaurants/:id/subscription
Update restaurant subscription tier (ADMIN only).

### GET /admin/users
Get all users with filters (ADMIN only).

### PUT /admin/users/:id/status
Activate/deactivate user account (ADMIN only).

---

## 📝 Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "validation error details"
    }
  }
}
```

### Common Error Codes:
- `VALIDATION_ERROR` (400): Request validation failed
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict (duplicate email, etc.)
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

### Authentication Errors:
- `INVALID_CREDENTIALS` (401): Wrong email/password
- `TOKEN_EXPIRED` (401): Access token expired
- `TOKEN_INVALID` (401): Malformed or invalid token
- `ACCOUNT_DISABLED` (403): User account deactivated

### Deal/Redemption Errors:
- `DEAL_EXPIRED` (400): Deal has expired
- `DEAL_LIMIT_REACHED` (400): Maximum uses reached
- `USER_LIMIT_REACHED` (400): User has reached per-user limit
- `INSUFFICIENT_ORDER_VALUE` (400): Order doesn't meet minimum amount
- `INVALID_LOCATION` (400): User not at restaurant location

---

## 🚀 Rate Limiting

- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 10 requests per 15 minutes per IP  
- **Redemption endpoints**: 5 requests per minute per user

Rate limit headers included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85  
X-RateLimit-Reset: 1640995200
```

---

## 📱 Response Headers

All API responses include:
```
Content-Type: application/json
X-API-Version: 1.0.0
X-Request-ID: unique-request-id
```

---

## � Deal & Redemption Error Examples

### Deal Creation Errors

**Missing Required Fields (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "expiresAt": "Valid expiration date is required",
      "restaurantId": "Valid restaurant ID is required"
    }
  }
}
```

**Unauthorized Restaurant Access (403):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Cannot create deals for this restaurant"
  }
}
```

### Redemption Errors

**Deal Already Redeemed (400):**
```json
{
  "success": false,
  "error": {
    "code": "USER_LIMIT_EXCEEDED",
    "message": "You have already redeemed this deal the maximum number of times (1)"
  }
}
```

**Location Validation Failed (400):**
```json
{
  "success": false,
  "error": {
    "code": "LOCATION_ERROR",
    "message": "Redemption location is too far from restaurant",
    "details": {
      "maxDistance": "1km",
      "actualDistance": "2.5km"
    }
  }
}
```

**Expired Deal (400):**
```json
{
  "success": false,
  "error": {
    "code": "DEAL_EXPIRED",
    "message": "This deal has expired and can no longer be redeemed"
  }
}
```

**Subscription Tier Insufficient (403):**
```json
{
  "success": false,
  "error": {
    "code": "SUBSCRIPTION_REQUIRED",
    "message": "GOLD subscription required for this deal",
    "details": {
      "currentTier": "BRONZE",
      "requiredTier": "GOLD"
    }
  }
}
```

---

## �🔄 Webhook Endpoints

### POST /webhooks/stripe
Handle Stripe subscription events.

### POST /webhooks/notifications
Handle external notification events.

---

This documentation covers the core API endpoints for Phase 2. Each endpoint includes comprehensive request/response examples and error handling details.
