import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown';

function ListCard({ list }) {
  const { title, tasks, color } = list;
  
  // Get color class based on color
  const getColorClass = (colorName) => {
    const colorMap = {
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500'
    };
    return colorMap[colorName] || 'bg-blue-500';
  };

  const handleEdit = () => {
    console.log('Edit list:', title);
  };

  const handleDelete = () => {
    console.log('Delete list:', title);
  };

  // Show only first 4 tasks
  const displayTasks = tasks.slice(0, 4);

  // Truncate text to 15 characters
  const truncateText = (text) => {
    return text.length > 15 ? text.substring(0, 15) + '...' : text;
  };

  return (
    <div className="h-72 group relative bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-3xl p-6 hover:shadow-lg hover:shadow-turquoise/10 transition-all duration-300 hover:scale-105 cursor-pointer">
      {/* List Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-md ${getColorClass(color)} mr-3`}></div>
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-turquoise transition-colors duration-300">
            {title}
          </h3>
        </div>
        <Dropdown onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Tasks Container with Link */}
      <Link to={`/app/lists/${list.id}`} className="block">
        <div className="relative">
          {/* Tasks List */}
          <div className="space-y-2 px-1 py-2">
            {displayTasks.map((task) => (
              <div key={task.id} className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-md px-2 py-1 transition-all duration-200 ">
                <span className="text-[12px] text-text-primary">
                  {truncateText(task.title)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between mt-2">
        <p className='text-text-secondary text-xs'>{tasks.length} tasks</p>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-turquoise opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}

export default ListCard; 