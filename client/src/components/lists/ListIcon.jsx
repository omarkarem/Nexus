import React from 'react';

/**
 * ListIcon Component
 * Displays either a list's custom image as background or falls back to colored background with first letter
 * 
 * @param {Object} props
 * @param {Object} props.list - List object with title, color, and imageUrl
 * @param {string} props.size - Size class (e.g., 'w-8 h-8', 'w-12 h-12')
 * @param {string} props.className - Additional CSS classes
 */
function ListIcon({ list, size = 'w-8 h-8', className = '' }) {
  const { title, color, imageUrl } = list;

  // Get first letter only
  const getInitial = (title) => {
    return title.charAt(0).toUpperCase();
  };

  // Color mapping for background classes
  const colorClasses = {
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

  if (imageUrl) {
    return (
      <div 
        className={`${size} ${className} rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 bg-cover bg-center`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Show initial as overlay on image for better readability */}
        <span className="bg-black/30 rounded px-1">{getInitial(title)}</span>
      </div>
    );
  }

  // Fallback to original colored background with initial
  return (
    <div className={`${size} ${className} ${colorClasses[color] || 'bg-blue-500'} rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
      {getInitial(title)}
    </div>
  );
}

export default ListIcon; 