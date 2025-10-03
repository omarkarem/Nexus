# 📋 Nexus - Advanced Task Management Application

A modern, real-time task management application built with React, Node.js, and WebSockets. Features collaborative list management, drag-and-drop functionality, and AWS S3 integration for custom list icons.

## 🚀 **Features**

### ✨ **Core Functionality**
- **Real-time Collaboration**: WebSocket-powered live updates across all connected clients
- **Kanban Board Interface**: Drag-and-drop tasks between different boards (This Week, Next Week, Done)
- **List Management**: Create, edit, and delete custom lists with colors and images
- **Task Management**: Full CRUD operations for tasks and subtasks
- **AWS S3 Integration**: Upload and display custom images for lists
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎯 **Advanced Features**
- **All Lists View**: Unified view showing tasks from all lists
- **Subtask Support**: Nested task management with completion tracking
- **Bulk Operations**: Delete all completed tasks at once
- **Image Support**: Custom list icons with S3 storage
- **Real-time Sync**: Instant updates without page refreshes
- **Optimized Performance**: Efficient state management and API calls

---

## 🏗️ **Architecture Overview**

### **Frontend (React)**
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── lists/          # List-related components
│   │   ├── tasks/          # Task-related components
│   │   └── ui/             # Generic UI components
│   ├── hooks/              # Custom React hooks
│   │   ├── useListData.js  # Main data management hook
│   │   └── useSocket.js    # WebSocket connection hook
│   ├── utils/              # API utilities and helpers
│   │   ├── listApi.js      # List API functions
│   │   ├── taskApi.js      # Task API functions
│   │   └── listUtils.js    # List utility functions
│   └── App.js              # Main application component
```

### **Backend (Node.js + Express)**
```
server/
├── controllers/            # Request handlers
│   ├── listController.js   # List CRUD operations
│   └── taskController.js   # Task CRUD operations
├── config/                 # Configuration files
│   ├── database.js         # MongoDB connection
│   ├── s3.js              # AWS S3 configuration
│   └── socket.js          # WebSocket server setup
├── models/                 # Database models
│   ├── List.js            # List schema
│   └── Task.js            # Task schema
├── routes/                 # API routes
│   ├── lists.js           # List endpoints
│   └── tasks.js           # Task endpoints
└── server.js              # Main server file
```

---

## 🔧 **Technology Stack**

### **Frontend**
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Socket.IO Client**: Real-time WebSocket communication
- **React DnD**: Drag and drop functionality
- **Axios**: HTTP client for API requests

### **Backend**
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **Socket.IO**: Real-time bidirectional event-based communication
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **Multer**: Middleware for handling multipart/form-data (file uploads)
- **AWS SDK**: Integration with Amazon S3 for file storage

### **Infrastructure**
- **AWS S3**: Cloud storage for list images
- **MongoDB Atlas**: Cloud database service
- **PM2**: Production process manager
- **Nginx**: Web server and reverse proxy
- **Let's Encrypt**: SSL certificate management

---

## 📚 **Core Components Documentation**

### **1. useListData Hook** (`client/src/hooks/useListData.js`)

The main data management hook that handles all list and task operations.

#### **State Management**
```javascript
const [lists, setLists] = useState([]);     // All lists with their tasks
const [loading, setLoading] = useState(true); // Loading state
const [error, setError] = useState(null);   // Error messages
```

#### **Key Functions**

##### **List Management**
```javascript
// Create a new list
const createList = async (listTitle, listColor, description, imageFile)
// Parameters:
// - listTitle: string - The name of the list
// - listColor: string - Hex color code for the list
// - description: string - Optional description
// - imageFile: File - Optional image file for S3 upload
// Returns: Promise<Object|null> - Created list object or null if failed

// Edit an existing list
const editList = async (listId, newTitle, newColor, newDescription, imageFile)
// Parameters:
// - listId: string - ID of the list to edit
// - newTitle: string - New list title
// - newColor: string - New hex color code
// - newDescription: string - New description
// - imageFile: File - Optional new image file
// Returns: Promise<void>

