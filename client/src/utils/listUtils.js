// Get tasks by board from a list
export const getTasksByBoard = (list, boardName) => {
  if (!list || !list.tasks) return [];
  
  const isAllListsView = list.isAllLists || list.title === 'All Lists';
  
  return list.tasks
    .filter(task => task.board === boardName)
    .sort((a, b) => {
      // Use allListsOrder for All Lists view, regular order for normal lists
      if (isAllListsView) {
        return (a.allListsOrder || 0) - (b.allListsOrder || 0);
      } else {
        return (a.order || 0) - (b.order || 0);
      }
    });
};

// Get color class based on color name
export const getColorClass = (colorName) => {
  const colorMap = {
    red: 'bg-red-500',
    orange: 'bg-orange-500', 
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    teal: 'bg-teal-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    rose: 'bg-rose-500',
    gray: 'bg-gray-500',
    black: 'bg-black'
  };
  
  return colorMap[colorName] || 'bg-gray-500';
};

// Get color classes for backgrounds, borders, etc.
export const getColorVariants = (colorName) => {
  const colorVariants = {
    red: {
      bg: 'bg-red-500',
      bgLight: 'bg-red-100',
      bgDark: 'bg-red-600',
      text: 'text-red-500',
      border: 'border-red-500'
    },
    orange: {
      bg: 'bg-orange-500',
      bgLight: 'bg-orange-100', 
      bgDark: 'bg-orange-600',
      text: 'text-orange-500',
      border: 'border-orange-500'
    },
    yellow: {
      bg: 'bg-yellow-500',
      bgLight: 'bg-yellow-100',
      bgDark: 'bg-yellow-600', 
      text: 'text-yellow-500',
      border: 'border-yellow-500'
    },
    green: {
      bg: 'bg-green-500',
      bgLight: 'bg-green-100',
      bgDark: 'bg-green-600',
      text: 'text-green-500', 
      border: 'border-green-500'
    },
    teal: {
      bg: 'bg-teal-500',
      bgLight: 'bg-teal-100',
      bgDark: 'bg-teal-600',
      text: 'text-teal-500',
      border: 'border-teal-500'
    },
    blue: {
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-100', 
      bgDark: 'bg-blue-600',
      text: 'text-blue-500',
      border: 'border-blue-500'
    },
    indigo: {
      bg: 'bg-indigo-500',
      bgLight: 'bg-indigo-100',
      bgDark: 'bg-indigo-600',
      text: 'text-indigo-500',
      border: 'border-indigo-500'
    },
    purple: {
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-100',
      bgDark: 'bg-purple-600', 
      text: 'text-purple-500',
      border: 'border-purple-500'
    },
    pink: {
      bg: 'bg-pink-500',
      bgLight: 'bg-pink-100',
      bgDark: 'bg-pink-600',
      text: 'text-pink-500',
      border: 'border-pink-500'
    },
    rose: {
      bg: 'bg-rose-500',
      bgLight: 'bg-rose-100',
      bgDark: 'bg-rose-600',
      text: 'text-rose-500',
      border: 'border-rose-500'
    },
    gray: {
      bg: 'bg-gray-500',
      bgLight: 'bg-gray-100',
      bgDark: 'bg-gray-600',
      text: 'text-gray-500',
      border: 'border-gray-500'
    },
    black: {
      bg: 'bg-black',
      bgLight: 'bg-gray-200', 
      bgDark: 'bg-gray-900',
      text: 'text-black',
      border: 'border-black'
    }
  };
  
  return colorVariants[colorName] || colorVariants.gray;
};

// Transform lists into dropdown options
export const createListOptions = (lists) => {
  return lists.map(list => ({
    value: list.id,
    label: list.title,
    icon: <div className={`w-4 h-4 rounded ${getColorClass(list.color)}`}></div>
  }));
};

// Calculate completion percentage
export const calculateCompletionPercentage = (currentList) => {
  if (!currentList || currentList.itemCount === 0) return 0;
  return Math.round((currentList.completedCount / currentList.itemCount) * 100);
}; 