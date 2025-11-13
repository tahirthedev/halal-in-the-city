# Check if deal images are stored in database
docker exec halal_postgres psql -U postgres -d halal_deals -c "SELECT id, title, CASE WHEN images IS NULL THEN 'NULL' WHEN array_length(images, 1) IS NULL THEN 'EMPTY_ARRAY' WHEN array_length(images, 1) = 0 THEN 'ZERO_LENGTH' ELSE 'HAS_DATA' END as images_status FROM deals LIMIT 5"

Write-Host "`n`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