// Delete a list
const deleteList = async (listId)
// Parameters:
// - listId: string - ID of the list to delete
// Returns: Promise<void>
```

##### **Task Management**
```javascript
// Add a new task
const addTask = async (taskTitle, boardId, targetListId)
// Parameters:
// - taskTitle: string - The title of the task
// - boardId: string - Board identifier ('thisWeek', 'nextWeek', 'Done')
// - targetListId: string - ID of the list to add the task to
// Returns: Promise<void>

// Toggle task completion
const toggleTaskComplete = async (taskId, listId)
// Parameters:
// - taskId: string - ID of the task to toggle
// - listId: string - ID of the list containing the task
// Returns: Promise<void>

// Delete a task
const deleteTask = async (taskId, listId)
// Parameters:
// - taskId: string - ID of the task to delete
// - listId: string - ID of the list containing the task
// Returns: Promise<void>

// Update task title
const updateTaskTitle = async (taskId, newTitle, listId)
// Parameters:
// - taskId: string - ID of the task to update
// - newTitle: string - New title for the task
// - listId: string - ID of the list containing the task
// Returns: Promise<void>

// Update task note
const updateTaskNote = async (taskId, boardId, noteText, listId)
// Parameters:
// - taskId: string - ID of the task to update
// - boardId: string - Board identifier
// - noteText: string - New note content
// - listId: string - ID of the list containing the task
// Returns: Promise<void>
```

##### **Subtask Management**
```javascript
// Add a new subtask
const addSubTask = async (taskId, subTaskTitle, listId)
// Parameters:
// - taskId: string - ID of the parent task
// - subTaskTitle: string - Title of the subtask
// - listId: string - ID of the list containing the task
// Returns: Promise<void>

// Toggle subtask completion
const toggleSubTaskComplete = async (taskId, subTaskId, listId)
// Parameters:
// - taskId: string - ID of the parent task
// - subTaskId: string - ID of the subtask to toggle
// - listId: string - ID of the list containing the task
// Returns: Promise<void>

// Delete a subtask
const deleteSubtask = async (taskId, subTaskId, listId)
// Parameters:
// - taskId: string - ID of the parent task
// - subTaskId: string - ID of the subtask to delete
// - listId: string - ID of the list containing the task
// Returns: Promise<void>

// Update subtask title
const updateSubtaskTitle = async (taskId, subTaskId, newTitle, listId)
// Parameters:
// - taskId: string - ID of the parent task
// - subTaskId: string - ID of the subtask to update
// - newTitle: string - New title for the subtask
// - listId: string - ID of the list containing the task
// Returns: Promise<void>
```

##### **Drag and Drop Functions**
```javascript
// Move task within same list (reorder)
const moveTask = async (taskId, newOrder, listId)
// Parameters:
// - taskId: string - ID of the task to move
// - newOrder: number - New position in the list
// - listId: string - ID of the list
// Returns: Promise<void>

// Move task to different board
const moveTaskCrossBoard = async (taskId, newBoard, newOrder, listId)
// Parameters:
// - taskId: string - ID of the task to move
// - newBoard: string - Target board ('thisWeek', 'nextWeek', 'Done')
// - newOrder: number - New position in the target board
// - listId: string - ID of the list
// Returns: Promise<void>

// Reorder tasks in All Lists view
const reorderTasksAllLists = async (taskId, newOrder)
// Parameters:
// - taskId: string - ID of the task to reorder
// - newOrder: number - New position in All Lists
// Returns: Promise<void>
```

### **2. useSocket Hook** (`client/src/hooks/useSocket.js`)

Manages WebSocket connections for real-time updates.

#### **Connection Management**
```javascript
const useSocket = (user, eventHandlers)
// Parameters:
// - user: Object - User object with authentication token
// - eventHandlers: Object - Map of event names to handler functions
// Returns: Socket.IO client instance

// Usage example:
const socketEventHandlers = {
  [SOCKET_EVENTS.TASK_CREATED]: (data) => {
    // Handle task creation
  },
  [SOCKET_EVENTS.TASK_UPDATED]: (data) => {
    // Handle task updates
  }
};

