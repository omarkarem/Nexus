import Dropdown from '../Dropdown';

function ListCard({ list }) {
  const { title, color } = list;
  
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

  return (
    <div className="h-72 group relative bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-3xl p-6 hover:shadow-lg hover:shadow-turquoise/10 transition-all duration-300 hover:scale-105 cursor-pointer">
      {/* List Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-md ${getColorClass(color)} mr-2`}></div>
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-turquoise transition-colors duration-300">
            {title}
          </h3>
        </div>
        <Dropdown onEdit={handleEdit} onDelete={handleDelete} />
      </div>



      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-turquoise opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}

export default ListCard; 