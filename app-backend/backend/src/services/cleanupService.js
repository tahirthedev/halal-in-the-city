const databaseService = require('./database');
const prisma = databaseService.getClient();

/**
 * Cleanup Service
 * Handles periodic cleanup tasks like removing expired redemptions
 */

/**
 * Clean up expired pending redemptions and restore deal counts
 */
const cleanupExpiredRedemptions = async () => {
  try {
    console.log('🧹 Starting cleanup of expired pending redemptions...');
    
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find all expired pending redemptions
    const expiredRedemptions = await prisma.redemption.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: twentyFourHoursAgo
        }
      },
      select: {
        id: true,
        dealId: true,
        verificationCode: true
      }
    });

    if (expiredRedemptions.length === 0) {
      console.log('✅ No expired pending redemptions found');
      return { cleaned: 0 };
    }

    console.log(`📋 Found ${expiredRedemptions.length} expired pending redemptions`);

    // Group by dealId to batch restore counts
    const dealCounts = {};
    expiredRedemptions.forEach(redemption => {
      dealCounts[redemption.dealId] = (dealCounts[redemption.dealId] || 0) + 1;
    });

    // Delete expired redemptions and restore counts in transaction
    await prisma.$transaction(async (tx) => {
      // Delete all expired redemptions
      await tx.redemption.deleteMany({
        where: {
          id: {
            in: expiredRedemptions.map(r => r.id)
          }
        }
      });

      // Restore counts for each deal
      for (const [dealId, count] of Object.entries(dealCounts)) {
        await tx.deal.update({
          where: { id: dealId },
          data: {
            remainingUses: { increment: count }
          }
        });
        console.log(`  ✅ Restored ${count} uses for deal ${dealId}`);
      }
    });

    console.log(`✅ Cleaned up ${expiredRedemptions.length} expired redemptions`);
    
    return {
      cleaned: expiredRedemptions.length,
      dealsUpdated: Object.keys(dealCounts).length
    };
  } catch (error) {
    console.error('❌ Error cleaning up expired redemptions:', error);
    throw error;
  }
};

/**
 * Start periodic cleanup (runs every hour)
 */
const startPeriodicCleanup = () => {
  console.log('🚀 Starting periodic cleanup service (runs every hour)');
  
  // Run immediately on start
  cleanupExpiredRedemptions().catch(err => {
    console.error('Error in initial cleanup:', err);
  });

  // Then run every hour
  setInterval(() => {
    cleanupExpiredRedemptions().catch(err => {
      console.error('Error in periodic cleanup:', err);
    });
  }, 60 * 60 * 1000); // Every hour
};

module.exports = {
  cleanupExpiredRedemptions,
  startPeriodicCleanup
};