const socket = useSocket(user, socketEventHandlers);
```

#### **WebSocket Events**
```javascript
// Available socket events (defined in SOCKET_EVENTS):
SOCKET_EVENTS = {
  // Task events
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated', 
  TASK_DELETED: 'task:deleted',
  TASK_MOVED: 'task:moved',
  TASK_REORDERED: 'task:reordered',
  TASKS_DELETED_BULK: 'tasks:deleted_bulk',
  
  // Subtask events
  SUBTASK_CREATED: 'subtask:created',
  SUBTASK_UPDATED: 'subtask:updated',
  SUBTASK_DELETED: 'subtask:deleted',
  
  // List events
  LIST_CREATED: 'list:created',
  LIST_UPDATED: 'list:updated',
  LIST_DELETED: 'list:deleted'
};
```

### **3. API Utilities**

#### **List API** (`client/src/utils/listApi.js`)
```javascript
// Fetch all lists for the current user
const fetchLists = async ()
// Returns: Promise<Array> - Array of list objects

// Create a new list
const createList = async (title, color, description, imageFile)
// Parameters:
// - title: string - List title
// - color: string - Hex color code
// - description: string - List description
// - imageFile: File - Optional image file
// Returns: Promise<Object> - Created list object

// Update an existing list
const updateList = async (listId, title, color, description, imageFile)
// Parameters:
// - listId: string - ID of list to update
// - title: string - New title
// - color: string - New color
// - description: string - New description
// - imageFile: File - Optional new image
// Returns: Promise<Object> - Updated list object

// Delete a list
const deleteList = async (listId)
// Parameters:
// - listId: string - ID of list to delete
// Returns: Promise<void>
```

#### **Task API** (`client/src/utils/taskApi.js`)
```javascript
// Fetch tasks for a specific list
const fetchTasksByList = async (listId)
// Parameters:
// - listId: string - ID of the list
// Returns: Promise<Array> - Array of task objects

// Fetch all tasks for the current user
const fetchAllTasksForUser = async ()
// Returns: Promise<Array> - Array of all user's tasks with list info

// Create a new task
const createTask = async (title, board, listId)
// Parameters:
// - title: string - Task title
// - board: string - Board identifier
// - listId: string - ID of the parent list
// Returns: Promise<Object> - Created task object

// Update a task
const updateTask = async (taskId, updates)
// Parameters:
// - taskId: string - ID of task to update
// - updates: Object - Fields to update
// Returns: Promise<Object> - Updated task object

// Delete a task
const deleteTask = async (taskId)
// Parameters:
// - taskId: string - ID of task to delete
// Returns: Promise<void>

// Move a task to a different board
const moveTask = async (taskId, newBoard, newOrder, listId)
// Parameters:
// - taskId: string - ID of task to move
// - newBoard: string - Target board
// - newOrder: number - New position
// - listId: string - ID of the list
// Returns: Promise<Object> - Updated task object

// Reorder tasks within a list
const reorderTasks = async (listId, taskId, newOrder)
// Parameters:
// - listId: string - ID of the list
// - taskId: string - ID of task to reorder
// - newOrder: number - New position
// Returns: Promise<void>

// Reorder tasks in All Lists view
const reorderTasksAllLists = async (taskId, newOrder)
// Parameters:
// - taskId: string - ID of task to reorder
// - newOrder: number - New position in All Lists
// Returns: Promise<void>

// Add a subtask
const addSubTask = async (taskId, title)
// Parameters:
// - taskId: string - ID of parent task
// - title: string - Subtask title
// Returns: Promise<Object> - Created subtask object

// Update a subtask
const updateSubTask = async (taskId, subTaskId, updates)
// Parameters:
// - taskId: string - ID of parent task
// - subTaskId: string - ID of subtask to update
// - updates: Object - Fields to update
// Returns: Promise<Object> - Updated subtask object

// Delete a subtask
const deleteSubTask = async (taskId, subTaskId)
// Parameters:
// - taskId: string - ID of parent task
// - subTaskId: string - ID of subtask to delete
// Returns: Promise<void>

