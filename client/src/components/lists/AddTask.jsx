import { useState } from "react";
import ListDropdown from "./ListDropdown";

const AddTask = ({ boardId, addTask, listOptions, currentList, addSubTask }) =>{

    const [isAdding, setIsAdding] = useState(false);
    const [taskTitle, setTaskTitle] = useState("");
    const [selectedList, setSelectedList] = useState(currentList.id);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (taskTitle.trim()) {
        // Call addTask with: taskTitle, boardId, selectedListId
        addTask(taskTitle.trim(), boardId, selectedList);
        setTaskTitle("");
        setSelectedList(currentList.id);
        setIsAdding(false);
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
              {/* Title input with Cancel button */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter task title..." 
                  value={taskTitle} 
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-2 bg-glass-bg border border-glass-border rounded-lg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-turquoise focus:border-turquoise outline-none"
                  autoFocus
                />
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="px-3 py-2 bg-glass-bg border border-glass-border text-text-secondary rounded-lg text-sm hover:bg-gradient-glass transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* List dropdown with Add button */}
              <div className="flex items-center space-x-2 pb-2">
                <div className="flex-1">
                  <ListDropdown 
                    options={listOptions} 
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