import { useState, useEffect, useRef } from "react";
import Note from "./Note";
import SubTask from "./SubTask";
import { getColorClass } from '../../utils/listUtils';

const Task = ({ task, toggleTaskComplete, boardId, updateTaskTitle, deleteTask, updateTaskNote, addSubTask, toggleSubTaskComplete, deleteSubtask, updateSubtaskTitle, listId, currentList, index, isGhosting = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.title);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [isAddingSubTask, setIsAddingSubTask] = useState(false);
    const [subTaskText, setSubTaskText] = useState('');
    const [isSubTasksCollapsed, setIsSubTasksCollapsed] = useState(false);
    const [isMoving, setIsMoving] = useState(false); // Prevent multiple rapid moves
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

    const handleAddSubTask = () => {
        if (subTaskText.trim()) {
            addSubTask(task.id, subTaskText.trim());
            setSubTaskText('');
            setIsAddingSubTask(false);
        }
    };

    const handleSubTaskKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSubTask();
        } else if (e.key === 'Escape') {
            setSubTaskText('');
            setIsAddingSubTask(false);
        }
    };


    return (
        <div className="group p-4 bg-glass-bg backdrop-blur-glass border border-glass-border rounded-xl hover:bg-gradient-glass transition-all duration-200"
             style={{ opacity: isGhosting ? 0 : 1, transition: 'opacity 0.1s' }}>
            {/* Main task row */}
            <div className="flex items-center justify-between">
                {/* Left side: Checkbox + Title */}
                <div className="flex items-center flex-1 min-w-0">
            {/* Checkbox */}
            <div
            onClick={(e) => {
                e.stopPropagation();
                toggleTaskComplete(task.id, boardId);
            }} 
                    className={`w-0 h-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isEditing ? 'w-0 h-0 opacity-0' :
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
                        className={`flex-1 text-[14px] truncate transition-colors duration-200 mr-2 ${
                task.completed 
                ? 'text-text-secondary line-through' 
                : 'text-text-primary'
            }`}>
            {task.title}
            </span>
                    )}
                </div>                
                
                {/* Right side: Initial Badge + Action buttons */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Initial Badge */}
                    {!isEditing && (
                        <span className={`text-white text-[10px] py-1 px-2 ${
                            currentList?.isAllLists
                                ? (task.listInfo ? getColorClass(task.listInfo.color) : 'bg-gray-400')
                                : getColorClass(currentList.color)
                        } backdrop-blur-glass rounded-full group-hover:hidden flex-shrink-0`}>
                            {currentList?.isAllLists
                                ? (task.listInfo ? task.listInfo.title.slice(0, 1) : '?')
                                : currentList.title.slice(0, 1)
                            }
                        </span>
                    )}
                    
                    {/* Action buttons */}
                    {!isEditing && (
                        <div className="w-0 flex items-center space-x-1 group-hover:w-auto overflow-hidden transition-all duration-200">
                        {/* Add SubTask Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAddingSubTask(true);
                                setIsSubTasksCollapsed(false);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-500/20 rounded transition-all duration-200"
                            title="Add subtask"
                        >
                            <svg className="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        {/* Add Note Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNoteOpen();
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-500/20 rounded transition-all duration-200"
                            title="Add note"
                        >
                            <svg className="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-500/20 rounded transition-all duration-200"
                                title="Delete task"
                            >
                                <svg className="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}

                        {/* Move Right Button (to next board) */}
                        {boardId !== 'Done' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isMoving) return; // Prevent multiple clicks
                                    
                                    setIsMoving(true);
                                    const nextBoard = boardId === 'backlog' ? 'thisWeek' : 
                                                     boardId === 'thisWeek' ? 'today' : 'Done';
                                    
                                    if (window.moveTaskCrossBoard) {
                                        window.moveTaskCrossBoard(task.id, boardId, nextBoard, listId);
                                    }
                                    
                                    // Reset after a delay
                                    setTimeout(() => setIsMoving(false), 500);
                                }}
                                className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-500/20 rounded transition-all duration-200 ${
                                    isMoving ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title="Move to next board"
                                disabled={isMoving}
                            >
                                <svg className="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        )}

                        {/* Move Left Button (to previous board) */}
                        {boardId !== 'backlog' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isMoving) return; // Prevent multiple clicks
                                    
                                    setIsMoving(true);
                                    const prevBoard = boardId === 'Done' ? 'today' : 
                                                     boardId === 'today' ? 'thisWeek' : 'backlog';
                                    
                                    if (window.moveTaskCrossBoard) {
                                        window.moveTaskCrossBoard(task.id, boardId, prevBoard, listId);
                                    }
                                    
                                    // Reset after a delay
                                    setTimeout(() => setIsMoving(false), 500);
                                }}
                                className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-500/20 rounded transition-all duration-200 ${
                                    isMoving ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title="Move to previous board"
                                disabled={isMoving}
                            >
                                <svg className="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>
                            </button>
                        )}
                        </div>
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

            {/* SubTasks Section - shows when there are subtasks OR when adding a new one */}
            {((task.subTasks && task.subTasks.length > 0) || isAddingSubTask) && (
                <div className="mt-3 border-t-2 border-glass-border space-y-2">
                    <div className="flex items-center mt-2 justify-between">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSubTasksCollapsed(!isSubTasksCollapsed);
                            }}
                            className="flex items-center space-x-2 hover:bg-glass-bg/20 rounded px-1 py-0.5 transition-all duration-200"
                        >
                            {/* Subtask Progress Circle and Count */}
                            {task.subTasks && task.subTasks.length > 0 && (() => {
                                const total = task.subTasks.length;
                                const completed = task.subTasks.filter(st => st.completed).length;
                                const percent = total === 0 ? 0 : completed / total;
                                const radius = 8; // px
                                const stroke = 3;
                                const circ = 2 * Math.PI * radius;
                                return (
                                    <span className="flex items-center space-x-1">
                                        <svg width={22} height={22} className="block" style={{ minWidth: 22, minHeight: 22 }}>
                                            <circle
                                                cx={11}
                                                cy={11}
                                                r={radius}
                                                fill="none"
                                                stroke="#e5e7eb" // Tailwind gray-200
                                                strokeWidth={stroke}
                                            />
                                            <circle
                                                cx={11}
                                                cy={11}
                                                r={radius}
                                                fill="none"
                                                stroke="#14b8a6" // Tailwind turquoise
                                                strokeWidth={stroke}
                                                strokeDasharray={circ}
                                                strokeDashoffset={circ - circ * percent}
                                                strokeLinecap="round"
                                                style={{ transition: 'stroke-dashoffset 0.3s' }}
                                            />
                                        </svg>
                                        <span className="text-xs text-text-secondary font-medium w-auto text-left">{completed}/{total}</span>
                                    </span>
                                );
                            })()}
                            <p className="text-text-secondary text-sm">Subtask</p>
                            <svg 
                                className={`w-3 h-3 text-text-secondary transition-transform duration-200 ${isSubTasksCollapsed ? 'rotate-[-90deg]' : 'rotate-90'}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAddingSubTask(true);
                                setIsSubTasksCollapsed(false);
                            }}
                        >
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        </button>
                    </div>
                    {/* Collapsible content - subtasks and add input */}
                    {!isSubTasksCollapsed && (
                        <>
                            {/* Display existing SubTasks */}
                            {task.subTasks && task.subTasks.length > 0 && (
                                <>
                                    {task.subTasks.map((subTask) => (
                                        <SubTask
                                            key={subTask.id}
                                            taskId={task.id}
                                            subTask={subTask}
                                            listId={listId}
                                            toggleSubTaskComplete={toggleSubTaskComplete}
                                            deleteSubtask={deleteSubtask}
                                            updateSubtaskTitle={updateSubtaskTitle}
                                        />
                                    ))}
                                </>
                            )}

                            {/* Add SubTask Input - appears at the bottom of subtasks section */}
                            {isAddingSubTask && (
                                <div className="bg-glass-bg/30 backdrop-blur-glass rounded-lg">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={subTaskText}
                                            onChange={(e) => setSubTaskText(e.target.value)}
                                            onKeyDown={handleSubTaskKeyPress}
                                            placeholder="Enter subtask title"
                                            className="w-full text-sm bg-transparent border border-turquoise rounded px-3 py-2 pr-8 text-text-primary outline-none placeholder-text-secondary/60"
                                            autoFocus
                                        />
                                        {/* Cancel X button inside input */}
                                        <button
                                            onClick={() => {
                                                setSubTaskText('');
                                                setIsAddingSubTask(false);
                                            }}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-500/20 rounded transition-all duration-200"
                                            title="Cancel"
                                        >
                                            <svg className="w-3 h-3 text-text-secondary hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
        )}
        </div>
    )
}

export default Task;