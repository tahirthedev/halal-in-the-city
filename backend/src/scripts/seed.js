const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@halalinthecity.com' },
    update: {},
    create: {
      email: 'admin@halalinthecity.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create restaurant owner user
  const ownerPassword = await bcrypt.hash('restaurant123', 12);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@restaurant.com' },
    update: {},
    create: {
      email: 'owner@restaurant.com',
      password: ownerPassword,
      firstName: 'Restaurant',
      lastName: 'Owner',
      role: 'RESTAURANT_OWNER',
    },
  });

  // Create test restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { email: 'test@restaurant.com' },
    update: {},
    create: {
      name: 'Halal Bites',
      email: 'test@restaurant.com',
      phone: '+1-416-555-0123',
      address: '123 Main Street',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M5V 1A1',
      description: 'Authentic halal cuisine in downtown Toronto',
      cuisineType: 'MIDDLE_EASTERN',
      latitude: 43.6532,
      longitude: -79.3832,
      averageRating: 4.5,
      totalReviews: 125,
      subscriptionTier: 'SILVER',
      ownerId: owner.id,
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-416-555-0124',
    },
  });

  // Create sample deal
  const deal = await prisma.deal.create({
    data: {
      restaurantId: restaurant.id,
      title: '20% Off Chicken Biryani',
      description: 'Authentic chicken biryani with basmati rice and aromatic spices',
      code: 'BIRYANI20',
      discountType: 'PERCENTAGE',
      discountValue: 20.0,
      minOrderAmount: 15.0,
      maxUses: 100,
      perUserLimit: 1,
      usedCount: 0,
      remainingUses: 100,
      isActive: true,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      terms: 'Valid for dine-in and takeout. Cannot be combined with other offers.',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin: admin@halalinthecity.com / admin123`);
  console.log(`👨‍💼 Owner: owner@restaurant.com / restaurant123`);
  console.log(`🏪 Restaurant: ${restaurant.name} (${restaurant.email})`);
  console.log(`👨‍💼 User: user@example.com / user123`);
  console.log(`🎯 Deal: ${deal.title} (${deal.code})`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
