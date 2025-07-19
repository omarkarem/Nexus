import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    // Basic Info (from signup form)
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [30, 'First name cannot exceed 30 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [30, 'Last name cannot exceed 30 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    
    // Profile Info (for UserProfile component)
    avatar: {
      type: String, // URL to profile image
      default: null
    },
    
    // Auth & Security (from login features)
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    
    // Password Reset (for "Forgot Password" feature)
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    // User Activity
    lastLogin: {
      type: Date,
      default: null
    },
    
    // User Preferences (for future dashboard/settings)
    preferences: {
      theme: {
        type: String,
        enum: ['dark', 'light'],
        default: 'dark'
      },
      timezone: {
        type: String,
        default: 'UTC'
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      }
    }
  }, {
    timestamps: true
  });
  
  // Indexes
  userSchema.index({ email: 1 });
  userSchema.index({ resetPasswordToken: 1 });
  userSchema.index({ emailVerificationToken: 1 });

  // Virtual for full name (used in UserProfile component)
  userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
  });

  // Ensure virtual fields are serialized
  userSchema.set('toJSON', { virtuals: true });
  
  export default mongoose.model('User', userSchema);