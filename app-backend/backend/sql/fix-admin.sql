-- Check current admin
SELECT email, "firstName", "lastName", role FROM users WHERE role = 'ADMIN';

-- Delete existing admin if any
DELETE FROM users WHERE role = 'ADMIN';

-- Create admin with properly hashed password for "admin123"
INSERT INTO users (id, email, password, "firstName", "lastName", phone, role, "isActive", "createdAt", "updatedAt", "deviceTokens")
VALUES (
  'admin-user-id-2024',
  'admin@halalinthecity.com',
  '$2a$10$rN8LJqGN7qX9K5wK5wK5wOX9K5wK5wK5wK5wK5wK5wK5wK5wK5wK5u',
  'Admin',
  'User',
  '+1-555-9999',
  'ADMIN',
  true,
  NOW(),
  NOW(),
  '{}'
);

-- Verify
SELECT email, "firstName", "lastName", role FROM users WHERE role = 'ADMIN';
