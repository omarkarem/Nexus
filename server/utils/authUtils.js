import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";


/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(12);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Error hashing password');
    }
  };


  
  /**
 * Compare plain text password with hashed password
 * @param {string} candidatePassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match
 */
const comparePassword = async (candidatePassword, hashedPassword) => {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  };
  


  
/**
 * Generate JWT token with user payload
 * @param {Object} payload - User data to include in token
 * @returns {string} - JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE,
        issuer: 'nexus-app'
      }
    );
  };
  

  /**
   * Verify and decode JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} - Decoded token payload
   */
  const verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  };
  

  /**
   * Generate secure random token for password reset
   * Why crypto? Because Math.random() or Date.now() can be predicted by attackers.
   * crypto.randomBytes() generates cryptographically secure random data.
   * @returns {Object} - Object with plain token and hashed token
   */
  const generateResetToken = () => {
    // Generate 20 random bytes, convert to hex = 40 character string
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash the token before storing in database (security best practice)
    // If someone gets access to your database, they can't use the raw tokens
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    return {
      resetToken,      // Send this in email to user
      hashedToken      // Store this in database
    };
  };
  

  /**
   * Generate secure random token for email verification
   * @returns {Object} - Object with plain token and hashed token
   */
  const generateVerificationToken = () => {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    
    return {
      verificationToken,
      hashedToken
    };
  };
  
  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} - Token or null if not found
   */

  const extractTokenFromHeader = (authHeader) => {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  };
  

export { hashPassword, comparePassword, generateToken, verifyToken, generateResetToken, generateVerificationToken, extractTokenFromHeader };