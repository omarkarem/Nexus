import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import Navigation from './Navigation';
import UserProfile from './UserProfile';

function Sidebar({ onClose }) {
  return (
    <div className="w-72 lg:w-80 xl:w-72 2xl:w-80 h-full flex flex-col">
      {/* Mobile Close Button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-glass-border">
        <Logo />
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Desktop Logo */}
      <div className="hidden lg:block p-4">
        <Logo />
      </div>
      
      <Navigation />
      <UserProfile />
    </div>
  );
}

export default Sidebar; 