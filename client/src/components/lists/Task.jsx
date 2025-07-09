import { useState, useEffect, useRef } from "react";
import Note from "./Note";

const Task = ({ task, toggleTaskComplete, boardId, updateTaskTitle, deleteTask, updateTaskNote }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.title);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const textareaRef = useRef(null);
    
    // Sync editText with task.title when task prop changes
    useEffect(() => {
        setEditText(task.title);
    }, [task.title]);

    // Auto-resize textarea when editing starts
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            // Small delay to ensure textarea is rendered
            setTimeout(() => {
                const textarea = textareaRef.current;
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            }, 0);
        }
    }, [isEditing]);
    
    const handleSave =() =>{
        updateTaskTitle(task.id, editText);  // ← Use editText, not task.title
        setIsEditing(false);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleCancel = () => {
        setEditText(task.title);
        setIsEditing(false);
    };

    const handleNoteOpen = () => {
        setIsNoteOpen(true);
    };

    const handleNoteClose = () => {
        setIsNoteOpen(false);
    };

    const handleNoteSave = (noteText) => {
        if (updateTaskNote) {
            updateTaskNote(task.id, boardId, noteText);
        }
    };


    return (
        <div className="group p-4 bg-glass-bg backdrop-blur-glass border border-glass-border rounded-xl hover:bg-gradient-glass transition-all duration-200 cursor-pointer">
            {/* Main task row */}
            <div className="flex items-center">
                {/* Checkbox */}
                <div
                onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskComplete(task.id, boardId);
                }} 
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    task.completed 
                        ? 'w-0 h-0 bg-turquoise border-transparent group-hover:mr-2 opacity-0 group-hover:opacity-100 group-hover:w-5 group-hover:h-5'
                        : 'w-0 h-0 border-glass-border group-hover:mr-2 hover:border-turquoise opacity-0 group-hover:opacity-100 group-hover:w-5 group-hover:h-5'
                }`}>
                    {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                
                {/* Task Title */}
                {isEditing ? (
                    <textarea
                    ref={textareaRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyPress}
                    className="flex-1 text-[14px] transition-colors duration-200 bg-transparent border border-turquoise rounded px-2 py-1 text-text-primary outline-none resize-none overflow-hidden"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    rows={1}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    />
                ) : (
                <span 
                onClick={(e) =>{
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                className={`flex-1 text-[14px] truncate transition-colors duration-200 ${
                    task.completed 
                    ? 'text-text-secondary line-through' 
                    : 'text-text-primary'
                }`}>
                {task.title}
                </span>
            )}
                
                {/* Action buttons container */}
                <div className="flex items-center space-x-1">
                    {/* Add Note Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNoteOpen();
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-500/20 rounded transition-all duration-200"
                        title="Add note"
                    >
                        <svg className="w-4 h-4 text-blue-400 hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    {/* Delete Button */}
                    {deleteTask && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task.id, boardId);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all duration-200"
                            title="Delete task"
                        >
                            <svg className="w-4 h-4 text-red-400 hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Note Component - appears under the title */}
            {isNoteOpen && (
                <Note
                    isOpen={isNoteOpen}
                    onClose={handleNoteClose}
                    taskTitle={task.title}
                    note={task.note || ""}
                    onSave={handleNoteSave}
                />
            )}
        </div>
    )
}

export default Task;