-- Seed Test Data for Halal in the City
-- This script creates multiple restaurants with different subscription tiers and various deals

BEGIN;

-- Clear existing data (except admin user)
DELETE FROM redemptions;
DELETE FROM deals;
DELETE FROM notifications;
DELETE FROM restaurants WHERE owner_id NOT IN (SELECT id FROM users WHERE role = 'ADMIN');
DELETE FROM users WHERE role != 'ADMIN';

-- Create Restaurant Owners
INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_active, email_verified, created_at, updated_at)
VALUES 
  ('owner1-test-id-123456', 'owner1@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Ahmed', 'Hassan', '+1-555-0101', 'RESTAURANT_OWNER', true, true, NOW(), NOW()),
  ('owner2-test-id-123456', 'owner2@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Fatima', 'Ali', '+1-555-0102', 'RESTAURANT_OWNER', true, true, NOW(), NOW()),
  ('owner3-test-id-123456', 'owner3@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Mohammed', 'Khan', '+1-555-0103', 'RESTAURANT_OWNER', true, true, NOW(), NOW()),
  ('owner4-test-id-123456', 'owner4@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Aisha', 'Rahman', '+1-555-0104', 'RESTAURANT_OWNER', true, true, NOW(), NOW()),
  ('owner5-test-id-123456', 'owner5@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Omar', 'Syed', '+1-555-0105', 'RESTAURANT_OWNER', true, true, NOW(), NOW());

