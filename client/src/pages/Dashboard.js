function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Dashboard content will be added later */}
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Dashboard Coming Soon</h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Your productivity dashboard will show analytics, progress, and insights here.
        </p>
      </div>
    </div>
  );
}

export default Dashboard; 