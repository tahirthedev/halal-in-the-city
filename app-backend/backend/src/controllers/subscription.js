const { getTierDetails, getAllTiers } = require('../constants/subscriptionTiers');

/**
 * Get all available subscription tiers
 * GET /api/subscriptions/tiers
 */
const getTiers = async (req, res) => {
  try {
    const tiers = getAllTiers();
    res.json({
      success: true,
      data: tiers,
    });
  } catch (error) {
    console.error('Error getting subscription tiers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription tiers',
    });
  }
};

/**
 * Get specific tier details
 * GET /api/subscriptions/tiers/:tier
 */
const getTierInfo = async (req, res) => {
  try {
    const { tier } = req.params;
    const tierDetails = getTierDetails(tier.toUpperCase());

    if (!tierDetails) {
      return res.status(404).json({
        success: false,
        message: 'Subscription tier not found',
      });
    }

    res.json({
      success: true,
      data: {
        tier: tier.toUpperCase(),
        ...tierDetails,
      },
    });
  } catch (error) {
    console.error('Error getting tier details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tier details',
    });
  }
};

module.exports = {
  getTiers,
  getTierInfo,
};
