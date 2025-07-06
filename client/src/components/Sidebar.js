import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import Navigation from './Navigation';
import UserProfile from './UserProfile';

function Sidebar() {
  return (
    <div className="w-72 p-4 flex flex-col">
      <Logo />
      <Navigation />
      <UserProfile />
    </div>
  );
}

export default Sidebar; 