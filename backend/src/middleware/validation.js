const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorDetails = {};
    errors.array().forEach(error => {
      errorDetails[error.path] = error.msg;
    });

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: errorDetails
      }
    });
  }
  
  next();
};

// Common validation rules
const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Valid email address is required');

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number');

const nameValidation = (field) => body(field)
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage(`${field} must be between 2 and 50 characters`);

const phoneValidation = body('phone')
  .optional()
  .isMobilePhone()
  .withMessage('Valid phone number is required');

const roleValidation = body('role')
  .optional()
  .isIn(['USER', 'RESTAURANT_OWNER', 'ADMIN'])
  .withMessage('Role must be USER, RESTAURANT_OWNER, or ADMIN');

// Auth validation rules
const registerValidation = [
  emailValidation,
  passwordValidation,
  nameValidation('firstName'),
  nameValidation('lastName'),
  phoneValidation,
  roleValidation,
  handleValidationErrors
];

const loginValidation = [
  emailValidation,
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  handleValidationErrors
];

// Restaurant validation rules
const restaurantValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('cuisineType')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Cuisine type is required'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Valid address is required'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City is required'),
  body('province')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Province must be between 2 and 50 characters'),
  body('postalCode')
    .trim()
    .matches(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/)
    .withMessage('Valid Canadian postal code is required'),
  body('phone')
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address is required'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Valid website URL is required'),
  body('subscriptionTier')
    .optional()
    .isIn(['BRONZE', 'SILVER', 'GOLD', 'DIAMOND'])
    .withMessage('Subscription tier must be BRONZE, SILVER, GOLD, or DIAMOND'),
  handleValidationErrors
];

// Deal validation rules
const dealValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('discountType')
    .isIn(['PERCENTAGE', 'FIXED', 'BOGO'])
    .withMessage('Discount type must be PERCENTAGE, FIXED, or BOGO'),
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('minOrderAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order amount must be a positive number'),
  body('maxUses')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum uses must be a positive integer'),
  body('perUserLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Per user limit must be a positive integer'),
  body('expiresAt')
    .isISO8601()
    .withMessage('Valid expiration date is required')
    .custom((value) => {
      const expirationDate = new Date(value);
      const now = new Date();
      if (expirationDate <= now) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    }),
  body('startsAt')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('terms')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Terms must be less than 1000 characters'),
  body('restaurantId')
    .isString()
    .notEmpty()
    .withMessage('Valid restaurant ID is required'),
  handleValidationErrors
];

// Redemption validation rules
const redemptionValidation = [
  body('dealId')
    .isString()
    .notEmpty()
    .withMessage('Deal ID is required'),
  body('code')
    .isString()
    .notEmpty()
    .withMessage('Deal code is required'),
  body('orderAmount')
    .isFloat({ min: 0.01 })
    .withMessage('Order amount must be greater than 0'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  handleValidationErrors
];

// Pagination validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
];

// ID parameter validation
const idValidation = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('Valid ID is required'),
  handleValidationErrors
];

// Deal update validation (similar to dealValidation but all fields optional)
const dealUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('discountType')
    .optional()
    .isIn(['PERCENTAGE', 'FIXED', 'BOGO'])
    .withMessage('Discount type must be PERCENTAGE, FIXED, or BOGO'),
  body('discountValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('minOrderAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order amount must be a positive number'),
  body('maxUses')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum uses must be a positive integer'),
  body('perUserLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Per user limit must be a positive integer'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Valid expiration date is required')
    .custom((value) => {
      if (value) {
        const expirationDate = new Date(value);
        const now = new Date();
        if (expirationDate <= now) {
          throw new Error('Expiration date must be in the future');
        }
      }
      return true;
    }),
  body('terms')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Terms must be less than 1000 characters'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  restaurantValidation,
  dealValidation,
  dealUpdateValidation,
  redemptionValidation,
  paginationValidation,
  idValidation
};
