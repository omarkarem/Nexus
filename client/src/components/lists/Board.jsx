import React, { useState, useRef, useEffect } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import AddTask from './AddTask';
import Task from './Task';
import ReactDOM from 'react-dom';

const Board = ({ name, borderColor, tasks = [], boardId, color, toggleTaskComplete, updateTaskTitle, deleteTask, updateTaskNote, addTask, listOptions, currentList, addSubTask, toggleSubTaskComplete, deleteSubtask, updateSubtaskTitle, listId, moveTask }) => {
    const [draggedTask, setDraggedTask] = useState(null); // Track What is being dragged
    const [isHovering, setIsHovering] = useState(false);
    const boardRef = useRef(null);

    // --- Drag Preview State ---
    const [isDragPreviewVisible, setIsDragPreviewVisible] = useState(false);
    const [dragPreviewPosition, setDragPreviewPosition] = useState({ x: 0, y: 0 });
    const [draggedTaskForPreview, setDraggedTaskForPreview] = useState(null);
    // --- End Drag Preview State ---
    // Store pointer offset for accurate ghost positioning
    const pointerOffsetRef = useRef({ x: 0, y: 0 });
    // Track a task that is pending move out of this board
    const [pendingMoveTaskId, setPendingMoveTaskId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    // Check if we're in All Lists view
    const isAllListsView = currentList?.isAllLists || currentList?.title === 'All Lists';

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

    // Get sorted tasks for consistent ordering - use correct order field
    const sortedTasks = [...tasks].sort((a, b) => {
        if (isAllListsView) {
            return (a.allListsOrder || 0) - (b.allListsOrder || 0);
        } else {
            return (a.order || 0) - (b.order || 0);
        }
    });

    // Handle reordering within this board (Framer Motion Reorder)
    const handleReorder = (newOrder) => {
        if (!newOrder || newOrder.length === 0) {
            console.warn('⚠️ Empty reorder array received');
            return;
        }
        
        const validTasks = newOrder.filter(task => task.board === boardId);
        if (validTasks.length !== newOrder.length) {
            console.warn('⚠️ Some tasks do not belong to this board');
            return;
        }
        
        console.log('✅ Reordering within board:', boardId, 'All Lists view:', isAllListsView);
        console.log('📝 Tasks to reorder:', validTasks.map(t => ({ id: t.id, title: t.title, currentOrder: isAllListsView ? t.allListsOrder : t.order })));
        
        // Update the correct order field based on view
        validTasks.forEach((task, index) => {
            if (isAllListsView) {
                task.allListsOrder = index;
                console.log(`🔄 Updated ${task.title} allListsOrder to ${index}`);
            } else {
                task.order = index;
                console.log(`🔄 Updated ${task.title} order to ${index}`);
            }
        });
        
        moveTask(validTasks[0].id, boardId, boardId, 0, listId, validTasks);
    };

    // Capture pointer position for ghost preview
    const handlePointerDown = (event, task) => {
        // Get bounding rect of the task element
        const taskElem = event.currentTarget;
        const rect = taskElem.getBoundingClientRect();
        // Calculate offset between pointer and top-left of the task
        pointerOffsetRef.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        // Set initial drag preview position
        setDragPreviewPosition({ x: event.clientX, y: event.clientY });
    };

    // Handle drag start
    const handleDragStart = (task) => {
        setDraggedTask(task);
        setDraggedTaskForPreview(task);
        setIsDragPreviewVisible(true);
        // Listen to mousemove for preview
        const handleMouseMove = (e) => {
            setDragPreviewPosition({ x: e.clientX, y: e.clientY });
        };
        document.addEventListener('mousemove', handleMouseMove);
        // Store cleanup on window for drag end
        window.__nexusDragPreviewCleanup = () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    };

    // Handle drag end  
    const handleDragEnd = () => {
        setDraggedTask(null);
        setIsHovering(false);
        setIsDragPreviewVisible(false);
        setDraggedTaskForPreview(null);
        if (window.__nexusDragPreviewCleanup) {
            window.__nexusDragPreviewCleanup();
            window.__nexusDragPreviewCleanup = null;
        }
    };

    // Handle cross-board drag end
    const handleCrossBoardDragEnd = (event, info, task) => {
        const { point } = info;
        
        // Find all elements under the cursor
        const elements = document.elementsFromPoint(point.x, point.y);
        const targetBoardElement = elements.find(el => 
            el.getAttribute('data-board-id') && 
            el.getAttribute('data-board-id') !== boardId
        );
        
        if (targetBoardElement) {
            const targetBoardId = targetBoardElement.getAttribute('data-board-id');
            console.log(`🎯 Cross-board drag: ${task.title} from ${boardId} to ${targetBoardId}`);
            
            if (window.moveTaskCrossBoard) {
                window.moveTaskCrossBoard(task.id, boardId, targetBoardId, listId);
            }
            // Mark this task as pending move out
            setPendingMoveTaskId(task.id);
        }
        
        // Reset states
        setDraggedTask(null);
        setIsHovering(false);
        setIsDragPreviewVisible(false);
        setDraggedTaskForPreview(null);
        if (window.__nexusDragPreviewCleanup) {
            window.__nexusDragPreviewCleanup();
            window.__nexusDragPreviewCleanup = null;
        }
    };

    // Monitor mouse position during drag to show hover effects
    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!draggedTask) return;
            
            const rect = boardRef.current?.getBoundingClientRect();
            if (!rect) return;
            
            const isOverThisBoard = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );
            
            if (isOverThisBoard && draggedTask.board !== boardId) {
                setIsHovering(true);
            } else if (!isOverThisBoard) {
                setIsHovering(false);
            }
        };
        
        if (draggedTask) {
            document.addEventListener('mousemove', handleMouseMove);
            return () => document.removeEventListener('mousemove', handleMouseMove);
        }
    }, [draggedTask, boardId]);

    // When tasks update, clear pendingMoveTaskId if the task is no longer present
    useEffect(() => {
        if (pendingMoveTaskId && !tasks.some(t => t.id === pendingMoveTaskId)) {
            setPendingMoveTaskId(null);
        }
    }, [tasks, pendingMoveTaskId]);

    return(
        <div 
            ref={boardRef}
            data-board-id={boardId}
            className={`w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] bg-gradient-glass backdrop-blur-glass border border-${borderColor} rounded-xl py-3 sm:py-4 px-3 sm:px-4 lg:px-6 transition-all duration-200 ${
                isHovering && draggedTask ? 'ring-2 ring-turquoise/50 bg-turquoise/5' : ''
            }`}
        >
            {/* --- Drag Preview Ghost Copy (Portal) --- */}
            {isDragPreviewVisible && draggedTaskForPreview && ReactDOM.createPortal(
                <motion.div
                    style={{
                        position: 'fixed',
                        left: dragPreviewPosition.x - pointerOffsetRef.current.x,
                        top: dragPreviewPosition.y - pointerOffsetRef.current.y,
                        pointerEvents: 'none',
                        opacity: 0.9,
                        zIndex: 99999,
                        transform: 'scale(1.05) rotate(2deg)',
                        width: '320px',
                        maxWidth: '90vw',
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.05, opacity: 0.9 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                >
                    <Task
                        task={draggedTaskForPreview}
                        index={0}
                        toggleTaskComplete={() => {}}
                        boardId={boardId}
                        updateTaskTitle={() => {}}
                        deleteTask={() => {}}
                        updateTaskNote={() => {}}
                        addSubTask={() => {}}
                        toggleSubTaskComplete={() => {}}
                        deleteSubtask={() => {}}
                        updateSubtaskTitle={() => {}}
                        listId={listId}
                        currentList={currentList}
                        isGhosting={false}
                    />
                </motion.div>,
                document.body
            )}
            {/* --- End Drag Preview Ghost Copy (Portal) --- */}

            <div className="flex flex-col items-center">
                <div className="w-full flex items-center">
                    <div className="flex items-center">
                    <h3 className='text-lg sm:text-xl lg:text-2xl'>{name}</h3>
                        {name === 'Done' && (
                        //     <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-500 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        // </svg>
                        <></>
                      )}
                    </div>

                    {boardId !== 'Done' && (
                        <button
                        className='flex items-center ml-auto text-xl sm:text-2xl lg:text-3xl'
                        onClick={() => setIsAdding(true)}
                        title="Add Task"
                        >+
                        </button>
                    )}
                </div>

                <Reorder.Group 
                    axis="y" 
                    values={sortedTasks} 
                    onReorder={handleReorder}
                    className="w-full py-3 sm:py-4 min-h-fit"
                    layoutScroll
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '8px'
                    }}
                >
                  <AnimatePresence mode="popLayout">
                    {sortedTasks.map((task, index) => (
                        <Reorder.Item 
                            key={task.id} 
                            value={task}
                            className="cursor-grab active:cursor-grabbing"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 0,
                                transition: { 
                                    type: "spring", 
                                    stiffness: 500, 
                                    damping: 30,
                                    delay: index * 0.1
                                }
                            }}
                            exit={{ 
                                opacity: 0, 
                                scale: 0.8, 
                                y: -20,
                                transition: { duration: 0.2 }
                            }}
                            layout
                            layoutId={`task-${task.id}`}
                            whileDrag={{ 
                                scale: 1.05, 
                                zIndex: 999,
                                boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
                                cursor: 'grabbing'
                            }}
                            transition={{
                                layout: { 
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30
                                }
                            }}
                            dragTransition={{ 
                                bounceStiffness: 300, 
                                bounceDamping: 25 
                            }}
                            style={{
                                listStyle: 'none'
                            }}
                            onPointerDown={e => handlePointerDown(e, task)}
                            onDragStart={() => handleDragStart(task)}
                            onDragEnd={(event, info) => {
                                // Check if this was a cross-board drag
                                handleCrossBoardDragEnd(event, info, task);
                                // Always call the regular drag end to reset states
                                handleDragEnd();
                            }}
                        >
                            <Task 
                                task={task} 
                                index={index}
                                toggleTaskComplete={toggleTaskComplete} 
                                boardId={boardId} 
                                updateTaskTitle={updateTaskTitle}
                                deleteTask={deleteTask}
                                updateTaskNote={updateTaskNote}
                                addSubTask={addSubTask}
                                toggleSubTaskComplete={toggleSubTaskComplete}
                                deleteSubtask={deleteSubtask}
                                updateSubtaskTitle={updateSubtaskTitle}
                                listId={listId}
                                currentList={currentList}
                                isGhosting={
                                    (isDragPreviewVisible && draggedTaskForPreview && draggedTaskForPreview.id === task.id)
                                    || pendingMoveTaskId === task.id
                                }
                            />
                        </Reorder.Item>
                    ))}
                  </AnimatePresence>
                  
                  {/* Drop zone indicator for cross-board drops */}
                  {isHovering && draggedTask && draggedTask.board !== boardId && (
                      <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="h-16 border-2 border-dashed border-turquoise/50 rounded-lg bg-turquoise/10 flex items-center justify-center"
                      >
                          <p className="text-turquoise text-sm font-medium">Drop here to move to {name}</p>
                      </motion.div>
                  )}
                  
                  {/* Empty state for non-Done boards */}
                  {sortedTasks.length === 0 && !isHovering && boardId !== 'Done' && boardId !== 'today' && (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed border-glass-border/30 rounded-lg">
                          <p className="text-text-secondary/60 text-sm">No tasks yet</p>
                      </div>
                  )}
                </Reorder.Group>

                {/*Add Task - Only show for non-Done boards */}
                {boardId !== 'Done' && (
                    <AddTask 
                        boardId={boardId} 
                        addTask={addTask} 
                        listOptions={listOptions} 
                        currentList={currentList} 
                        addSubTask={addSubTask}
                        isAdding={isAdding}
                        setIsAdding={setIsAdding}
                    />
                )}

                {/* Empty state for today board */}
                {sortedTasks.length === 0 && !isHovering && boardId === 'today' && (
                    <div className="flex flex-col mt-[250px] items-center justify-center h-20">
                        <p className="text-text-secondary/60 text-sm">All Clear</p>
                    </div>
                )}

                {/* Empty state for Done board */}
                {sortedTasks.length === 0 && !isHovering && boardId === 'Done' && (
                    <div className="flex flex-col mt-[292px] items-center justify-center h-20">
                        <p className="text-text-secondary/60 text-sm">All Clear</p>
                    </div>
                )}
                
            </div>
        </div>
    )
}

export default Board;