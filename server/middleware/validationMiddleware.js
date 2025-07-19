import { validateLoginData, validateRegistrationData, sanitizeUserInput } from "../utils/validationUtils.js";

/**
 * Middleware to validate user registration data
 */
const validateRegistration = (req, res, next) => {
    try {
      // Sanitize input first
      req.body = sanitizeUserInput(req.body);
      
      // Validate the data
      const validation = validateRegistrationData(req.body);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }
      
      // If validation passes, continue to controller
      next();
      
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  /**
   * Middleware to validate user login data
   */
  const validateLogin = (req, res, next) => {
    try {
      // Sanitize input first
      req.body = sanitizeUserInput(req.body);
      
      // Validate the data
      const validation = validateLoginData(req.body);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }
      
      // If validation passes, continue to controller
      next();
      
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  /**
   * Middleware to validate password reset request
   */
  const validatePasswordResetRequest = (req, res, next) => {
    try {
      req.body = sanitizeUserInput(req.body);
      
      const { email } = req.body;
      
      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }
      
      // Basic email format check
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }
      
      next();
      
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  /**
   * Middleware to validate password reset submission
   */
  const validatePasswordReset = (req, res, next) => {
    try {
      req.body = sanitizeUserInput(req.body);
      
      const { token, password } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Reset token is required'
        });
      }
      
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'New password is required'
        });
      }
      
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }
      
      next();
      
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  /**
   * General purpose sanitization middleware
   * Use this on any route to clean user input
   */
  const sanitizeInput = (req, res, next) => {
    if (req.body) {
      req.body = sanitizeUserInput(req.body);
    }
    next();
  };


export { validateRegistration, validateLogin, validatePasswordResetRequest, validatePasswordReset, sanitizeInput };