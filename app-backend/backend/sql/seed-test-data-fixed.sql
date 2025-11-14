BEGIN;

-- Clear existing data (except admin user)
DELETE FROM redemptions;
DELETE FROM deals;
DELETE FROM notifications;
DELETE FROM restaurants WHERE owner_id NOT IN (SELECT id FROM users WHERE role = 'ADMIN');
DELETE FROM users WHERE role != 'ADMIN';

-- Create Restaurant Owners (password is: Test123!)
INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_active, email_verified, created_at, updated_at)
VALUES 
  ('owner1-test-id-123456', 'owner1@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Ahmed', 'Hassan', '+1-555-0101', 'RESTAURANT_OWNER', true, true, NOW(), NOW()),
  ('owner2-test-id-123456', 'owner2@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Fatima', 'Ali', '+1-555-0102', 'RESTAURANT_OWNER', true, true, NOW(), NOW()),
  ('owner3-test-id-123456', 'owner3@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Mohammed', 'Khan', '+1-555-0103', 'RESTAURANT_OWNER', true, true, NOW(), NOW()),
  ('owner4-test-id-123456', 'owner4@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Aisha', 'Rahman', '+1-555-0104', 'RESTAURANT_OWNER', true, true, NOW(), NOW()),
  ('owner5-test-id-123456', 'owner5@test.com', '$2a$10$XqJy9Z5K5Q5QZ5K5Q5K5K.5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5', 'Omar', 'Syed', '+1-555-0105', 'RESTAURANT_OWNER', true, true, NOW(), NOW());

-- Create Test Users (password is: Test123!)
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
-- Note: Using actual Prisma schema column names

