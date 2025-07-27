import { useState } from "react";
import ListDropdown from "./ListDropdown";

const AddTask = ({ boardId, addTask, listOptions, currentList, addSubTask, isAdding: isAddingProp, setIsAdding: setIsAddingProp }) => {
  const [internalIsAdding, internalSetIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedList, setSelectedList] = useState(currentList.id);

  // Use controlled props if provided, otherwise fallback to internal state
  const isAdding = typeof isAddingProp === 'boolean' ? isAddingProp : internalIsAdding;
  const setIsAdding = setIsAddingProp || internalSetIsAdding;
  
  // Don't allow adding tasks directly to "All Lists" - redirect to a real list
  const isAllListsView = currentList?.isAllLists || currentList?.title === 'All Lists';
  
  // Filter out "All Lists" from the dropdown options
  const filteredListOptions = listOptions.filter(option => option.label !== 'All Lists');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      // If in All Lists view, use the selected list from dropdown
      if (isAllListsView) {
        if (selectedList && selectedList !== currentList.id) {
          addTask(taskTitle.trim(), boardId, selectedList);
        } else {
          // Fallback to first regular list if none selected
          const firstRegularList = filteredListOptions[0];
          if (firstRegularList) {
            addTask(taskTitle.trim(), boardId, firstRegularList.value);
          } else {
            alert('Please create a list first before adding tasks.');
            return;
          }
        }
      } else {
        addTask(taskTitle.trim(), boardId, selectedList);
      }
      
      setTaskTitle('');
      setIsAdding(false);
      setSelectedList(currentList.id);
    }
  };
  
    const handleCancel = () => {
      setTaskTitle("");
      setSelectedList(currentList.id);
      setIsAdding(false);
    };

      if (isAdding) {
        return (
          <div className="w-full border-b border-glass-border py-2">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative">
                <textarea
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="w-full p-2 border border-glass-border rounded-lg bg-glass-bg text-text-primary text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-turquoise-500 pr-12"
                  autoFocus
                  rows="1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    } else if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }}
                />
                {/* Cancel X button inside input */}
                <button
                  onClick={handleCancel}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-red-500/20 rounded transition-all duration-200"
                  title="Cancel"
                >
                  <svg className="w-4 h-4 text-red-400 hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-2 pb-2">
                <div className="flex-1">
                  <ListDropdown 
                    options={filteredListOptions} 
                    value={selectedList} 
                    onChange={(option) => setSelectedList(option.value)}
                    placeholder="Select List"
                    className="w-full text-[14px]"
                    size="small"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="flex items-center justify-center h-8 px-3 py-2 bg-gradient-turquoise hover:bg-gradient-turquoise-reverse text-primary rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        );
      }
    
      return (
        <div className="w-full border-b border-glass-border py-2 hover:text-white">
          <span 
            className="text-md cursor-pointer" 
            onClick={() => setIsAdding(true)}
          >
            + Add Task
          </span>
        </div>
      );
    };

export default AddTask;