// Delete all completed tasks
const deleteAllCompletedTasks = async (listId)
// Parameters:
// - listId: string - ID of list ('all' for all lists)
// Returns: Promise<Object> - Result with deletedCount
```

---

## 🗄️ **Database Schema**

### **List Model** (`server/models/List.js`)
```javascript
{
  _id: ObjectId,              // Unique identifier
  title: String,              // List name (required)
  description: String,        // List description
  color: String,              // Hex color code (required)
  imageUrl: String,           // S3 URL for list image
  user: ObjectId,             // Reference to User model
  isAllLists: Boolean,        // Special flag for "All Lists" view
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

### **Task Model** (`server/models/Task.js`)
```javascript
{
  _id: ObjectId,              // Unique identifier
  title: String,              // Task title (required)
  note: String,               // Task description/note
  completed: Boolean,         // Completion status
  board: String,              // Board identifier ('thisWeek', 'nextWeek', 'Done')
  order: Number,              // Position within board
  allListsOrder: Number,      // Position in All Lists view
  list: ObjectId,             // Reference to List model
  user: ObjectId,             // Reference to User model
  subTasks: [{               // Array of subtasks
    _id: ObjectId,            // Subtask ID
    title: String,            // Subtask title
    completed: Boolean,       // Subtask completion status
    createdAt: Date,          // Subtask creation date
    updatedAt: Date           // Subtask update date
  }],
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

---

## 🔌 **WebSocket Implementation**

### **Server-Side** (`server/config/socket.js`)

#### **Socket Events Emitted by Server**
```javascript
// Task events
emitToUser(userId, SOCKET_EVENTS.TASK_CREATED, { task, listId });
emitToUser(userId, SOCKET_EVENTS.TASK_UPDATED, { task });
emitToUser(userId, SOCKET_EVENTS.TASK_DELETED, { taskId });
emitToUser(userId, SOCKET_EVENTS.TASK_MOVED, { task });
emitToUser(userId, SOCKET_EVENTS.TASK_REORDERED, { type, listId });
emitToUser(userId, SOCKET_EVENTS.TASKS_DELETED_BULK, { listId, isAllLists, deletedCount });

// Subtask events
emitToUser(userId, SOCKET_EVENTS.SUBTASK_CREATED, { taskId, subTask });
emitToUser(userId, SOCKET_EVENTS.SUBTASK_UPDATED, { taskId, subTask });
emitToUser(userId, SOCKET_EVENTS.SUBTASK_DELETED, { taskId, subTaskId });

// List events
emitToUser(userId, SOCKET_EVENTS.LIST_CREATED, { list });
emitToUser(userId, SOCKET_EVENTS.LIST_UPDATED, { list });
emitToUser(userId, SOCKET_EVENTS.LIST_DELETED, { listId });
```

#### **Authentication Middleware**
```javascript
// JWT token verification for WebSocket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});
```

### **Client-Side Event Handling**

The client automatically handles all WebSocket events to update the UI in real-time:

```javascript
// Example: Task creation event handler
[SOCKET_EVENTS.TASK_CREATED]: (data) => {
  const { task, listId } = data;
  
  setLists(prevLists =>
    prevLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: [...list.tasks, task]
        };
      } else if (list.isAllLists) {
        // Add to All Lists view with list info
        const targetList = prevLists.find(l => l.id === listId);
        const taskWithListInfo = {
          ...task,
          listInfo: {
            id: targetList?.id,
            title: targetList?.title,
            color: targetList?.color,
            imageUrl: targetList?.imageUrl
          }
        };
        return {
          ...list,
          tasks: [...list.tasks, taskWithListInfo]
        };
      }
      return list;
    })
  );
}
```

---

## 🎨 **UI Components**

### **Key Components**

#### **ListCard** (`client/src/components/lists/ListCard.js`)
- Displays individual list with tasks organized by boards
- Handles drag-and-drop for task reordering
- Shows list image or colored fallback
- Provides edit and delete functionality

#### **Task** (`client/src/components/lists/Task.jsx`)
- Individual task component with completion toggle
- Displays task title, note, and subtasks
- Shows list badge with image or color
- Handles drag operations for moving between boards

#### **CreateListCard** (`client/src/components/lists/CreateListCard.js`)
- Form for creating new lists
- Image upload functionality with preview
- Color picker for list customization
- Form validation and error handling

#### **ListDropdown** (`client/src/components/lists/ListDropdown.jsx`)
- Dropdown selector for choosing lists
- Displays list icons (images or colors)
- Used in task creation and filtering

### **Styling System**

The application uses **Tailwind CSS** for styling with a consistent design system:

```css
/* Color Palette */
Primary: #3B82F6 (blue-500)
Secondary: #6B7280 (gray-500)
Success: #10B981 (emerald-500)
Warning: #F59E0B (amber-500)
Error: #EF4444 (red-500)