-- Burger O'Clock (FREE tier - 1 deal limit)
INSERT INTO deals (id, title, description, discount_type, discount_value, min_order_amount, code, start_date, expires_at, is_active, is_approved, remaining_uses, total_uses, used_count, redeem_count, per_user_limit, restaurant_id, images, created_at, updated_at)
VALUES ('deal1-burger-bogo', 'Buy One Get One Free - Classic Burger', 'Purchase any classic burger and get another one absolutely free!', 'BOGO', 0, 15.00, 'BURGER-BOGO-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 100, 100, 0, 0, 2, 'rest1-burger-oclock', '["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800"]', NOW(), NOW());

-- Shawarma Palace (STARTER tier - 3 deals limit)
INSERT INTO deals (id, title, description, discount_type, discount_value, min_order_amount, code, start_date, expires_at, is_active, is_approved, remaining_uses, total_uses, used_count, redeem_count, per_user_limit, restaurant_id, images, created_at, updated_at)
VALUES 
  ('deal2-shawarma-20off', '20% Off Any Platter', 'Get 20% discount on any shawarma platter', 'PERCENTAGE', 20, 12.00, 'SHAWARMA-20-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 150, 150, 0, 0, 3, 'rest2-shawarma-palace', '["https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800"]', NOW(), NOW()),
  ('deal3-shawarma-lunch', 'Lunch Special - $5 Off', 'Save $5 on any lunch combo between 11am-2pm', 'FIXED', 5, 10.00, 'LUNCH-5-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 200, 200, 0, 0, 2, 'rest2-shawarma-palace', '["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800"]', NOW(), NOW()),
  ('deal4-shawarma-family', 'Family Pack - 15% Off', 'Get 15% off on family meal for 4', 'PERCENTAGE', 15, 40.00, 'FAMILY-15-2024', NOW(), NOW() + INTERVAL '45 days', true, true, 75, 75, 0, 0, 1, 'rest2-shawarma-palace', '["https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800"]', NOW(), NOW());

-- The Halal Guys (GROWTH tier - unlimited deals)
INSERT INTO deals (id, title, description, discount_type, discount_value, min_order_amount, code, start_date, expires_at, is_active, is_approved, remaining_uses, total_uses, used_count, redeem_count, per_user_limit, restaurant_id, images, created_at, updated_at)
VALUES 
  ('deal5-halal-combo', 'Combo Meal - $4 Off', 'Save $4 on any combo platter with drink', 'FIXED', 4, 12.00, 'COMBO-4-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 250, 250, 0, 0, 3, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"]', NOW(), NOW()),
  ('deal6-halal-student', 'Student Special - 25% Off', 'Show valid student ID for 25% discount', 'PERCENTAGE', 25, 10.00, 'STUDENT-25-2024', NOW(), NOW() + INTERVAL '60 days', true, true, 100, 100, 0, 0, 2, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800"]', NOW(), NOW()),
  ('deal7-halal-large', 'Large Platter - 30% Off', 'Get 30% off on any large-size platter', 'PERCENTAGE', 30, 15.00, 'LARGE-30-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 150, 150, 0, 0, 2, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800"]', NOW(), NOW()),
  ('deal8-halal-bogo-gyro', 'BOGO Gyro Wrap', 'Buy one gyro wrap, get one free', 'BOGO', 0, 10.00, 'GYRO-BOGO-2024', NOW(), NOW() + INTERVAL '20 days', true, true, 80, 80, 0, 0, 1, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800"]', NOW(), NOW()),
  ('deal9-halal-weekend', 'Weekend Special - $6 Off', 'Save $6 on orders over $25 on weekends', 'FIXED', 6, 25.00, 'WEEKEND-6-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 120, 120, 0, 0, 2, 'rest3-halal-guys', '["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"]', NOW(), NOW());

-- Nando's Peri-Peri (GROWTH tier - unlimited deals)
INSERT INTO deals (id, title, description, discount_type, discount_value, min_order_amount, code, start_date, expires_at, is_active, is_approved, remaining_uses, total_uses, used_count, redeem_count, per_user_limit, restaurant_id, images, created_at, updated_at)
VALUES 
  ('deal10-nandos-quarter', 'Quarter Chicken - 15% Off', 'Get 15% off on quarter chicken meal', 'PERCENTAGE', 15, 10.00, 'QUARTER-15-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 200, 200, 0, 0, 3, 'rest4-nandos', '["https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800"]', NOW(), NOW()),
  ('deal11-nandos-half', 'Half Chicken Deal - $5 Off', 'Save $5 on any half chicken platter', 'FIXED', 5, 18.00, 'HALF-5-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 150, 150, 0, 0, 2, 'rest4-nandos', '["https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=800"]', NOW(), NOW()),
  ('deal12-nandos-family', 'Family Feast - 20% Off', 'Get 20% off on family meal for 4', 'PERCENTAGE', 20, 45.00, 'FAMILY-20-2024', NOW(), NOW() + INTERVAL '45 days', true, true, 80, 80, 0, 0, 1, 'rest4-nandos', '["https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800"]', NOW(), NOW());

-- Tandoori Flame (STARTER tier - 3 deals limit)
INSERT INTO deals (id, title, description, discount_type, discount_value, min_order_amount, code, start_date, expires_at, is_active, is_approved, remaining_uses, total_uses, used_count, redeem_count, per_user_limit, restaurant_id, images, created_at, updated_at)
VALUES 
  ('deal13-tandoori-butter', 'Butter Chicken Special - $4 Off', 'Get $4 off on butter chicken meal', 'FIXED', 4, 14.00, 'BUTTER-4-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 120, 120, 0, 0, 2, 'rest5-tandoori-flame', '["https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800"]', NOW(), NOW()),
  ('deal14-tandoori-biryani', 'Biryani Deal - 25% Off', 'Save 25% on any biryani dish', 'PERCENTAGE', 25, 12.00, 'BIRYANI-25-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 100, 100, 0, 0, 3, 'rest5-tandoori-flame', '["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800"]', NOW(), NOW()),
  ('deal15-tandoori-tandoori', 'Tandoori Platter - 20% Off', 'Get 20% off on mixed tandoori platter', 'PERCENTAGE', 20, 20.00, 'TANDOORI-20-2024', NOW(), NOW() + INTERVAL '45 days', true, true, 90, 90, 0, 0, 2, 'rest5-tandoori-flame', '["https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800"]', NOW(), NOW());

-- Mediterranean Grill (FREE tier - 1 deal limit)
INSERT INTO deals (id, title, description, discount_type, discount_value, min_order_amount, code, start_date, expires_at, is_active, is_approved, remaining_uses, total_uses, used_count, redeem_count, per_user_limit, restaurant_id, images, created_at, updated_at)
VALUES ('deal16-medgrill-gyro', 'Greek Gyro Special - $3 Off', 'Save $3 on any gyro wrap', 'FIXED', 3, 11.00, 'GYRO-3-2024', NOW(), NOW() + INTERVAL '30 days', true, true, 130, 130, 0, 0, 2, 'rest6-med-grill', '["https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800"]', NOW(), NOW());

-- Create some sample notifications for restaurant owners
INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
VALUES 
  ('notif1', 'owner1-test-id-123456', 'Welcome to Halal in the City!', 'Your restaurant Burger O''Clock has been approved and is now live.', 'INFO', false, NOW()),
  ('notif2', 'owner2-test-id-123456', 'New Deal Created', 'Your 20% Off Any Platter deal is now active.', 'SUCCESS', false, NOW()),
  ('notif3', 'owner3-test-id-123456', 'Restaurant Approved', 'The Halal Guys has been approved and is visible to users.', 'INFO', false, NOW()),
  ('notif4', 'owner4-test-id-123456', 'Subscription Active', 'Your GROWTH plan subscription is active with unlimited deals.', 'SUCCESS', false, NOW()),
  ('notif5', 'owner5-test-id-123456', 'Deal Expiring Soon', 'Your Butter Chicken Special deal will expire in 7 days.', 'WARNING', false, NOW());

COMMIT;

-- Display summary
SELECT 
  'Restaurants Created' as entity, 
  COUNT(*) as count 
FROM restaurants
UNION ALL
SELECT 
  'Deals Created' as entity, 
  COUNT(*) as count 
FROM deals
UNION ALL
SELECT 
  'Restaurant Owners' as entity, 
  COUNT(*) as count 
FROM users 
WHERE role = 'RESTAURANT_OWNER'
UNION ALL
SELECT 
  'Test Users' as entity, 
  COUNT(*) as count 
FROM users 
WHERE role = 'USER'
UNION ALL
SELECT 
  'Admin Users' as entity, 
  COUNT(*) as count 
FROM users 
WHERE role = 'ADMIN';
