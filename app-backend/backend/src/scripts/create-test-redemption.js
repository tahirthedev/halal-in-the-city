const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestRedemption() {
  try {
    console.log('🔍 Finding test user and restaurant...');

    // Find the restaurant owner user
    const user = await prisma.user.findFirst({
      where: { email: 'owner@restaurant.com' }
    });

    if (!user) {
      console.log('❌ User not found. Please make sure you have a user with email: owner@restaurant.com');
      return;
    }

    console.log('✅ Found user:', user.email);

    // Find the Halal Bites restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: user.id }
    });

    if (!restaurant) {
      console.log('❌ Restaurant not found. Please create a restaurant first.');
      return;
    }

    console.log('✅ Found restaurant:', restaurant.name);

    // Check if there's a deal
    let deal = await prisma.deal.findFirst({
      where: { restaurantId: restaurant.id }
    });

    // If no deal exists, create one
    if (!deal) {
      console.log('📝 Creating a test deal...');
      
      deal = await prisma.deal.create({
        data: {
          restaurantId: restaurant.id,
          title: 'Test Deal - 20% OFF',
          description: 'Get 20% off on all menu items',
          discountType: 'PERCENTAGE',
          discountValue: 20,
          maxUses: 5,
          usedCount: 0,
          remainingUses: 5,
          perUserLimit: 1,
          code: 'TEST20', // Simple code for testing
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          startsAt: new Date(),
          isActive: true,
          status: 'ACTIVE',
          approvalStatus: 'APPROVED'
        }
      });

      console.log('✅ Created test deal:', deal.title);
    } else {
      console.log('✅ Found existing deal:', deal.title);
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a test redemption
    console.log('🎟️ Creating test redemption with verification code:', verificationCode);

    const redemption = await prisma.redemption.create({
      data: {
        userId: user.id,
        dealId: deal.id,
        code: deal.code, // Add the deal code
        verificationCode: verificationCode,
        status: 'PENDING',
        orderAmount: 50.00,
        discountAmount: 10.00,
        finalAmount: 40.00,
        redeemedAt: new Date()
      }
    });

    console.log('\n✅ SUCCESS! Test redemption created!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 VERIFICATION CODE:', verificationCode);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nRedemption Details:');
    console.log('- ID:', redemption.id);
    console.log('- User:', user.email);
    console.log('- Deal:', deal.title);
    console.log('- Discount:', deal.discountValue + (deal.discountType === 'PERCENTAGE' ? '%' : '$'));
    console.log('- Status:', redemption.status);
    console.log('- Claimed:', redemption.redeemedAt.toLocaleString());
    console.log('\n🎉 You can now use this code in the "Avail Coupons" page!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestRedemption();
