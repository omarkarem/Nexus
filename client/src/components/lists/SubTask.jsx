import { useState, useEffect, useRef } from "react";

const SubTask = ({ 
  taskId, 
  subTask, 
  listId, 
  toggleSubTaskComplete, 
  deleteSubtask, 
  updateSubtaskTitle 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(subTask.title);
    const textareaRef = useRef(null);

    useEffect(() => {
        setEditText(subTask.title);
    }, [subTask.title]);

    const handleSave = () => {
        updateSubtaskTitle(taskId, subTask.id, editText, listId);
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            setEditText(subTask.title);
            setIsEditing(false);
        }
    };

    return(
        <div className="group p-2 bg-glass-bg/50 backdrop-blur-glass border-glass-border rounded-r-lg hover:bg-gradient-glass/50 transition-all duration-200">
            <div className="flex items-center">
                {/* Subtask Checkbox */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleSubTaskComplete(taskId, subTask.id, listId);
                    }}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 mr-3 cursor-pointer ${
                        subTask.completed 
                            ? 'bg-turquoise border-turquoise'
                            : 'border-glass-border hover:border-turquoise'
                    }`}
                >
                    {subTask.completed && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>

                {/* Subtask Title */}
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        className="flex-1 text-sm bg-transparent border border-turquoise rounded px-2 py-1 text-text-primary outline-none resize-none"
                        autoFocus
                        rows={1}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                        className={`flex-1 text-sm cursor-pointer transition-colors duration-200 ${
                            subTask.completed 
                                ? 'text-text-secondary line-through' 
                                : 'text-text-primary'
                        }`}
                    >
                        {subTask.title}
                    </span>
                )}

                {/* Delete Subtask Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteSubtask(taskId, subTask.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-500/20 rounded transition-all duration-200 ml-2"
                    title="Delete subtask"
                >
                    <svg className="w-3 h-3 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SubTask;
 