import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }) {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return children;
}

export default ProtectedRoute; 