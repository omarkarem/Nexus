import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../utils/userApi';
import { clearAuthData } from '../utils/auth';

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from server
    const loadUserProfile = async () => {
      const userData = await fetchUserProfile();
      if (userData) {
        setUser(userData);
      } else {
        // If profile fetch fails, redirect to login
        navigate('/login');
      }
    };
    
    loadUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication data on logout
    clearAuthData();
    
    // Redirect to login
    navigate('/login');
  };

  // Show loading state if no user data
  if (!user) {
    return (
      <div className="p-4 border-t border-glass-border">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-glass">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-600 rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user.fullName) {
      const names = user.fullName.split(' ');
      return names.length > 1 
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
        : names[0].charAt(0).toUpperCase();
    }
    return user.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="p-4 border-t border-glass-border">
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-glass">
        {/* User Avatar */}
        <div className="w-10 h-10 bg-gradient-aurora rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.fullName || `${user.firstName} ${user.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {getInitials()}
            </span>
          )}
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-text-primary font-medium text-sm truncate">
            {user.fullName || `${user.firstName} ${user.lastName}`}
          </p>
          <p className="text-text-secondary text-xs truncate">
            {user.email}
          </p>
          {user.emailVerified === false && (
            <p className="text-yellow-400 text-xs">
              Email not verified
            </p>
          )}
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="text-text-secondary hover:text-red-400 transition-colors duration-300 p-1 rounded-md hover:bg-red-500/10"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default UserProfile; 