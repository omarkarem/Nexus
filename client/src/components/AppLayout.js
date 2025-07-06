import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-dark flex">
      <Sidebar />

      {/* Main Content Area with Background */}
      <div className="flex-1 flex flex-col m-2 bg-gradient-glass backdrop-blur-glass-strong rounded-3xl">
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