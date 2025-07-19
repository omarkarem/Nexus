import { verifyToken, extractTokenFromHeader } from "../utils/authUtils.js";
import User from "../models/User.js";

/**
 * Middleware to verify JWT token and authenticate user
 * Use this on routes that require authentication
 */
const authenticateToken = async (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      const token = extractTokenFromHeader(authHeader);
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }
      
      // Verify token
      const decoded = verifyToken(token);
      
      // Find user in database (to make sure user still exists)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. User not found.'
        });
      }
      
      // Note: Allow unverified users to access their profile
      // They can see their verification status in the UI
      
      // Add user to request object for use in controllers
      req.user = user;
      next();
      
    } catch (error) {
      console.error('Authentication error:', error.message);
      
      if (error.message === 'Invalid or expired token') {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Invalid or expired token.'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  /**
   * Middleware to check if user has admin role
   * Use this after authenticateToken on admin-only routes
   */
  const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
  };
  
  /**
   * Middleware for optional authentication
   * Won't block request if no token, but will add user if token exists
   */
  const optionalAuth = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = extractTokenFromHeader(authHeader);
      
      if (token) {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user) {
          req.user = user;
        }
      }
      
      next();
    } catch (error) {
      // Don't block request on optional auth failure
      next();
    }
  };

/**
 * Middleware that requires both authentication AND email verification
 * Use this for sensitive operations like creating lists/tasks
 */
const requireEmailVerification = async (req, res, next) => {
  try {
    // First authenticate the user
    await new Promise((resolve, reject) => {
      authenticateToken(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Then check email verification
    if (!req.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address to access this feature.',
        requiresEmailVerification: true
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
};

export { authenticateToken, requireAdmin, optionalAuth, requireEmailVerification };