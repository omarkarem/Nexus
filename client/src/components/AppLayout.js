import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

function AppLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isListPage = location.pathname.startsWith('/app/lists/') && location.pathname !== '/app/lists';
  
  return (
    <div className="min-h-screen bg-gradient-dark flex max-w-screen-2xl mx-auto">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Hidden on mobile unless open, always visible on desktop */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isListPage ? 'hidden' : 'block'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col m-2 lg:m-4 bg-black backdrop-blur-glass-strong rounded-3xl min-w-0">
        {/* Mobile Header with Menu Button */}
        {!isListPage && (
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-glass-border">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-text-primary hover:text-turquoise transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-text-primary">Nexus</h1>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>
        )}

        <TopHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout; 