/* Typography */
Headings: font-semibold text-gray-900
Body: text-gray-700
Captions: text-sm text-gray-500

/* Spacing */
Container: max-w-7xl mx-auto px-4
Cards: p-6 rounded-lg shadow-sm
Buttons: px-4 py-2 rounded-md
```

---

## 🔐 **Authentication & Security**

### **JWT Authentication**
- Users authenticate with email/password
- JWT tokens stored in localStorage
- Tokens included in API requests and WebSocket connections
- Automatic token refresh on expiration

### **API Security**
- All endpoints require valid JWT tokens
- User-specific data isolation
- Input validation and sanitization
- CORS configuration for cross-origin requests

### **File Upload Security**
- File type validation (images only)
- File size limits (5MB max)
- Unique filename generation to prevent conflicts
- S3 bucket policies for secure access

---

## 🚀 **Performance Optimizations**

### **Frontend Optimizations**
- **React.memo()** for component memoization
- **useCallback()** for function memoization
- **Lazy loading** for large lists
- **Debounced input** for search and filters
- **Optimized re-renders** with proper dependency arrays

### **Backend Optimizations**
- **Database indexing** on frequently queried fields
- **Aggregation pipelines** for complex queries
- **Connection pooling** for MongoDB
- **Gzip compression** for API responses
- **Caching** for static assets

### **WebSocket Optimizations**
- **Room-based messaging** for user isolation
- **Event batching** for bulk operations
- **Connection management** with automatic reconnection
- **Heartbeat monitoring** for connection health

---

## 📦 **Deployment Architecture**

### **Production Setup**
```
Internet → Nginx → PM2 → Node.js App
                 ↓
              MongoDB Atlas
                 ↓
              AWS S3 Storage
```

### **Environment Configuration**

#### **Frontend Environment Variables**
```bash
# Client/.env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SERVER_URL=https://your-api-domain.com
```

#### **Backend Environment Variables**
```bash
# Server/.env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=https://your-frontend-domain.com

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-s3-bucket-name
```

### **PM2 Configuration** (`ecosystem.config.js`)
```javascript
module.exports = {
  apps: [
    {
      name: 'nexus-backend',
      script: './server/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'nexus-frontend',
      script: 'npx',
      args: 'serve -s build -l 3000',
      cwd: './client',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true
    }
  ]
};
```

### **Nginx Configuration**
```nginx
# Frontend (example.com)
server {
    listen 443 ssl;
    server_name example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Backend (api.example.com)
server {
    listen 443 ssl;
    server_name api.example.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:4000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off;
    }
}
```

---

## 🔧 **Development Setup**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- AWS S3 bucket (for image uploads)
- Git for version control

### **Installation Steps**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nexus.git
cd nexus
```

2. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Environment setup**
```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../client
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development servers**
```bash
# Backend (Terminal 1)
cd server
npm run dev

# Frontend (Terminal 2)
cd client
npm start
```

### **Development Scripts**

#### **Backend Scripts**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run test       # Run test suite
npm run lint       # Run ESLint
```

#### **Frontend Scripts**
```bash
npm start          # Start development server
npm run build      # Build for production
npm run test       # Run test suite
npm run eject      # Eject from Create React App
```

---

## 🧪 **Testing Strategy**

### **Frontend Testing**
- **Unit Tests**: Component testing with Jest and React Testing Library
- **Integration Tests**: Hook testing and API integration
- **E2E Tests**: User workflow testing with Cypress

