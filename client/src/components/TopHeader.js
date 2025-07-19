import { useLocation } from 'react-router-dom';

function TopHeader() {
  const location = useLocation();

  // Don't render TopHeader on list detail pages
  if (location.pathname.startsWith('/app/lists/')) {
    return null;
  }

  const getPageInfo = () => {
    const path = location.pathname;
    
    if (path === '/app/dashboard') {
      return {
        name: 'Dashboard',
        description: 'Welcome back! Here\'s your productivity overview.'
      };
    } else if (path === '/app/lists') {
      return {
        name: 'Lists',
        description: 'Manage and organize your lists efficiently.'
      };
    } else {
      return {
        name: 'Dashboard',
        description: 'Welcome back! Here\'s your productivity overview.'
      };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary truncate">
            {pageInfo.name}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-1 sm:mt-2 max-w-2xl">
            {pageInfo.description}
          </p>
        </div>
      </div>
    </header>
  );
}

export default TopHeader; 