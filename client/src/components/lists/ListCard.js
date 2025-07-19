import { Link } from 'react-router-dom';
import { useState } from 'react';
import Dropdown from '../Dropdown';

function ListCard({ list, editList, deleteList }) {
  const { title, tasks, color } = list;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: title,
    color: color,
    description: list.description || ''
  });
  const [errors, setErrors] = useState({});
  
  // Get color class based on color
  const getColorClass = (colorName) => {
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

  const colorOptions = [
    { name: 'red', class: 'bg-red-500', label: 'Red' },
    { name: 'orange', class: 'bg-orange-500', label: 'Orange' },
    { name: 'yellow', class: 'bg-yellow-500', label: 'Yellow' },
    { name: 'green', class: 'bg-green-500', label: 'Green' },
    { name: 'teal', class: 'bg-teal-500', label: 'Teal' },
    { name: 'blue', class: 'bg-blue-500', label: 'Blue' },
    { name: 'indigo', class: 'bg-indigo-500', label: 'Indigo' },
    { name: 'purple', class: 'bg-purple-500', label: 'Purple' },
    { name: 'pink', class: 'bg-pink-500', label: 'Pink' },
    { name: 'rose', class: 'bg-rose-500', label: 'Rose' },
    { name: 'gray', class: 'bg-gray-500', label: 'Gray' },
    { name: 'black', class: 'bg-black', label: 'Black' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!editFormData.title.trim()) {
      newErrors.title = 'List name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setEditFormData({
      title: title,
      color: color,
      description: list.description || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    editList(list.id, editFormData.title.trim(), editFormData.color, editFormData.description.trim());
    setIsEditModalOpen(false);
    setErrors({});
  };

  const handleDeleteConfirm = () => {
    deleteList(list.id);
    setIsDeleteModalOpen(false);
  };

  const handleEditCancel = () => {
    setEditFormData({
      title: title,
      color: color,
      description: list.description || ''
    });
    setErrors({});
    setIsEditModalOpen(false);
  };

  // Show only first 4 tasks
  const displayTasks = tasks.slice(0, 4);

  // Truncate text to 15 characters
  const truncateText = (text) => {
    return text.length > 15 ? text.substring(0, 15) + '...' : text;
  };

  return (
    <>
      <div className="h-72 group relative bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-xl p-6 hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300 hover:scale-105 cursor-pointer">
      {/* List Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-md ${getColorClass(color)} mr-3`}></div>
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
          </div>
          <Dropdown onEdit={handleEdit} onDelete={handleDelete} />
        </div>

        {/* Tasks Container with Link */}
        <Link to={`/app/lists/${list.id}`} className="block">
          <div className="relative">
            {/* Tasks List */}
            <div className="min-h-[160px] space-y-2 px-1 py-2 flex flex-col">
              {displayTasks.length > 0 ? (
                displayTasks.map((task) => (
                  <div key={task.id} className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-md px-2 py-1 transition-all duration-200">
                    <span className="text-[12px] text-text-primary">
                      {truncateText(task.title)}
                    </span>
                  </div>
                ))
              ) : (
                // Placeholder content when no tasks
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-text-secondary mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-text-secondary text-xs opacity-60">No tasks yet</p>
                  </div>
                </div>
              )}
              
              {/* Fill remaining space if fewer than 4 tasks */}
              {displayTasks.length > 0 && displayTasks.length < 4 && (
                <div className="flex-1"></div>
              )}
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <p className='text-text-secondary text-xs'>{tasks.length} tasks</p>
      </div>

      {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-gray opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-text-primary mb-4">Edit List</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-text-secondary mb-2 text-sm font-medium">
                  List Name
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-glass-bg border border-glass-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-turquoise-500 transition-all duration-300"
                  placeholder="Enter list name"
                  required
                />
                {errors.title && (
                  <p className="text-gray-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-text-secondary mb-2 text-sm font-medium">
                  Description (Optional)
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-glass-bg border border-glass-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-turquoise-500 transition-all duration-300 resize-none"
                  placeholder="Add a description..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-2 text-sm font-medium">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((colorOption) => (
                    <button
                      key={colorOption.name}
                      type="button"
                      onClick={() => setEditFormData({...editFormData, color: colorOption.name})}
                      className={`flex items-center space-x-2 p-2 rounded-lg border transition-all duration-200 ${
                        editFormData.color === colorOption.name
                          ? 'border-turquoise-500 bg-turquoise-500/10'
                          : 'border-glass-border hover:border-glass-border-hover'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded ${colorOption.class}`}></div>
                      <span className="text-text-primary text-sm hidden lg:block">{colorOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-4 py-2 bg-glass-bg border border-glass-border rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-turquoise text-primary font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-text-primary mb-4">Delete List</h2>
            <p className="text-text-secondary mb-6">
              Are you sure you want to delete "<strong className="text-text-primary">{title}</strong>"? 
              This action cannot be undone and will permanently remove all {tasks.length} tasks in this list.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-glass-bg border border-glass-border rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                Delete List
              </button>
            </div>
          </div>
    </div>
      )}
    </>
  );
}

export default ListCard; 