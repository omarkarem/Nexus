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
    <header className="px-10 pt-8 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {pageInfo.name}
          </h1>
          <p className="text-text-secondary mt-1">
            {pageInfo.description}
          </p>
        </div>
      </div>
    </header>
  );
}

export default TopHeader; 