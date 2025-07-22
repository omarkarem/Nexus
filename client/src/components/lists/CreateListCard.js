import { useState } from 'react';

function CreateListModal({ isOpen, onClose, createList }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: 'blue'
  });
  const [errors, setErrors] = useState({});

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

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'List name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    createList(formData.title.trim(), formData.color, formData.description.trim());
    setFormData({ title: '', description: '', color: 'blue' });
    setErrors({});
    onClose();
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', color: 'blue' });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center">
          <button 
            onClick={handleCancel}
            className="text-text-secondary hover:text-text-primary transition-colors ml-auto"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h2 className="flex justify-center text-xl font-semibold text-text-primary mb-6">Create New List</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2 opacity-50">
              Choose Color
            </label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {colorOptions.map(color => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setFormData({...formData, color: color.name})}
                  className={`w-7 h-7 rounded-full ${color.class} transition-all duration-200 ${
                    formData.color === color.name 
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-glass-bg scale-110' 
                      : 'hover:scale-105'
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>
          <div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter list name..."
              className={`w-full p-3 bg-glass-bg border-2 border-glass-border rounded-lg text-black placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-turquoise ${
                errors.title ? 'border-red-500' : 'border-glass-border'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-gray-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="w-1/2 bg-gradient-turquoise hover:bg-gradient-turquoise-reverse text-primary font-semibold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20"
            >
              Create List
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/2 px-6 bg-glass border border-glass-border text-text-secondary py-3 rounded-full transition-all duration-300 hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateListCard({ createList }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="h-72 group relative bg-gradient-glass backdrop-blur-glass border-2 border-dashed border-glass-border rounded-xl p-6 hover:border-gray-500 hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-center"
      >
        <div className="w-16 h-16 bg-gradient-turquoise rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-turquoise/30">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-white transition-colors duration-300">
            Create List
          </h3>
        </div>
        <div className="absolute inset-0 bg-gradient-gray opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
        <div className="absolute inset-0 rounded-xl border border-gray-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>
      </button>
      <CreateListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} createList={createList} />
    </>
  );
}

export default CreateListCard;
export { CreateListModal };