// Helper function to get tasks by board type
export const getTasksByBoard = (currentList, boardType) => {
  if (!currentList) return [];
  return currentList.tasks.filter(task => task.board === boardType).sort((a,b) => a.order - b.order);
};

// Get color class based on color name
export const getColorClass = (colorName) => {
  const colorMap = {
    red: 'bg-gray-600',
    orange: 'bg-gray-500',
    green: 'bg-gray-400',
    blue: 'bg-gray-700',
    purple: 'bg-gray-800',
    pink: 'bg-gray-300',
    black: 'bg-black'
  };
  
  return colorMap[colorName] || 'bg-gray-500';
};

// Transform lists into dropdown options
export const createListOptions = (lists) => {
  return lists.map(list => ({
    value: list.id,
    label: list.title,
    icon: <div className={`w-4 h-4 rounded bg-${list.color}-500`}></div>
  }));
};

// Calculate completion percentage
export const calculateCompletionPercentage = (currentList) => {
  if (!currentList || currentList.itemCount === 0) return 0;
  return Math.round((currentList.completedCount / currentList.itemCount) * 100);
}; 