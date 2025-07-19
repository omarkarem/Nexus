import { hashPassword, comparePassword, generateToken, generateResetToken, generateVerificationToken } from "../utils/authUtils.js";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "../utils/emailUtils.js";
import User from "../models/User.js";
import crypto from "crypto";


const register = async (req,res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        const existingUser = await User.findOne({email : email.toLowerCase()});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        //hash password
        const hashedPassword = await hashPassword(password);
        //generate verification token
        const {verificationToken, hashedToken} = generateVerificationToken();
        // Create new user
        const user = await User.create({
            firstName : firstName.trim(),
            lastName : lastName.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            emailVerificationToken: hashedToken,
            emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000 // 24 hours,
        });

        // Generate JWT token for immdiate login
        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        //send verification email
        try {
            await sendVerificationEmail(user.email, user.firstName, verificationToken);
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email'
            });
        }

        //return success response
        return res.status(201).json({
            success:true,
            message: 'Registration successful. Please check your email for verification.',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                name: user.fullName,
                email: user.email,
                emailVerified: user.emailVerified,
                role: user.role,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again later.'
        });
    }
}


// Login user
const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        // find user and comapre password
        const user = await User.findOne({email: email.toLowerCase()}).select('+password');

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Compare password
        const isPasswordValid = await comparePassword(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Generate JWT token
        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role || 'user'
        });

        // update last login date
        user.lastLogin = new Date();
        await user.save();

        // return success response
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                emailVerified: user.emailVerified,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed. Please try again later.'
        });
    }
}


// get current user profile
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
                email: user.email,
                emailVerified: user.emailVerified,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch profile. Please try again later.'
        });
    }
}


// Verify email

const verifyEmail = async (req, res) => {
    try {
        const {token} = req.body;
        if(!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        // hash the token to match with the one in the database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        // Find user by hashed token
        const user = await User.findOne({emailVerificationToken : hashedToken, emailVerificationExpire : {$gt : Date.now()}});

        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        // update user emailVerified to true
        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.firstName);
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
          }

        // return success response
        return res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                emailVerified: user.emailVerified
              }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify email. Please try again later.'
        });
    }
}




// Request password reset
const requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      
      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }
      
      // Generate reset token
      const { resetToken, hashedToken } = generateResetToken();
      
      // Save token to user
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
      
      // Send reset email
      try {
        await sendPasswordResetEmail(user.email, user.firstName, resetToken);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send password reset email'
        });
      }
      
      res.json({
        success: true,
        message: 'Password reset email sent successfully'
      });
      
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
      const { token, password } = req.body;
      
      // Hash the token to match stored version
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
      
      // Find user with this token that hasn't expired
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(password);
      
      // Update user
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      res.json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.'
      });
      
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
};


// Logout user
const logout = async (req, res) => {
    try {
      // For now, just return success
      // In the future, you could implement token blacklisting
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
};

export { register, login, getProfile, verifyEmail, requestPasswordReset, resetPassword, logout };