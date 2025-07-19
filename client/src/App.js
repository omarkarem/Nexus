import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Lists from './pages/Lists';
import ListDetail from './pages/ListDetail';
import ProtectedRoute from './components/ProtectedRoute';

// Component to redirect authenticated users away from login/signup
function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Protected app routes */}
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lists" element={<Lists />} />
          <Route path="lists/:listId" element={<ListDetail />} />
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch-all route - redirect to appropriate page */}
        <Route 
          path="*" 
          element={
            isAuthenticated() ? 
              <Navigate to="/app/dashboard" replace /> : 
              <Navigate to="/" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
