# Reset database and seed data
Write-Host "Resetting database..." -ForegroundColor Yellow

# Stop services
docker-compose down

# Remove volumes (this deletes all data)
docker volume rm halal-in-the-city_postgres_data 2>$null
docker volume rm halal-in-the-city_redis_data 2>$null

# Start services
docker-compose up -d

# Wait for services
Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Run migrations and seed
Set-Location backend
npm run migrate
npm run seed
Set-Location ..

Write-Host "Database reset complete!" -ForegroundColor Green