### **Backend Testing**
- **Unit Tests**: Controller and utility function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Model validation and query testing

### **WebSocket Testing**
- **Connection Tests**: Socket.IO connection and authentication
- **Event Tests**: Real-time event emission and handling
- **Performance Tests**: Concurrent connection handling

---

## 🐛 **Troubleshooting Guide**

### **Common Issues**

#### **WebSocket Connection Failed**
```bash
# Check if backend is running
curl http://localhost:4000/health

# Check WebSocket endpoint
curl -I http://localhost:4000/socket.io/

# Verify environment variables
echo $REACT_APP_SERVER_URL
```

#### **Image Upload Issues**
```bash
# Verify AWS credentials
aws s3 ls s3://your-bucket-name

# Check S3 bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name

# Test S3 upload
node test-s3-upload.js
```

#### **Database Connection Issues**
```bash
# Test MongoDB connection
mongosh "your-mongodb-uri"

# Check network access in MongoDB Atlas
# Verify IP whitelist includes your server IP
```

### **Performance Issues**

#### **Slow Task Loading**
- Check database indexes on frequently queried fields
- Monitor MongoDB performance metrics
- Optimize API queries with aggregation pipelines

#### **WebSocket Lag**
- Monitor server memory and CPU usage
- Check network latency between client and server
- Verify WebSocket connection stability

---

## 🔄 **Future Enhancements**

### **Planned Features**
- **Team Collaboration**: Multi-user list sharing and permissions
- **Advanced Filtering**: Search, tags, and custom filters
- **Mobile App**: React Native mobile application
- **Offline Support**: PWA with offline functionality
- **Analytics Dashboard**: Task completion metrics and insights
- **Integrations**: Calendar sync, email notifications
- **Advanced Drag & Drop**: Cross-list task movement
- **Custom Themes**: User-customizable color schemes

### **Technical Improvements**
- **Microservices Architecture**: Split into smaller, focused services
- **GraphQL API**: More efficient data fetching
- **Redis Caching**: Improved performance with caching layer
- **Docker Containerization**: Easier deployment and scaling
- **Kubernetes Orchestration**: Auto-scaling and load balancing
- **Monitoring & Logging**: Comprehensive observability stack

---

## 📄 **API Documentation**

### **Authentication Endpoints**
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/refresh     # Token refresh
GET  /api/auth/me          # Get current user
```

### **List Endpoints**
```
GET    /api/lists          # Get all lists for user
POST   /api/lists          # Create new list
GET    /api/lists/:id      # Get specific list
PUT    /api/lists/:id      # Update list
DELETE /api/lists/:id      # Delete list
```

### **Task Endpoints**
```
GET    /api/tasks/list/:listId     # Get tasks for list
GET    /api/tasks/all              # Get all user tasks
POST   /api/tasks                  # Create new task
GET    /api/tasks/:id              # Get specific task
PUT    /api/tasks/:id              # Update task
DELETE /api/tasks/:id              # Delete task
PUT    /api/tasks/:id/move         # Move task to different board
PUT    /api/tasks/reorder          # Reorder tasks
DELETE /api/tasks/completed/:listId # Delete completed tasks
```

### **Subtask Endpoints**
```
POST   /api/tasks/:taskId/subtasks           # Add subtask
PUT    /api/tasks/:taskId/subtasks/:id       # Update subtask
DELETE /api/tasks/:taskId/subtasks/:id       # Delete subtask
```

---

## 📞 **Support & Contributing**

### **Getting Help**
- Check this README for comprehensive documentation
- Review the troubleshooting guide for common issues
- Check the GitHub issues for known problems
- Contact the development team for urgent issues

### **Contributing Guidelines**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- Follow ESLint configuration for JavaScript
- Use Prettier for code formatting
- Write comprehensive tests for new features
- Document all public functions and components
- Follow semantic versioning for releases

---

## 📋 **License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 **Acknowledgments**

- React team for the amazing framework
- Socket.IO team for real-time capabilities
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the flexible database
- AWS for reliable cloud infrastructure
- All contributors and testers who helped improve this application

---

**Built with ❤️ by the Nexus Team**

*Last updated: January 2025*