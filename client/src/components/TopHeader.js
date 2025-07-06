import { useLocation } from 'react-router-dom';


function TopHeader() {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/app/dashboard'
    },
    {
      name: 'Lists',
      path: '/app/lists'
    }
  ];

  return (
    <header className="px-10 pt-8 pb-6">
      <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">
            {navigationItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          <p className="text-text-secondary mt-1">
            {location.pathname === '/app/dashboard' 
              ? 'Welcome back! Here\'s your productivity overview.'
              : 'Manage and organize your lists efficiently.'
            }
          </p>
      </div>
    </header>
  );
}

export default TopHeader; 