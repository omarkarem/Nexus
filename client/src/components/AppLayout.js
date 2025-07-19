import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

function AppLayout() {
  const location = useLocation();

  const isListPage = location.pathname.startsWith('/app/lists/') && location.pathname !== '/app/lists';
  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {!isListPage &&  <Sidebar />}
      {/* Main Content Area with Background */}
      <div className="flex-1 flex flex-col m-2 bg-black backdrop-blur-glass-strong rounded-3xl">
        <TopHeader />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout; 