const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function approveDeal() {
  try {
    console.log('🔍 Finding deals to approve...');

    // Find all pending deals
    const pendingDeals = await prisma.deal.findMany({
      where: {
        approvalStatus: {
          in: ['PENDING', 'REJECTED']
        }
      },
      include: {
        restaurant: {
          select: {
            name: true
          }
        }
      }
    });

    if (pendingDeals.length === 0) {
      console.log('✅ No pending deals found. All deals are already approved!');
      return;
    }

    console.log(`Found ${pendingDeals.length} deal(s) to approve:\n`);

    for (const deal of pendingDeals) {
      console.log(`  - ${deal.title} (${deal.restaurant.name})`);
    }

    // Approve all pending deals
    const result = await prisma.deal.updateMany({
      where: {
        approvalStatus: {
          in: ['PENDING', 'REJECTED']
        }
      },
      data: {
        approvalStatus: 'APPROVED',
        status: 'ACTIVE',
        isActive: true
      }
    });

    console.log(`\n✅ Successfully approved ${result.count} deal(s)!`);
    console.log('🎉 All deals are now APPROVED and ACTIVE!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

approveDeal();
