import nodemailer from 'nodemailer';

/**
 * Create SMTP transporter using user's SMTP settings
 * @returns {Object} - Nodemailer transporter
 */
const createSMTPTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false // For development, set to true in production
    }
  });
};

/**
 * Send email verification email
 * @param {string} email - User's email address
 * @param {string} firstName - User's first name
 * @param {string} verificationToken - Verification token
 */
const sendVerificationEmail = async (email, firstName, verificationToken) => {
  try {
    const transporter = createSMTPTransporter();
    
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"Nexus App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your Email Address - Nexus',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #10B981; text-align: center;">Welcome to Nexus, ${firstName}!</h2>
          <p style="color: #d1d5db; line-height: 1.6;">Thank you for signing up. Please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280; background-color: #374151; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
          
          <p style="color: #f59e0b; font-weight: bold;">This link will expire in 24 hours.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #374151;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            If you didn't create an account with Nexus, please ignore this email.
          </p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} firstName - User's first name
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (email, firstName, resetToken) => {
  try {
    const transporter = createSMTPTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Nexus App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - Nexus',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #EF4444; text-align: center;">Password Reset Request</h2>
          <p style="color: #d1d5db; line-height: 1.6;">Hi ${firstName},</p>
          <p style="color: #d1d5db; line-height: 1.6;">You requested a password reset for your Nexus account. Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280; background-color: #374151; padding: 10px; border-radius: 5px;">${resetUrl}</p>
          
          <p style="color: #f59e0b; font-weight: bold;">⚠️ This link will expire in 10 minutes.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #374151;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send welcome email after successful verification
 * @param {string} email - User's email address
 * @param {string} firstName - User's first name
 */
const sendWelcomeEmail = async (email, firstName) => {
  try {
    const transporter = createSMTPTransporter();
    
    const mailOptions = {
      from: `"Nexus App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Nexus - Let\'s Get Started! 🎉',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #10B981; text-align: center;">Welcome to Nexus, ${firstName}! 🎉</h2>
          <p style="color: #d1d5db; line-height: 1.6;">Your email has been verified and your account is now active!</p>
          
          <p style="color: #d1d5db; line-height: 1.6;">Here's what you can do next:</p>
          <ul style="color: #d1d5db; line-height: 1.8;">
            <li>Create your first task list</li>
            <li>Set up your workspace</li>
            <li>Explore productivity features</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/app/dashboard" 
               style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
          
          <p style="color: #d1d5db; line-height: 1.6;">If you have any questions, feel free to reach out to our support team.</p>
          
          <p style="color: #d1d5db; line-height: 1.6;">Happy organizing!</p>
          <p style="color: #10B981; font-weight: bold;">The Nexus Team</p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw error for welcome email - it's not critical
    return { success: false, error: error.message };
  }
};

export { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail };