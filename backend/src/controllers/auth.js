const authService = require('../services/auth');

class AuthController {
  // POST /api/v1/auth/register
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, phone, role } = req.body;
      
      // Register user
      const user = await authService.registerUser({
        email,
        password,
        firstName,
        lastName,
        phone,
        role: role || 'USER'
      });

      // Generate tokens
      const tokens = authService.generateTokens(user);

      res.status(201).json({
        success: true,
        data: {
          user,
          tokens
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      let statusCode = 500;
      let errorCode = 'INTERNAL_ERROR';
      let errorMessage = 'Registration failed';

      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        statusCode = 409;
        errorCode = 'CONFLICT';
        errorMessage = 'Email address is already registered';
      }

      res.status(statusCode).json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      });
    }
  }

  // POST /api/v1/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Authenticate user
      const user = await authService.authenticateUser(email, password);
      
      // Generate tokens
      const tokens = authService.generateTokens(user);

      res.json({
        success: true,
        data: {
          user,
          tokens
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      
      let statusCode = 401;
      let errorCode = 'UNAUTHORIZED';
      let errorMessage = 'Authentication failed';

      if (error.message === 'INVALID_CREDENTIALS') {
        errorCode = 'INVALID_CREDENTIALS';
        errorMessage = 'Invalid email or password';
      } else if (error.message === 'ACCOUNT_DISABLED') {
        statusCode = 403;
        errorCode = 'ACCOUNT_DISABLED';
        errorMessage = 'Account has been disabled';
      }

      res.status(statusCode).json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      });
    }
  }

  // POST /api/v1/auth/refresh
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      
      // Verify refresh token
      const decoded = authService.verifyToken(refreshToken);
      
      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_INVALID',
            message: 'Invalid refresh token'
          }
        });
      }

      // Get user details
      const user = await authService.getUserById(decoded.id);
      
      // Generate new access token
      const accessToken = authService.generateAccessToken(user);

      res.json({
        success: true,
        data: {
          accessToken
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      
      let errorCode = 'TOKEN_INVALID';
      let errorMessage = 'Invalid refresh token';

      if (error.message === 'TOKEN_EXPIRED') {
        errorCode = 'TOKEN_EXPIRED';
        errorMessage = 'Refresh token has expired';
      } else if (error.message === 'USER_NOT_FOUND') {
        errorCode = 'USER_NOT_FOUND';
        errorMessage = 'User not found';
      } else if (error.message === 'ACCOUNT_DISABLED') {
        errorCode = 'ACCOUNT_DISABLED';
        errorMessage = 'Account has been disabled';
      }

      res.status(401).json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      });
    }
  }

  // POST /api/v1/auth/logout
  async logout(req, res) {
    try {
      // In a production app, you'd invalidate the refresh token here
      // For now, we'll just return success
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Logout failed'
        }
      });
    }
  }

  // GET /api/v1/auth/me
  async getProfile(req, res) {
    try {
      // User is available from auth middleware
      res.json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get user profile'
        }
      });
    }
  }
}

module.exports = new AuthController();
