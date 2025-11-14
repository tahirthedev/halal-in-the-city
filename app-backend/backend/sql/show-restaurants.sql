SELECT 
  name, 
  "subscriptionTier" as tier, 
  (SELECT COUNT(*) FROM deals WHERE "restaurantId" = restaurants.id) as deal_count 
FROM restaurants 
ORDER BY "subscriptionTier", name;
