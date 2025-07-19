import React, { useState, useRef } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import AddTask from './AddTask';
import Task from './Task';

const Board = ({ name, borderColor, tasks = [], boardId, color, toggleTaskComplete, updateTaskTitle, deleteTask, updateTaskNote, addTask, listOptions, currentList, addSubTask, toggleSubTaskComplete, deleteSubtask, updateSubtaskTitle, listId, moveTask }) => {
    const [draggedTask, setDraggedTask] = useState(null); // Track What is being dragged
    const [isHovering, setIsHovering] = useState(false);
    const boardRef = useRef(null);

    // Get color class based on color
    const getColorClass = (colorName) => {
        const colorMap = {
            red: 'bg-gray-600',
            orange: 'bg-gray-500',
            green: 'bg-gray-400',
            blue: 'bg-gray-700',
            purple: 'bg-gray-800',
            pink: 'bg-gray-300',
            black: 'bg-black'
        };
        
        return colorMap[colorName] || 'bg-gray-500';
    };

    // Get sorted tasks for consistent ordering
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

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
        
        console.log('✅ Reordering within board:', boardId);
        
        validTasks.forEach((task, index) => {
            task.order = index;
        });
        
        moveTask(validTasks[0].id, boardId, boardId, 0, listId, validTasks);
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
        }
        
        // Reset states
        setDraggedTask(null);
        setIsHovering(false);
    };

    // Handle drag start
    const handleDragStart = (task) => {
        setDraggedTask(task);
    };

    // Handle drag end  
    const handleDragEnd = () => {
        setDraggedTask(null);
        setIsHovering(false);
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

    return(
        <div 
            ref={boardRef}
            data-board-id={boardId}
            className={`w-full min-h-[80vh] bg-gradient-glass backdrop-blur-glass border border-${borderColor} rounded-xl py-4 px-6 transition-all duration-200 ${
                isHovering && draggedTask ? 'ring-2 ring-turquoise/50 bg-turquoise/5' : ''
            }`}
        >
            <div className="flex flex-col items-center">
                <div className="w-full flex items-center">
                    <div className="flex items-center">
                    <h3 className='text-[24px]'>{name}</h3>
                        {name === 'Done' && (
                            <svg className="w-6 h-6 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    
                    {boardId !== 'Done' && (
                        <div className='flex items-center ml-auto text-[26px]'>+</div>
                    )}
                </div>

                <Reorder.Group 
                    axis="y" 
                    values={sortedTasks} 
                    onReorder={handleReorder}
                    className="w-full py-4 min-h-fit"
                    layoutScroll
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '12px'
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
                                rotate: 3,
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
                    <AddTask boardId={boardId} addTask={addTask} listOptions={listOptions} currentList={currentList} />
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