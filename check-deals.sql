SELECT id, title, "isActive", "startsAt", "expiresAt", "createdAt" 
FROM deals 
ORDER BY "createdAt" DESC 
LIMIT 5;
