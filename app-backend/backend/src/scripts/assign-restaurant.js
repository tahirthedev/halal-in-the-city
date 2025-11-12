const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function assignRestaurant() {
  try {
    // Find the merchant
    const merchant = await prisma.user.findUnique({
      where: { email: 'owner@restaurant.com' },
      include: { restaurants: true }
    });

    if (!merchant) {
      console.log('❌ Merchant not found!');
      return;
    }

    console.log('✅ Merchant found:', merchant.email);
    console.log('Current restaurants:', merchant.restaurants.length);

    // Check if they already have a restaurant
    if (merchant.restaurants.length > 0) {
      console.log('Merchant already has restaurants:');
      merchant.restaurants.forEach(r => {
        console.log(`  - ${r.name} (${r.approvalStatus})`);
      });

      // Update first restaurant to APPROVED if not already
      const restaurant = merchant.restaurants[0];
      if (restaurant.approvalStatus !== 'APPROVED') {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: {
            approvalStatus: 'APPROVED',
            approvedBy: 'admin@halalinthecity.com',
            approvedAt: new Date()
          }
        });
        console.log(`✅ Approved restaurant: ${restaurant.name}`);
      }
    } else {
      // Create a new test restaurant
      const newRestaurant = await prisma.restaurant.create({
        data: {
          name: 'Test Halal Restaurant',
          description: 'A test restaurant for development purposes',
          cuisine: 'Mediterranean',
          address: '123 Test Street, Test City',
          city: 'Test City',
          state: 'CA',
          zipCode: '90210',
          phone: '555-0123',
          email: 'test@restaurant.com',
          website: 'https://testrestaurant.com',
          ownerId: merchant.id,
          approvalStatus: 'APPROVED',
          approvedBy: 'admin@halalinthecity.com',
          approvedAt: new Date(),
          latitude: 34.0522,
          longitude: -118.2437,
          operatingHours: {
            monday: '9:00 AM - 10:00 PM',
            tuesday: '9:00 AM - 10:00 PM',
            wednesday: '9:00 AM - 10:00 PM',
            thursday: '9:00 AM - 10:00 PM',
            friday: '9:00 AM - 11:00 PM',
            saturday: '10:00 AM - 11:00 PM',
            sunday: '10:00 AM - 9:00 PM'
          }
        }
      });

      console.log('✅ Created and approved new restaurant:', newRestaurant.name);
      console.log('   Restaurant ID:', newRestaurant.id);
    }

    // Show final state
    const updatedMerchant = await prisma.user.findUnique({
      where: { email: 'owner@restaurant.com' },
      include: {
        restaurants: {
          where: { approvalStatus: 'APPROVED' }
        }
      }
    });

    console.log('\n📊 Final state:');
    console.log(`Merchant: ${updatedMerchant.email}`);
    console.log(`Approved restaurants: ${updatedMerchant.restaurants.length}`);
    updatedMerchant.restaurants.forEach(r => {
      console.log(`  ✓ ${r.name} (ID: ${r.id})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

assignRestaurant();
