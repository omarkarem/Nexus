import React, { useState, useCallback, useEffect } from 'react';
import { fetchLists, createList as apiCreateList, updateList as apiUpdateList, deleteList as apiDeleteList } from '../utils/listApi';
import { 
  fetchTasksByList, 
  createTask as apiCreateTask, 
  updateTask as apiUpdateTask, 
  deleteTask as apiDeleteTask,
  moveTask as apiMoveTask,
  reorderTasks as apiReorderTasks,
  addSubTask as apiAddSubTask,
  updateSubTask as apiUpdateSubTask,
  deleteSubTask as apiDeleteSubTask
} from '../utils/taskApi';

const useListData = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load lists from API on component mount
  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedLists = await fetchLists();
      
      // Fetch tasks for each list
      const listsWithTasks = await Promise.all(
        fetchedLists.map(async (list) => {
          const tasks = await fetchTasksByList(list.id);
          return {
            ...list,
            tasks: tasks || []
          };
        })
      );
      
      setLists(listsWithTasks);
    } catch (err) {
      console.error('Error loading lists:', err);
      setError('Failed to load lists');
    } finally {
      setLoading(false);
    }
  };

  // Create List
  const createList = async (listTitle, listColor, description = '') => {
    try {
      const newList = await apiCreateList(listTitle, listColor, description);
      if (newList) {
        // Add empty tasks array to new list
        const listWithTasks = { ...newList, tasks: [] };
        setLists(prevLists => [listWithTasks, ...prevLists]);
        return listWithTasks;
      }
    } catch (error) {
      console.error('Error creating list:', error);
      setError('Failed to create list');
    }
  };

  // Edit List
  const editList = async (listId, newTitle, newColor, newDescription = '') => {
    try {
      const updatedList = await apiUpdateList(listId, newTitle, newColor, newDescription);
      if (updatedList) {
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === listId ? { 
              ...list, 
              title: updatedList.title,
              color: updatedList.color,
              description: updatedList.description,
              updatedAt: updatedList.updatedAt
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error editing list:', error);
      setError('Failed to update list');
    }
  };

  // Delete List
  const deleteList = async (listId) => {
    try {
      const success = await apiDeleteList(listId);
      if (success) {
        setLists(prevLists => prevLists.filter(list => list.id !== listId));
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      setError('Failed to delete list');
    }
  };

  // Task management functions - now using real API calls
  const toggleTaskComplete = async (taskId, boardId, listId) => {
    // Get current task to determine new completion status
    const list = lists.find(l => l.id === listId);
    const task = list?.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompletedStatus = !task.completed;
    const newBoard = newCompletedStatus ? 'Done' : (task.lastBoard || task.originalBoard || boardId);

    try {
      // Update via API
      const updatedTask = await apiUpdateTask(taskId, {
        completed: newCompletedStatus,
        board: newBoard
      });

      if (updatedTask) {
        // Update local state
        setLists(prevLists => 
          prevLists.map(list =>
            list.id === listId ? { 
              ...list, 
              tasks: list.tasks.map(t => 
                t.id === taskId ? updatedTask : t
              )
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const updateTaskTitle = async (taskId, newTitle, listId) => {
    try {
      // Update via API
      const updatedTask = await apiUpdateTask(taskId, { title: newTitle });

      if (updatedTask) {
        // Update local state
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === listId ? {
              ...list, 
              tasks: list.tasks.map(task =>
                task.id === taskId ? updatedTask : task
              )
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error updating task title:', error);
    }
  };

  const deleteTask = async (taskId, boardId, listId) => {
    try {
      // Delete via API
      const success = await apiDeleteTask(taskId);

      if (success) {
        // Update local state
        setLists(prevLists =>
          prevLists.map(list => 
            list.id === listId ? {
              ...list, 
              tasks: list.tasks.filter(task => task.id !== taskId)
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addTask = async (taskTitle, boardId, targetListId) => {
    try {
      // Create via API
      const newTask = await apiCreateTask(taskTitle, boardId, targetListId);

      if (newTask) {
        // Update local state
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === targetListId ? {
              ...list, 
              tasks: [...list.tasks, newTask]
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTaskNote = async (taskId, boardId, noteText, listId) => {
    try {
      // Update via API
      const updatedTask = await apiUpdateTask(taskId, { note: noteText });

      if (updatedTask) {
        // Update local state
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === listId ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId ? updatedTask : task
              )
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error updating task note:', error);
    }
  };

  // SubTasks functions - now using real API calls
  const addSubTask = async (taskId, subTaskTitle, listId) => {
    try {
      // Add via API
      const newSubTask = await apiAddSubTask(taskId, subTaskTitle);

      if (newSubTask) {
        // Update local state
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === listId ? {
              ...list, 
              tasks: list.tasks.map(task =>
                task.id === taskId ? {
                  ...task, 
                  subTasks: [...(task.subTasks || []), newSubTask]
                } : task
              )
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const toggleSubTaskComplete = async (taskId, subTaskId, listId) => {
    // Get current subtask to determine new completion status
    const list = lists.find(l => l.id === listId);
    const task = list?.tasks.find(t => t.id === taskId);
    const subTask = task?.subTasks?.find(st => st.id === subTaskId);
    if (!subTask) return;

    try {
      // Update via API
      const updatedSubTask = await apiUpdateSubTask(taskId, subTaskId, {
        completed: !subTask.completed
      });

      if (updatedSubTask) {
        // Update local state
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === listId ? {
              ...list, 
              tasks: list.tasks.map(task =>
                task.id === taskId ? {
                  ...task, 
                  subTasks: task.subTasks?.map(subtask => 
                    subtask.id === subTaskId ? updatedSubTask : subtask
                  )
                } : task
              )
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error toggling subtask completion:', error);
    }
  };

  const deleteSubtask = async (parentTaskId, subtaskId, listId) => {
    try {
      // Delete via API
      const success = await apiDeleteSubTask(parentTaskId, subtaskId);

      if (success) {
        // Update local state
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === listId ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === parentTaskId ? {
                  ...task,
                  subTasks: task.subTasks?.filter(subtask => subtask.id !== subtaskId)
                } : task
              )
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };
  
  const updateSubtaskTitle = async (parentTaskId, subtaskId, newTitle, listId) => {
    try {
      // Update via API
      const updatedSubTask = await apiUpdateSubTask(parentTaskId, subtaskId, {
        title: newTitle
      });

      if (updatedSubTask) {
        // Update local state
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === listId ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === parentTaskId ? {
                  ...task,
                  subTasks: task.subTasks?.map(subtask =>
                    subtask.id === subtaskId ? updatedSubTask : subtask
                  )
                } : task
              )
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error updating subtask title:', error);
    }
  };

  // Handle same-board reordering with Framer Motion
  const moveTask = useCallback(async (taskId, sourceBoard, targetBoard, dropIndex, listId, newOrderedTasks) => {
    // Update local state immediately for smooth UI
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.id !== listId) return list;
        
        // Update from Framer Motion reorder
        if (newOrderedTasks && sourceBoard === targetBoard) {
          // Create a copy of all tasks
          let updatedTasks = [...list.tasks];
          const beforeCount = updatedTasks.length;
          
          // Update only the reordered tasks with new order values
          newOrderedTasks.forEach((task, index) => {
            const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
              updatedTasks[taskIndex] = { ...task, order: index };
            } else {
              console.error('❌ Task not found in list:', task.id, task.title);
            }
          });
          
          const afterCount = updatedTasks.length;
          
          if (beforeCount !== afterCount) {
            console.error('🚨 TASK COUNT MISMATCH! Tasks may have disappeared');
          }
          
          return { ...list, tasks: updatedTasks };
        }
        
        return list;
      })
    );

    // Sync with API in background (for reordering)
    if (newOrderedTasks && sourceBoard === targetBoard) {
      try {
        const taskUpdates = newOrderedTasks.map((task, index) => ({
          taskId: task.id,
          order: index
        }));
        
        console.log('🔄 Frontend: Sending reorder request:', {
          board: sourceBoard,
          listId: listId,
          updates: taskUpdates
        });
        
        const success = await apiReorderTasks(taskUpdates);
        
        if (success) {
          console.log('✅ Frontend: Reorder API call successful');
        } else {
          console.error('❌ Frontend: Reorder API call failed');
        }
      } catch (error) {
        console.error('❌ Frontend: Error syncing task order with API:', error);
        // Could reload data here if needed
      }
    }
  }, []);

  // Cross-board movement function
  const moveTaskCrossBoard = useCallback(async (taskId, sourceBoard, targetBoard, listId) => {
    console.log('🔄 Cross-board move:', { taskId, sourceBoard, targetBoard });
    
    // Get current task
    const list = lists.find(l => l.id === listId);
    const task = list?.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Determine completion status based on target board
    const completedStatus = targetBoard === 'Done' ? true : 
                          targetBoard !== 'Done' && sourceBoard === 'Done' ? false : 
                          task.completed;

    try {
      // Move via API
      const updatedTask = await apiMoveTask(taskId, targetBoard, 0, completedStatus);

      if (updatedTask) {
        // Update local state
        setLists(prevLists =>
          prevLists.map(list => {
            if (list.id !== listId) return list;
            
            return {
              ...list,
              tasks: list.tasks.map(t => 
                t.id === taskId ? updatedTask : t
              )
            };
          })
        );
      }
    } catch (error) {
      console.error('Error moving task across boards:', error);
    }
  }, [lists]);

  // Expose moveTaskCrossBoard globally for Task components
  React.useEffect(() => {
    window.moveTaskCrossBoard = moveTaskCrossBoard;
    return () => {
      delete window.moveTaskCrossBoard;
    };
  }, [moveTaskCrossBoard]);

  return {
    lists,
    setLists,
    loading,
    error,
    loadLists,
    toggleTaskComplete,
    updateTaskTitle,
    deleteTask,
    updateTaskNote,
    addTask,
    addSubTask,
    toggleSubTaskComplete,
    deleteSubtask,
    updateSubtaskTitle,
    createList,
    editList,
    deleteList,
    moveTask,
    moveTaskCrossBoard
  };
};

export default useListData; 