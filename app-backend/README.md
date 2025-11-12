# Halal in the City - Development Environment

A subscription-based restaurant deals platform for halal restaurants in Canada.

## Quick Start

### Prerequisites
- Docker Desktop
- Node.js 18+
- Flutter SDK 3.x
- Git

### Setup Commands (Windows PowerShell)

```powershell
# Clone and setup
git clone <your-repo-url>
cd halal-in-the-city

# Copy environment files
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
Copy-Item admin-dashboard\.env.example admin-dashboard\.env

# Start services
docker-compose up -d

# Setup backend
cd backend
npm install
npm run migrate
npm run seed
cd ..

# Setup admin dashboard
cd admin-dashboard
npm install
cd ..

# Setup mobile app
cd mobile-app
flutter pub get
flutter run
```

## Services

- **Backend API**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Development Scripts

```powershell
# Start all services
.\scripts\dev-start.ps1

# Stop all services
.\scripts\dev-stop.ps1

# Reset database
.\scripts\reset-db.ps1

# Run tests
.\scripts\test.ps1
```

## Project Structure

```
halal-in-the-city/
├── backend/              # Node.js API
├── admin-dashboard/      # React admin panel
├── mobile-app/          # Flutter mobile app
├── scripts/             # Development scripts
├── docs/               # Documentation
└── docker-compose.yml  # Docker services
```

## Environment Variables

Copy `.env.example` files and update with your keys:
- Stripe test keys
- Firebase config
- JWT secrets
- Database credentials

## Troubleshooting

### Reset Everything
```powershell
docker-compose down -v
docker-compose up -d
cd backend && npm run migrate && npm run seed
```

### Check Service Health
```powershell
docker-compose ps
docker-compose logs [service-name]
```
