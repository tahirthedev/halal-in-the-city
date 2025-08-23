const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation
} = require('../middleware/validation');

// POST /api/v1/auth/register
router.post('/register', registerValidation, authController.register);

// POST /api/v1/auth/login
router.post('/login', loginValidation, authController.login);

// POST /api/v1/auth/refresh
router.post('/refresh', refreshTokenValidation, authController.refresh);

// POST /api/v1/auth/logout
router.post('/logout', authenticate, authController.logout);

// GET /api/v1/auth/me
router.get('/me', authenticate, authController.getProfile);

module.exports = router;
