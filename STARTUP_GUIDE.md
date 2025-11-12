# Halal in the City - Startup Guide

## Prerequisites
- Docker Desktop installed and running
- Node.js v16+ installed
- PostgreSQL client (optional, for direct DB access)

## Quick Start

### 1. Start Database
```powershell
cd "f:\downloads\halal-in-the-city (1)\app-backend"
docker-compose up -d postgres
```

Wait 10 seconds for PostgreSQL to initialize.

### 2. Start Backend API
```powershell
cd backend
npm install  # First time only
npm start
```

Backend will run on: http://localhost:3000

### 3. Start Admin Dashboard
```powershell
cd "f:\downloads\halal-in-the-city (1)\admin-dashboard"
npm install  # First time only
npm run dev
```

Admin Dashboard will run on: http://localhost:5173

### 4. Start Merchant Dashboard
```powershell
cd "f:\downloads\halal-in-the-city (1)\merchant-dashboard"
npm install  # First time only
npm run dev
```

Merchant Dashboard will run on: http://localhost:5174

## Test Credentials

### Admin User
- Email: `admin@halalinthecity.com`
- Password: `admin123`
- Access: Full system access, approve restaurants/deals

### Restaurant Owner
- Email: `owner@restaurant.com`
- Password: `restaurant123`
- Access: Manage restaurants and deals

### Customer User
- Email: `user@example.com`
- Password: `user123`
- Access: Browse and redeem deals

## API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login
- POST `/auth/logout` - Logout
- POST `/auth/refresh` - Refresh token

### Admin Routes (Requires Admin Role)
- GET `/admin/stats` - Dashboard statistics
- GET `/admin/restaurants` - All restaurants
- GET `/admin/restaurants/pending` - Pending restaurants
- PATCH `/admin/restaurants/:id/approve` - Approve restaurant
- PATCH `/admin/restaurants/:id/reject` - Reject restaurant
- GET `/admin/deals` - All deals
- GET `/admin/deals/pending` - Pending deals
- PATCH `/admin/deals/:id/approve` - Approve deal
- PATCH `/admin/deals/:id/reject` - Reject deal
- GET `/admin/users` - All users
- PATCH `/admin/users/:id/toggle-status` - Activate/deactivate user

### Restaurants
- GET `/restaurants` - Get all restaurants
- GET `/restaurants/:id` - Get restaurant by ID
- POST `/restaurants` - Create restaurant (Auth required)
- PUT `/restaurants/:id` - Update restaurant (Auth required)
- DELETE `/restaurants/:id` - Delete restaurant (Auth required)
- GET `/restaurants/my` - Get my restaurants (Auth required)

### Deals
- GET `/deals` - Get all deals
- GET `/deals/:id` - Get deal by ID
- POST `/deals` - Create deal (Auth required)
- PUT `/deals/:id` - Update deal (Auth required)
- DELETE `/deals/:id` - Delete deal (Auth required)
- GET `/deals/restaurant/:restaurantId` - Get deals by restaurant

### Notifications (Requires Authentication)
- GET `/notifications` - Get all notifications
- GET `/notifications/count` - Get unread count
- PATCH `/notifications/:id/read` - Mark as read
- PATCH `/notifications/read-all` - Mark all as read

### Subscriptions
- GET `/subscriptions/tiers` - Get all subscription tiers
- GET `/subscriptions/tiers/:tier` - Get specific tier details

### Redemptions
- POST `/redemptions` - Redeem a deal
- GET `/redemptions/my` - Get my redemptions

## Subscription Tiers

### STARTER
- Price: $49.99/mo (Regular: $89/mo)
- Features:
  - 1 featured coupon
  - 1 active push campaign
  - Basic analytics
  - Listing in category & map

### GROWTH
- Price: $79.99/mo (Regular: $99/mo)
- Features:
  - Up to 3 featured coupons
  - 3 active push campaigns
  - Advanced analytics
  - Priority listing in category & map
  - Customer insights

## Approval Workflow

### Restaurant Approval
1. Merchant registers and creates account
2. Merchant adds restaurant (Status: PENDING)
3. Admin receives notification
4. Admin reviews and approves/rejects
5. Merchant receives notification
6. If approved, restaurant becomes active

### Deal Approval
1. Merchant creates deal (Status: DRAFT, Approval: PENDING)
2. Admin receives notification
3. Admin reviews and approves/rejects
4. Merchant receives notification
5. If approved, deal becomes ACTIVE and visible to customers

## Troubleshooting

### Port Already in Use
```powershell
# Kill processes on port 3000
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Database Connection Error
```powershell
# Restart PostgreSQL
cd "f:\downloads\halal-in-the-city (1)\app-backend"
docker-compose restart postgres
```

### Reset Database
```powershell
cd backend
npx prisma migrate reset --skip-seed
node src/scripts/seed.js
```

## Development Commands

### Backend
```powershell
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests
```

### Dashboards
```powershell
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/halal_deals?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
REDIS_URL="redis://localhost:6379"
NODE_ENV="development"
PORT=3000
CORS_ORIGINS="http://localhost:5173,http://localhost:5174"
```

### Frontend Dashboards (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TYPE=admin  # or "merchant"
```

## Next Steps

1. Start Docker Desktop
2. Follow the Quick Start guide above
3. Test admin approval workflow
4. Begin frontend integration
5. Implement WebSocket for real-time notifications

## Support
For issues, check:
- Database logs: `docker-compose logs postgres`
- Backend logs: Terminal output
- Frontend console: Browser DevTools
