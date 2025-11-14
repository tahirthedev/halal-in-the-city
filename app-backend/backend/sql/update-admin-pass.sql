UPDATE users SET password = '$2a$10$esvzttzbMMpqZXu67sV9V.E.aUY5m0l05pYxs6TLNHhjSIGpH3X/e' WHERE email = 'admin@halalinthecity.com';
SELECT email, "firstName", "lastName", role FROM users WHERE role = 'ADMIN';
