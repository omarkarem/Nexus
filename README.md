# Nexus - Task Management Application

A modern, responsive task management application built with React, Node.js, and MongoDB.

## 🚀 Features

- **Smart Task Management**: Organize tasks with intelligent prioritization
- **Pomodoro Focus Timer**: Boost productivity with customizable focus sessions
- **Analytics & Insights**: Track productivity patterns and get personalized insights
- **Secure Authentication**: JWT-based authentication with email verification
- **Responsive Design**: Works perfectly on all devices (mobile, tablet, desktop)
- **Real-time Updates**: Instant task synchronization across all views
- **All Lists View**: Special view that aggregates all tasks from all lists

## 🏗️ Tech Stack

### Frontend
- **React 19** with Hooks
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Nodemailer** for email services
- **bcryptjs** for password hashing

## 🔒 Security Audit Results

### ✅ SECURE - Ready for Production

**Environment Variables:**
- ✅ All sensitive data properly externalized
- ✅ No hardcoded secrets found
- ✅ JWT secrets properly configured
- ✅ Database credentials externalized
- ✅ SMTP credentials externalized

**Authentication:**
- ✅ Passwords properly hashed with bcrypt
- ✅ JWT tokens with proper expiration
- ✅ Email verification implemented
- ✅ Password reset functionality
- ✅ Token validation middleware

**API Security:**
- ✅ CORS properly configured
- ✅ Input validation implemented
- ✅ Error handling without sensitive data exposure
- ✅ Rate limiting ready (helmet configured)
- ✅ SQL injection protection (MongoDB)

**Frontend Security:**
- ✅ No sensitive data in client code
- ✅ Proper token storage in localStorage
- ✅ API URL externalized
- ✅ Error handling without data leakage

## 🚀 Deployment Instructions

### Prerequisites
- Vercel account
- MongoDB Atlas account
- Email service (Gmail, SendGrid, etc.)

### 1. Backend Deployment (Railway/Render/Heroku)

1. **Set up your backend hosting service**
2. **Configure environment variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secure-jwt-secret
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-frontend-domain.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   ```

3. **Deploy your server code**

### 2. Frontend Deployment (Vercel)

1. **Connect your GitHub repository to Vercel**
2. **Configure environment variables in Vercel:**
   ```
   REACT_APP_API_URL=https://your-backend-domain.com
   ```
3. **Deploy automatically on push to main branch**

### 3. Domain Configuration

1. **Set up custom domain (optional)**
2. **Update CORS settings in backend**
3. **Update email links in backend**

## 📁 Project Structure

```
Nexus/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Business logic
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── server.js         # Main server file
├── vercel.json           # Vercel configuration
└── env.example           # Environment variables template
```

## 🔧 Development

### Frontend
```bash
cd client
npm install
npm start
```

### Backend
```bash
cd server
npm install
npm run dev
```

## 🧪 Testing

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

## 📝 Environment Variables

Copy `env.example` to `.env` and configure:

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your-development-secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🔒 Security Best Practices

1. **Never commit .env files**
2. **Use strong, unique JWT secrets**
3. **Enable 2FA on email accounts**
4. **Use app-specific passwords for SMTP**
5. **Regularly rotate secrets**
6. **Monitor application logs**
7. **Keep dependencies updated**

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Test in development environment
4. Create detailed issue reports

## 📄 License

This project is licensed under the MIT License. 