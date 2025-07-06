function CreateListCard() {
  const handleCreateList = () => {
    // Handle create list logic here
    console.log('Create new list clicked');
  };

  return (
    <button 
      onClick={handleCreateList}
      className="h-72 group relative bg-gradient-glass backdrop-blur-glass border-2 border-dashed border-glass-border rounded-3xl p-6 hover:border-turquoise hover:shadow-lg hover:shadow-turquoise/20 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-center"
    >
      {/* Plus Icon */}
      <div className="w-16 h-16 bg-gradient-turquoise rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-turquoise/30">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>

      {/* Text Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-turquoise transition-colors duration-300">
          Create List
        </h3>
      </div>


      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-turquoise opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none"></div>
      
    
      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-3xl border border-turquoise opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>
    </button>
  );
}

export default CreateListCard; 