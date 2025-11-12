/**
 * Subscription Tier Configuration
 * Defines pricing and features for each tier
 */

const SUBSCRIPTION_TIERS = {
  STARTER: {
    name: 'Starter',
    regularPrice: 89.0,
    promoPrice: 49.99,
    dealLimit: 1,
    features: [
      '1 featured coupon',
      '1 active push campaign',
      'Basic analytics',
      'Listing in category & map',
    ],
    description: 'Perfect for restaurants just getting started with digital promotions',
  },
  GROWTH: {
    name: 'Growth',
    regularPrice: 99.0,
    promoPrice: 79.99,
    dealLimit: 3,
    features: [
      'Up to 3 featured coupons',
      '3 active push campaigns',
      'Advanced analytics',
      'Priority listing in category & map',
      'Customer insights',
    ],
    description: 'Ideal for growing restaurants looking to maximize customer engagement',
  },
};

/**
 * Get subscription tier details by tier name
 * @param {string} tier - The tier name (STARTER or GROWTH)
 * @returns {object} Tier details
 */
const getTierDetails = (tier) => {
  return SUBSCRIPTION_TIERS[tier] || null;
};

/**
 * Get all available subscription tiers
 * @returns {array} Array of tier objects
 */
const getAllTiers = () => {
  return Object.keys(SUBSCRIPTION_TIERS).map((key) => ({
    tier: key,
    ...SUBSCRIPTION_TIERS[key],
  }));
};

/**
 * Validate if a tier is valid
 * @param {string} tier - The tier name to validate
 * @returns {boolean} True if valid, false otherwise
 */
const isValidTier = (tier) => {
  return Object.keys(SUBSCRIPTION_TIERS).includes(tier);
};

/**
 * Get deal limit for a specific tier
 * @param {string} tier - The tier name
 * @returns {number} Deal limit for the tier
 */
const getDealLimit = (tier) => {
  const tierDetails = getTierDetails(tier);
  return tierDetails ? tierDetails.dealLimit : 0;
};

module.exports = {
  SUBSCRIPTION_TIERS,
  getTierDetails,
  getAllTiers,
  isValidTier,
  getDealLimit,
};