-- Create Test Users
INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_active, email_verified, created_at, updated_at)
VALUES 
  ('user1-test-id-123456', 'user1@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'John', 'Doe', '+1-555-0201', 'USER', true, true, NOW(), NOW()),
  ('user2-test-id-123456', 'user2@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Jane', 'Smith', '+1-555-0202', 'USER', true, true, NOW(), NOW()),
  ('user3-test-id-123456', 'user3@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Sarah', 'Johnson', '+1-555-0203', 'USER', true, true, NOW(), NOW());

-- Create Restaurants with Different Subscription Tiers

-- 1. Burger O'Clock (FREE tier)
INSERT INTO restaurants (id, name, description, address, city, province, postal_code, phone, email, website, latitude, longitude, cuisine, price_range, halal_certified, owner_id, subscription_tier, is_active, is_approved, created_at, updated_at)
VALUES ('rest1-burger-oclock', 'Burger O''Clock', 'Premium halal burgers and fries made fresh daily', '123 Main St', 'Toronto', 'ON', 'M5V 2T6', '+1-416-555-0101', 'info@burgeroclock.com', 'https://burgeroclock.com', 43.6532, -79.3832, 'Fast Food, Burgers', '$$', true, 'owner1-test-id-123456', 'FREE', true, true, NOW(), NOW());

-- 2. Shawarma Palace (STARTER tier)
INSERT INTO restaurants (id, name, description, address, city, province, postal_code, phone, email, website, latitude, longitude, cuisine, price_range, halal_certified, owner_id, subscription_tier, is_active, is_approved, created_at, updated_at)
VALUES ('rest2-shawarma-palace', 'Shawarma Palace', 'Authentic Middle Eastern shawarma and mezze', '456 Yonge St', 'Toronto', 'ON', 'M4Y 1X5', '+1-416-555-0102', 'info@shawarmapalace.com', 'https://shawarmapalace.com', 43.6708, -79.3873, 'Middle Eastern, Mediterranean', '$$', true, 'owner2-test-id-123456', 'STARTER', true, true, NOW(), NOW());

-- 3. The Halal Guys (GROWTH tier)
INSERT INTO restaurants (id, name, description, address, city, province, postal_code, phone, email, website, latitude, longitude, cuisine, price_range, halal_certified, owner_id, subscription_tier, is_active, is_approved, created_at, updated_at)
VALUES ('rest3-halal-guys', 'The Halal Guys', 'Famous NYC-style platters and gyros', '789 King St W', 'Toronto', 'ON', 'M5V 1M3', '+1-416-555-0103', 'info@thehalalguys.com', 'https://thehalalguys.com', 43.6441, -79.3987, 'Middle Eastern, Street Food', '$$$', true, 'owner3-test-id-123456', 'GROWTH', true, true, NOW(), NOW());

-- 4. Nando's Peri-Peri (GROWTH tier)
INSERT INTO restaurants (id, name, description, address, city, province, postal_code, phone, email, website, latitude, longitude, cuisine, price_range, halal_certified, owner_id, subscription_tier, is_active, is_approved, created_at, updated_at)
VALUES ('rest4-nandos', 'Nando''s Peri-Peri', 'Flame-grilled peri-peri chicken', '321 Queen St W', 'Toronto', 'ON', 'M5V 2A4', '+1-416-555-0104', 'info@nandos.com', 'https://nandos.ca', 43.6503, -79.3890, 'Portuguese, Chicken', '$$', true, 'owner4-test-id-123456', 'GROWTH', true, true, NOW(), NOW());

-- 5. Tandoori Flame (STARTER tier)
INSERT INTO restaurants (id, name, description, address, city, province, postal_code, phone, email, website, latitude, longitude, cuisine, price_range, halal_certified, owner_id, subscription_tier, is_active, is_approved, created_at, updated_at)
VALUES ('rest5-tandoori-flame', 'Tandoori Flame', 'Traditional Indian tandoori and curry', '555 Dundas St W', 'Toronto', 'ON', 'M5T 1H8', '+1-416-555-0105', 'info@tandooriflame.com', 'https://tandooriflame.com', 43.6557, -79.3977, 'Indian, Pakistani', '$$', true, 'owner5-test-id-123456', 'STARTER', true, true, NOW(), NOW());

-- 6. Mediterranean Grill (FREE tier)
INSERT INTO restaurants (id, name, description, address, city, province, postal_code, phone, email, website, latitude, longitude, cuisine, price_range, halal_certified, owner_id, subscription_tier, is_active, is_approved, created_at, updated_at)
VALUES ('rest6-med-grill', 'Mediterranean Grill', 'Fresh Mediterranean cuisine and grilled specialties', '888 Bloor St W', 'Toronto', 'ON', 'M6G 1M1', '+1-416-555-0106', 'info@medgrill.com', 'https://medgrill.com', 43.6629, -79.4103, 'Mediterranean, Greek', '$$', true, 'owner1-test-id-123456', 'FREE', true, true, NOW(), NOW());

-- Create Deals for Each Restaurant

-- Burger O'Clock Deals (FREE tier - 1 active deal limit)
INSERT INTO "Deal" (id, title, description, "discountType", "discountValue", "minOrderAmount", code, "startDate", "expiresAt", "isActive", "isApproved", "remainingUses", "totalUses", "usedCount", "redeemCount", "perUserLimit", "restaurantId", images, "createdAt", "updatedAt")
VALUES 
  ('deal1-burger-bogo', 'Buy One Get One Free', 'Buy any burger and get another burger of equal or lesser value free', 'BOGO', 50, 15.00, 'BOGO-BURGER-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 100, 100, 0, 0, 2, 'rest1-burger-oclock', '["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800"]', NOW(), NOW());

-- Shawarma Palace Deals (STARTER tier - 3 active deals limit)
INSERT INTO "Deal" (id, title, description, "discountType", "discountValue", "minOrderAmount", code, "startDate", "expiresAt", "isActive", "isApproved", "remainingUses", "totalUses", "usedCount", "redeemCount", "perUserLimit", "restaurantId", images, "createdAt", "updatedAt")
VALUES 
  ('deal2-shawarma-20off', '20% Off Lunch Special', 'Get 20% off your entire order during lunch hours (11am-3pm)', 'PERCENTAGE', 20, 12.00, 'LUNCH-20-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 150, 150, 0, 0, 3, 'rest2-shawarma-palace', '["https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800"]', NOW(), NOW()),
  ('deal3-shawarma-combo', '$5 Off Combo Meal', 'Get $5 off any combo meal with fries and drink', 'FIXED', 5, 15.00, 'COMBO-5-2024', NOW(), NOW() + INTERVAL '45 days', true, true, 100, 100, 0, 0, 2, 'rest2-shawarma-palace', '["https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800"]', NOW(), NOW()),
  ('deal4-shawarma-family', 'Family Pack Deal', 'Buy 4 shawarma wraps and get 1 free', 'BOGO', 20, 40.00, 'FAMILY-PACK-2024', NOW(), NOW() + INTERVAL '60 days', true, true, 75, 75, 0, 0, 1, 'rest2-shawarma-palace', '["https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800"]', NOW(), NOW());

-- The Halal Guys Deals (GROWTH tier - unlimited active deals)
INSERT INTO "Deal" (id, title, description, "discountType", "discountValue", "minOrderAmount", code, "startDate", "expiresAt", "isActive", "isApproved", "remainingUses", "totalUses", "usedCount", "redeemCount", "perUserLimit", "restaurantId", images, "createdAt", "updatedAt")
VALUES 
  ('deal5-halal-guys-platter', '$10 Off Large Platter', 'Get $10 off any large chicken or gyro platter', 'FIXED', 10, 18.00, 'PLATTER-10-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 200, 200, 0, 0, 2, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800"]', NOW(), NOW()),
  ('deal6-halal-guys-combo', '25% Off Combo for Two', 'Get 25% off when you order 2 platters with drinks', 'PERCENTAGE', 25, 30.00, 'COMBO-25-2024', NOW(), NOW() + INTERVAL '45 days', true, true, 150, 150, 0, 0, 1, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800"]', NOW(), NOW()),
  ('deal7-halal-guys-student', 'Student Discount', '15% off with valid student ID', 'PERCENTAGE', 15, 10.00, 'STUDENT-15-2024', NOW(), NOW() + INTERVAL '90 days', true, true, 300, 300, 0, 0, 5, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"]', NOW(), NOW()),
  ('deal8-halal-guys-late', 'Late Night Special', '$8 off orders after 10pm', 'FIXED', 8, 15.00, 'LATENIGHT-8-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 100, 100, 0, 0, 3, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"]', NOW(), NOW()),
  ('deal9-halal-guys-weekend', 'Weekend Family Deal', 'Buy 3 platters get 1 free on weekends', 'BOGO', 25, 50.00, 'WEEKEND-BOGO-2024', NOW(), NOW() + INTERVAL '60 days', true, true, 80, 80, 0, 0, 1, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"]', NOW(), NOW());

-- Nando's Deals (GROWTH tier - unlimited active deals)
INSERT INTO "Deal" (id, title, description, "discountType", "discountValue", "minOrderAmount", code, "startDate", "expiresAt", "isActive", "isApproved", "remainingUses", "totalUses", "usedCount", "redeemCount", "perUserLimit", "restaurantId", images, "createdAt", "updatedAt")
VALUES 
  ('deal10-nandos-quarter', 'Free Side with Quarter Chicken', 'Get a free regular side with any quarter chicken order', 'FIXED', 5, 12.00, 'QUARTER-FREE-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 200, 200, 0, 0, 3, 'rest4-nandos', '["https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800"]', NOW(), NOW()),
  ('deal11-nandos-family', '20% Off Family Meal', 'Get 20% off our family meal for 4', 'PERCENTAGE', 20, 45.00, 'FAMILY-20-2024', NOW(), NOW() + INTERVAL '45 days', true, true, 100, 100, 0, 0, 1, 'rest4-nandos', '["https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800"]', NOW(), NOW()),
  ('deal12-nandos-wings', 'BOGO Wings', 'Buy one order of wings, get one free', 'BOGO', 50, 18.00, 'WINGS-BOGO-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 120, 120, 0, 0, 2, 'rest4-nandos', '["https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800"]', NOW(), NOW());

-- Tandoori Flame Deals (STARTER tier - 3 active deals limit)
INSERT INTO "Deal" (id, title, description, "discountType", "discountValue", "minOrderAmount", code, "startDate", "expiresAt", "isActive", "isApproved", "remainingUses", "totalUses", "usedCount", "redeemCount", "perUserLimit", "restaurantId", images, "createdAt", "updatedAt")
VALUES 
  ('deal13-tandoori-lunch', 'Lunch Buffet Special', 'Get $7 off our lunch buffet', 'FIXED', 7, 20.00, 'BUFFET-7-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 100, 100, 0, 0, 2, 'rest5-tandoori-flame', '["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"]', NOW(), NOW()),
  ('deal14-tandoori-dinner', '15% Off Dinner', 'Get 15% off your dinner order (5pm-10pm)', 'PERCENTAGE', 15, 25.00, 'DINNER-15-2024', NOW(), NOW() + INTERVAL '45 days', true, true, 150, 150, 0, 0, 3, 'rest5-tandoori-flame', '["https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800"]', NOW(), NOW()),
  ('deal15-tandoori-biryani', 'Free Raita with Biryani', 'Order any biryani and get free raita', 'FIXED', 3, 15.00, 'BIRYANI-FREE-2024', NOW(), NOW() + INTERVAL '60 days', true, true, 200, 200, 0, 0, 4, 'rest5-tandoori-flame', '["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800"]', NOW(), NOW());

-- Mediterranean Grill Deals (FREE tier - 1 active deal limit)
INSERT INTO "Deal" (id, title, description, "discountType", "discountValue", "minOrderAmount", code, "startDate", "expiresAt", "isActive", "isApproved", "remainingUses", "totalUses", "usedCount", "redeemCount", "perUserLimit", "restaurantId", images, "createdAt", "updatedAt")
VALUES 
  ('deal16-med-grill-gyro', '$6 Off Gyro Platter', 'Get $6 off any gyro platter with rice and salad', 'FIXED', 6, 18.00, 'GYRO-6-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 100, 100, 0, 0, 2, 'rest6-med-grill', '["https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800"]', NOW(), NOW());

COMMIT;

-- Display summary
SELECT 
  'Restaurants Created' as entity, 
  COUNT(*) as count 
FROM "Restaurant"
UNION ALL
SELECT 
  'Deals Created' as entity, 
  COUNT(*) as count 
FROM "Deal"
UNION ALL
SELECT 
  'Restaurant Owners' as entity, 
  COUNT(*) as count 
FROM "User" 
WHERE role = 'RESTAURANT_OWNER'
UNION ALL
SELECT 
  'Test Users' as entity, 
  COUNT(*) as count 
FROM "User" 
WHERE role = 'USER'
UNION ALL
SELECT 
  'Admin Users' as entity, 
  COUNT(*) as count 
FROM "User" 
WHERE role = 'ADMIN';

-- Display restaurants by tier
SELECT 
  "subscriptionTier",
  COUNT(*) as restaurant_count,
  SUM((SELECT COUNT(*) FROM "Deal" WHERE "Deal"."restaurantId" = "Restaurant".id)) as total_deals
FROM "Restaurant"
GROUP BY "subscriptionTier"
ORDER BY 
  CASE "subscriptionTier"
    WHEN 'FREE' THEN 1
    WHEN 'STARTER' THEN 2
    WHEN 'GROWTH' THEN 3
  END;
