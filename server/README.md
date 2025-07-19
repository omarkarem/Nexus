# Nexus Backend API

Backend API for the Nexus Task Management Application built with Node.js, Express, and MongoDB using MVC architecture.

## 🏗️ Project Structure

```
server/
├── config/              # Configuration files
│   └── database.js      # Database connection setup
├── controllers/         # Business logic (Controller layer)
│   ├── auth/           # Authentication controllers
│   ├── lists/          # List management controllers
│   └── tasks/          # Task management controllers
├── middleware/         # Custom middleware
│   ├── auth/           # Authentication middleware
│   └── validation/     # Input validation middleware
├── models/             # Database models (Model layer)
│   ├── User.js         # User model
│   ├── List.js         # List model
│   └── Task.js         # Task model
├── routes/             # API routes (connects to controllers)
│   ├── auth/           # Authentication routes
│   ├── lists/          # List routes
│   └── tasks/          # Task routes
├── utils/              # Utility functions
│   └── helpers/        # Helper functions
├── tests/              # Test files
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── server.js           # Main server file
├── package.json        # Dependencies and scripts
└── env.example         # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Then edit `.env` with your actual configuration values.

3. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Lists
- `GET /api/lists` - Get all user lists
- `POST /api/lists` - Create new list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list

### Tasks
- `GET /api/tasks/:listId` - Get all tasks for a list
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🧪 Testing

```bash
npm test
```

## 📝 Development Notes

- Follow MVC architecture pattern
- Use async/await for database operations
- Implement proper error handling
- Add input validation for all endpoints
- Use JWT for authentication
- Implement rate limiting for security 