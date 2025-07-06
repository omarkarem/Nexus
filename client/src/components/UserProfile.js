function UserProfile() {
  return (
    <div className="p-4 border-t border-glass-border">
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-glass">
        <div className="w-10 h-10 bg-gradient-aurora rounded-full flex items-center justify-center">
          <span className="text-primary font-semibold">U</span>
        </div>
        <div className="flex-1">
          <p className="text-text-primary font-medium text-sm">User Name</p>
          <p className="text-text-secondary text-xs">user@example.com</p>
        </div>
        <button className="text-text-secondary hover:text-text-primary transition-colors duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default UserProfile; 