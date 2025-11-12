# Halal in the City - Complete Deployment Guide

**Last Updated:** November 10, 2025  
**Version:** 1.0

This guide provides step-by-step instructions to set up and run the entire Halal in the City platform on a new computer using Docker Compose and Git.

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Project Setup](#project-setup)
4. [Environment Configuration](#environment-configuration)
5. [Docker Services Setup](#docker-services-setup)
6. [Application Setup](#application-setup)
7. [Running the Platform](#running-the-platform)
8. [Verification & Testing](#verification--testing)
9. [Troubleshooting](#troubleshooting)
10. [Common Commands](#common-commands)

---

## 🖥️ System Requirements

### Minimum Requirements
- **OS:** Windows 10/11, macOS 11+, or Linux (Ubuntu 20.04+)
- **RAM:** 8GB (16GB recommended)
- **Storage:** 10GB free space
- **CPU:** 4 cores (8 cores recommended)
- **Internet:** Stable broadband connection

### Software Requirements
- Git 2.30+
- Docker Desktop 4.0+
- Node.js 18.0+
- Flutter SDK 3.0+ (for mobile app development)
- PowerShell 5.1+ (Windows) or Bash (macOS/Linux)

---

## 📦 Prerequisites Installation

### Step 1: Install Git

**Windows:**
```powershell
# Download and install from: https://git-scm.com/download/win
# Or use winget:
winget install Git.Git
```

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install git
```

Verify installation:
```bash
git --version
# Should show: git version 2.x.x
```

### Step 2: Install Docker Desktop

**Windows:**
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Run the installer
3. Enable WSL 2 backend (recommended)
4. Restart computer if prompted

**macOS:**
```bash
brew install --cask docker
```

**Linux:**
```bash
# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin
```

Verify installation:
```bash
docker --version
# Should show: Docker version 20.x.x

docker-compose --version
# Should show: Docker Compose version v2.x.x
```

### Step 3: Install Node.js

**Windows:**
```powershell
# Download from: https://nodejs.org/en/download/
# Or use winget:
winget install OpenJS.NodeJS.LTS
```

**macOS:**
```bash
brew install node@18
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

### Step 4: Install Flutter SDK (Optional - for mobile development)

**Windows:**
1. Download Flutter SDK: https://flutter.dev/docs/get-started/install/windows
2. Extract to `C:\src\flutter`
3. Add to PATH: `C:\src\flutter\bin`

**macOS:**
```bash
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"
```

**Linux:**
```bash
sudo snap install flutter --classic
```

Verify installation:
```bash
flutter --version
flutter doctor
```

---

## 🚀 Project Setup

### Step 1: Clone the Repository

```bash
# Clone the project
git clone <YOUR_REPOSITORY_URL> halal-in-the-city
cd halal-in-the-city

# Verify project structure
ls -la
# You should see: admin-dashboard, merchant-dashboard, halal-landing, app-backend, etc.
```

### Step 2: Verify Project Structure

Your project should have the following structure:
```
halal-in-the-city/
├── admin-dashboard/          # Admin panel (React + Vite)
├── merchant-dashboard/       # Merchant portal (React + Vite)
├── halal-landing/           # Landing page (Next.js)
├── app-backend/             # Backend services
│   ├── backend/             # Node.js API
│   ├── mobile-app/          # Flutter mobile app
│   ├── scripts/             # PowerShell scripts
│   └── docker-compose.yml   # Docker services
├── public/                  # Static assets
├── src/                     # Shared source
├── SLA.md                   # Service Level Agreement
└── DEPLOYMENT_GUIDE.md      # This file
```

---

## 🔐 Environment Configuration

### Step 1: Backend Environment Setup

```powershell
# Navigate to backend directory
cd app-backend/backend

# Create .env file from example
Copy-Item .env.example .env

# Edit the .env file with your settings
notepad .env
```

**Backend `.env` Configuration:**
```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/halal_deals?schema=public"

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Redis URL
REDIS_URL="redis://localhost:6379"

# Stripe Configuration (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_your_actual_stripe_test_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_actual_webhook_secret_here"

# Server Configuration
NODE_ENV="development"
PORT=3000

# CORS Origins (add all your frontend URLs)
CORS_ORIGINS="http://localhost:5173,http://localhost:5174,http://localhost:3000"

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

### Step 2: Admin Dashboard Environment

```powershell
# Navigate to admin dashboard
cd ../../admin-dashboard

# Create .env file
New-Item -ItemType File -Path .env -Force

# Add configuration
@"
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Halal in the City Admin
"@ | Set-Content .env
```

### Step 3: Merchant Dashboard Environment

```powershell
# Navigate to merchant dashboard
cd ../merchant-dashboard

# Create .env file
New-Item -ItemType File -Path .env -Force

# Add configuration
@"
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Halal in the City Merchant
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key
"@ | Set-Content .env
```

### Step 4: Landing Page Environment

```powershell
# Navigate to landing page
cd ../halal-landing

# Create .env.local file
New-Item -ItemType File -Path .env.local -Force

# Add configuration
@"
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key

# Stripe Price IDs (Create these in Stripe Dashboard)
STRIPE_PRICE_STARTER=price_1234567890abcdef
STRIPE_PRICE_GROWTH=price_1234567890ghijkl
STRIPE_PRICE_PREMIUM=price_1234567890mnopqr

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MERCHANT_DASHBOARD_URL=http://localhost:5173
"@ | Set-Content .env.local
```

### Step 5: Getting Your Stripe Keys

1. **Sign up for Stripe:** https://dashboard.stripe.com/register
2. **Get Test API Keys:**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (starts with `pk_test_`)
   - Copy **Secret key** (starts with `sk_test_`)
3. **Create Webhook Secret:**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Create endpoint: `http://localhost:3000/api/webhook`
   - Copy the signing secret (starts with `whsec_`)
4. **Create Product Prices:**
   - Go to: https://dashboard.stripe.com/test/products
   - Create 3 products: Starter ($49), Growth ($99), Premium ($199)
   - Set to monthly recurring
   - Copy each price ID (starts with `price_`)

---

## 🐳 Docker Services Setup

### Step 1: Start Docker Desktop

Ensure Docker Desktop is running before proceeding.

**Windows:**
- Open Docker Desktop from Start Menu
- Wait for "Docker Desktop is running" status

**macOS/Linux:**
```bash
# Docker should start automatically
# Check status:
docker info
```

### Step 2: Build and Start Services

```powershell
# Navigate to app-backend directory
cd app-backend

# Start all Docker services (PostgreSQL, Redis, Backend API)
docker-compose up -d

# Verify services are running
docker-compose ps
```

Expected output:
```
NAME                COMMAND                  SERVICE     STATUS      PORTS
halal_backend       "docker-entrypoint.s…"   backend     running     0.0.0.0:3000->3000/tcp
halal_postgres      "docker-entrypoint.s…"   postgres    running     0.0.0.0:5432->5432/tcp
halal_redis         "docker-entrypoint.s…"   redis       running     0.0.0.0:6379->6379/tcp
```

### Step 3: Check Service Logs

```powershell
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs postgres
docker-compose logs redis

# Follow logs in real-time
docker-compose logs -f backend
```

### Step 4: Verify Database Connection

```powershell
# Connect to PostgreSQL container
docker exec -it halal_postgres psql -U postgres -d halal_deals

# Inside PostgreSQL, run:
\dt  # List tables
\q   # Quit
```

---

## 💻 Application Setup

### Step 1: Install Backend Dependencies

```powershell
# Navigate to backend directory
cd app-backend/backend

# Install Node.js dependencies
npm install

# This will install all packages from package.json
# Including: express, prisma, stripe, jwt, etc.
```

### Step 2: Run Database Migrations

```powershell
# Generate Prisma Client
npm run generate

# Run migrations to create database tables
npm run migrate

# Optional: Seed database with sample data
npm run seed
```

### Step 3: Install Admin Dashboard Dependencies

```powershell
# Navigate to admin dashboard
cd ../../admin-dashboard

# Install dependencies
npm install

# Dependencies: React, React Router, Recharts, Vite
```

### Step 4: Install Merchant Dashboard Dependencies

```powershell
# Navigate to merchant dashboard
cd ../merchant-dashboard

# Install dependencies
npm install

# Dependencies: React, React Router, Recharts, Vite
```

### Step 5: Install Landing Page Dependencies

```powershell
# Navigate to landing page
cd ../halal-landing

# Install dependencies
npm install

# Dependencies: Next.js, React, Tailwind CSS, Stripe
```

### Step 6: Setup Mobile App (Optional)

```powershell
# Navigate to mobile app
cd ../app-backend/mobile-app

# Get Flutter dependencies
flutter pub get

# Check for any issues
flutter doctor

# Run on emulator or device
flutter run
```

---

## ▶️ Running the Platform

### Option 1: Using PowerShell Scripts (Recommended)

```powershell
# Navigate to project root
cd halal-in-the-city

# Start all services using the automated script
.\start-all.ps1

# This script will:
# 1. Start Docker services (PostgreSQL, Redis, Backend)
# 2. Start Admin Dashboard on http://localhost:5174
# 3. Start Merchant Dashboard on http://localhost:5173
# 4. Start Landing Page on http://localhost:3000
```

### Option 2: Manual Start (Individual Services)

**Terminal 1 - Docker Services:**
```powershell
cd app-backend
docker-compose up
```

**Terminal 2 - Admin Dashboard:**
```powershell
cd admin-dashboard
npm run dev
# Runs on: http://localhost:5174
```

**Terminal 3 - Merchant Dashboard:**
```powershell
cd merchant-dashboard
npm run dev
# Runs on: http://localhost:5173
```

**Terminal 4 - Landing Page:**
```powershell
cd halal-landing
npm run dev
# Runs on: http://localhost:3000
```

**Terminal 5 - Mobile App (Optional):**
```powershell
cd app-backend/mobile-app
flutter run
```

### Service URLs

Once everything is running, access the services at:

| Service | URL | Description |
|---------|-----|-------------|
| **Landing Page** | http://localhost:3000 | Public-facing website |
| **Merchant Dashboard** | http://localhost:5173 | Merchant portal |
| **Admin Dashboard** | http://localhost:5174 | Admin panel |
| **Backend API** | http://localhost:3000/api | REST API |
| **PostgreSQL** | localhost:5432 | Database |
| **Redis** | localhost:6379 | Cache |
| **Prisma Studio** | http://localhost:5555 | Database GUI (run `npm run studio`) |

---

## ✅ Verification & Testing

### Step 1: Health Check

Test each service to ensure it's running correctly:

**1. Backend API Health Check:**
```powershell
# Using curl (Windows 10+)
curl http://localhost:3000/api/health

# Using PowerShell
Invoke-WebRequest http://localhost:3000/api/health
```

Expected response: `{"status": "ok"}`

**2. Database Connection:**
```powershell
docker exec -it halal_postgres pg_isready -U postgres
# Should output: /var/run/postgresql:5432 - accepting connections
```

**3. Redis Connection:**
```powershell
docker exec -it halal_redis redis-cli ping
# Should output: PONG
```

### Step 2: Test Frontend Applications

**Admin Dashboard:**
1. Open http://localhost:5174
2. You should see the login page
3. Test credentials (if seeded):
   - Email: `admin@halal.com`
   - Password: `admin123`

**Merchant Dashboard:**
1. Open http://localhost:5173
2. You should see the login page
3. Click "Sign Up" to create a merchant account

**Landing Page:**
1. Open http://localhost:3000
2. Verify the homepage loads
3. Check pricing section
4. Test Stripe checkout (test mode)

### Step 3: Database Verification

```powershell
# Access Prisma Studio for visual database inspection
cd app-backend/backend
npm run studio

# Opens http://localhost:5555
# Browse tables: User, Restaurant, Deal, Subscription, etc.
```

### Step 4: API Testing

Create a test file `test-api.http` or use Postman:

```http
### Health Check
GET http://localhost:3000/api/health

### Register Merchant
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "merchant@test.com",
  "password": "Test123!",
  "name": "Test Restaurant",
  "phone": "1234567890",
  "role": "MERCHANT"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "merchant@test.com",
  "password": "Test123!"
}

### Get Restaurants (requires auth token)
GET http://localhost:3000/api/restaurants
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change port in .env file
PORT=3001
```

#### 2. Docker Services Won't Start

**Error:** `Cannot connect to Docker daemon`

**Solution:**
```powershell
# Ensure Docker Desktop is running
# Restart Docker Desktop
# Check Docker status
docker info

# Reset Docker if needed
docker system prune -a
```

#### 3. Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
```powershell
# Check if PostgreSQL container is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres

# Verify DATABASE_URL in .env matches docker-compose.yml
```

#### 4. Prisma Migration Errors

**Error:** `Migration failed`

**Solution:**
```powershell
# Reset database and rerun migrations
cd app-backend/backend
npm run migrate:reset

# Then rerun migrations
npm run migrate

# Reseed data
npm run seed
```

#### 5. Node Modules Issues

**Error:** `Cannot find module 'express'`

**Solution:**
```powershell
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstall dependencies
npm install
```

#### 6. CORS Errors in Browser

**Error:** `Access blocked by CORS policy`

**Solution:**
```env
# Add frontend URL to CORS_ORIGINS in backend/.env
CORS_ORIGINS="http://localhost:5173,http://localhost:5174,http://localhost:3000"
```

#### 7. Stripe Webhook Not Working

**Error:** `Stripe webhook signature verification failed`

**Solution:**
```powershell
# Use Stripe CLI for local testing
stripe listen --forward-to localhost:3000/api/webhook

# Copy the webhook signing secret to .env
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

#### 8. Flutter Build Errors

**Error:** `Flutter SDK not found`

**Solution:**
```bash
# Run Flutter doctor to diagnose
flutter doctor -v

# Accept Android licenses
flutter doctor --android-licenses

# Update Flutter
flutter upgrade
```

### Complete Reset (Nuclear Option)

If nothing works, perform a complete reset:

```powershell
# Stop and remove all containers
cd app-backend
docker-compose down -v

# Remove all node_modules
cd ../admin-dashboard
Remove-Item -Recurse -Force node_modules
cd ../merchant-dashboard
Remove-Item -Recurse -Force node_modules
cd ../halal-landing
Remove-Item -Recurse -Force node_modules
cd ../app-backend/backend
Remove-Item -Recurse -Force node_modules

# Start fresh
cd ../..
docker-compose up -d
cd backend
npm install
npm run migrate
npm run seed

cd ../../admin-dashboard
npm install
npm run dev

cd ../merchant-dashboard
npm install
npm run dev

cd ../halal-landing
npm install
npm run dev
```

---

## 📝 Common Commands Reference

### Docker Commands

```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart backend

# Rebuild services after changes
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v

# Check service status
docker-compose ps

# Execute command in container
docker exec -it halal_backend sh
```

### Database Commands

```powershell
# Run migrations
npm run migrate

# Reset database
npm run migrate:reset

# Seed database
npm run seed

# Open Prisma Studio
npm run studio

# Generate Prisma Client
npm run generate
```

### Development Commands

```powershell
# Start backend in dev mode (auto-reload)
cd app-backend/backend
npm run dev

# Start admin dashboard
cd admin-dashboard
npm run dev

# Start merchant dashboard
cd merchant-dashboard
npm run dev

# Start landing page
cd halal-landing
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Git Commands

```powershell
# Pull latest changes
git pull origin main

# Check status
git status

# Create new branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Description of changes"

# Push changes
git push origin feature/new-feature
```

### Testing Commands

```powershell
# Run backend tests
cd app-backend/backend
npm test

# Run tests in watch mode
npm run test:watch

# Run Flutter tests
cd app-backend/mobile-app
flutter test
```

---

## 🌐 Production Deployment Notes

### Environment Variables for Production

**Important:** Change these before deploying to production:

```env
# Backend .env
NODE_ENV=production
JWT_SECRET="<generate-strong-random-secret-min-32-chars>"
DATABASE_URL="<production-database-url>"
STRIPE_SECRET_KEY="sk_live_your_live_key"
STRIPE_WEBHOOK_SECRET="whsec_your_live_webhook_secret"
CORS_ORIGINS="https://yourdomain.com,https://merchant.yourdomain.com"
```

### Production Checklist

- [ ] Update all `.env` files with production values
- [ ] Change JWT secrets to strong random strings
- [ ] Use Stripe live keys instead of test keys
- [ ] Enable SSL/HTTPS for all services
- [ ] Set up proper database backup strategy
- [ ] Configure Redis persistence
- [ ] Set up monitoring and logging (e.g., Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline (GitHub Actions, GitLab CI)
- [ ] Enable rate limiting and DDoS protection
- [ ] Review and update CORS origins
- [ ] Set up domain names and DNS
- [ ] Configure email service (SMTP)
- [ ] Enable database connection pooling
- [ ] Set up automated backups
- [ ] Configure health checks and uptime monitoring

### Recommended Hosting Platforms

- **Backend API:** AWS ECS, Google Cloud Run, Heroku, Railway
- **Database:** AWS RDS, Google Cloud SQL, Supabase
- **Redis:** AWS ElastiCache, Redis Cloud, Upstash
- **Frontend:** Vercel, Netlify, AWS Amplify
- **Mobile App:** App Store, Google Play Store

---

## 📞 Support and Resources

### Documentation
- **Project README:** See `README.md` in each service directory
- **API Documentation:** `app-backend/backend/docs/API_DOCUMENTATION.md`
- **SLA Document:** `SLA.md` in project root

### External Resources
- **React:** https://react.dev/
- **Next.js:** https://nextjs.org/docs
- **Flutter:** https://flutter.dev/docs
- **Prisma:** https://www.prisma.io/docs
- **Stripe:** https://stripe.com/docs
- **Docker:** https://docs.docker.com/

### Getting Help
- **Email Support:** support@halalinthecity.com
- **GitHub Issues:** <your-repo-url>/issues
- **Stack Overflow:** Tag questions with `halal-in-the-city`

---

## 📜 License and Credits

**Copyright © 2025 Halal in the City**

All rights reserved. This software is proprietary and confidential.

---

## 🔄 Changelog

### Version 1.0 (November 10, 2025)
- Initial deployment guide
- Complete environment setup instructions
- Docker Compose configuration
- Troubleshooting section
- Production deployment notes

---

**Last Updated:** November 10, 2025  
**Maintained by:** Development Team  
**Questions?** Email support@halalinthecity.com
