import React, { useState, useCallback, useEffect } from 'react';
import { fetchLists, createList as apiCreateList, updateList as apiUpdateList, deleteList as apiDeleteList } from '../utils/listApi';
import { 
  fetchTasksByList, 
  createTask as apiCreateTask, 
  updateTask as apiUpdateTask, 
  deleteTask as apiDeleteTask,
  moveTask as apiMoveTask,
  reorderTasks as apiReorderTasks,
  fetchAllTasksForUser,
  reorderTasksAllLists as apiReorderTasksAllLists,
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
      
      console.log('📋 Fetched lists from API:', fetchedLists);
      
      // Fetch tasks for each list
      const listsWithTasks = await Promise.all(
        fetchedLists.map(async (list) => {
          console.log(`🔄 Processing list: ${list.title} (isAllLists: ${list.isAllLists})`);
          
          // Special handling for "All Lists"
          if (list.title === 'All Lists' || list.isAllLists) {
            console.log('🎯 Found All Lists, fetching all tasks...');
            const allTasks = await fetchAllTasksForUser();
            console.log('📝 All tasks fetched:', allTasks?.length || 0, 'tasks');
            return { ...list, tasks: allTasks || [], isAllLists: true };
          } else {
            const tasks = await fetchTasksByList(list.id);
            console.log(`📝 Tasks for ${list.title}:`, tasks?.length || 0, 'tasks');
            return { ...list, tasks: tasks || [] };
          }
        })
      );
      
      console.log('✅ Final lists with tasks:', listsWithTasks);
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
      console.log('🔄 Creating list:', { listTitle, listColor, description });
      const newList = await apiCreateList(listTitle, listColor, description);
      console.log('✅ New list created:', newList);
      
      if (newList) {
        // Reload all lists to include the auto-created "All Lists" if this was the first list
        console.log('🔄 Reloading all lists to include All Lists...');
        await loadLists();
        return newList;
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

  // Refresh All Lists data to ensure listInfo is correct
  const refreshAllListsData = async () => {
    try {
      const allTasks = await fetchAllTasksForUser();
      setLists(prevLists =>
        prevLists.map(list => {
          if (list.isAllLists || list.title === 'All Lists') {
            return { ...list, tasks: allTasks || [] };
          }
          return list;
        })
      );
    } catch (error) {
      console.error('Error refreshing All Lists data:', error);
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
    const isAllListsView = list?.isAllLists || list?.title === 'All Lists';

    console.log('🔄 Toggling task completion:', {
      taskId,
      taskTitle: task.title,
      currentList: list.title,
      isAllLists: isAllListsView,
      currentListInfo: task.listInfo,
      newCompletedStatus,
      newBoard
    });

    try {
      // Update via API
      const updatedTask = await apiUpdateTask(taskId, {
        completed: newCompletedStatus,
        board: newBoard
      });

      console.log('✅ API response:', updatedTask);

      if (updatedTask) {
        // Update local state in ALL lists (sync changes everywhere)
        setLists(prevLists => 
          prevLists.map(list => {
            // Update the task in every list where it appears
            const hasTask = list.tasks.some(t => t.id === taskId);
            if (!hasTask) return list;
            
            return {
              ...list,
              tasks: list.tasks.map(t => {
                if (t.id === taskId) {
                  if (list.isAllLists || list.title === 'All Lists') {
                    // For All Lists view, preserve the listInfo field
                    const taskWithListInfo = {
                      ...updatedTask,
                      listInfo: t.listInfo // Preserve the original listInfo
                    };
                    console.log('🔄 Preserving listInfo in All Lists:', {
                      taskId,
                      originalListInfo: t.listInfo,
                      preservedListInfo: taskWithListInfo.listInfo
                    });
                    return taskWithListInfo;
                  } else {
                    // For regular lists, use the updated task directly
                    return updatedTask;
                  }
                }
                return t;
              })
            };
          })
        );

        // If we're in All Lists view, refresh the data to ensure listInfo is correct
        if (isAllListsView) {
          console.log('🔄 Refreshing All Lists data after task update...');
          setTimeout(() => refreshAllListsData(), 100);
        }
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
          prevLists.map(list => {
            if (list.id === listId) {
              return {
                ...list, 
                tasks: list.tasks.map(task =>
                  task.id === taskId ? updatedTask : task
                )
              };
            } else if (list.isAllLists || list.title === 'All Lists') {
              // For All Lists view, preserve the listInfo field
              return {
                ...list,
                tasks: list.tasks.map(task => {
                  if (task.id === taskId) {
                    return {
                      ...updatedTask,
                      listInfo: task.listInfo // Preserve the original listInfo
                    };
                  }
                  return task;
                })
              };
            }
            return list;
          })
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
        // Update local state - remove from both the original list and All Lists
        setLists(prevLists =>
          prevLists.map(list => 
            list.id === listId ? {
              ...list, 
              tasks: list.tasks.filter(task => task.id !== taskId)
            } : list.isAllLists || list.title === 'All Lists' ? {
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
        // Find the target list to get its info for All Lists view
        const targetList = lists.find(l => l.id === targetListId);
        
        // Update local state
        setLists(prevLists =>
          prevLists.map(list => {
            if (list.id === targetListId) {
              // Add to the target list
              return {
                ...list, 
                tasks: [...list.tasks, newTask]
              };
            } else if (list.isAllLists || list.title === 'All Lists') {
              // Add to All Lists view with listInfo
              const taskWithListInfo = {
                ...newTask,
                listInfo: {
                  id: targetList.id,
                  title: targetList.title,
                  color: targetList.color
                }
              };
              return {
                ...list,
                tasks: [...list.tasks, taskWithListInfo]
              };
            }
            return list;
          })
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
          prevLists.map(list => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: list.tasks.map(task =>
                  task.id === taskId ? updatedTask : task
                )
              };
            } else if (list.isAllLists || list.title === 'All Lists') {
              // For All Lists view, preserve the listInfo field
              return {
                ...list,
                tasks: list.tasks.map(task => {
                  if (task.id === taskId) {
                    return {
                      ...updatedTask,
                      listInfo: task.listInfo // Preserve the original listInfo
                    };
                  }
                  return task;
                })
              };
            }
            return list;
          })
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
          prevLists.map(list => {
            if (list.id === listId) {
              return {
                ...list, 
                tasks: list.tasks.map(task =>
                  task.id === taskId ? {
                    ...task, 
                    subTasks: [...(task.subTasks || []), newSubTask]
                  } : task
                )
              };
            } else if (list.isAllLists || list.title === 'All Lists') {
              // For All Lists view, preserve the listInfo field
              return {
                ...list,
                tasks: list.tasks.map(task => {
                  if (task.id === taskId) {
                    return {
                      ...task,
                      subTasks: [...(task.subTasks || []), newSubTask],
                      listInfo: task.listInfo // Preserve the original listInfo
                    };
                  }
                  return task;
                })
              };
            }
            return list;
          })
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
    const currentList = lists.find(l => l.id === listId);
    const isAllListsView = currentList?.isAllLists || currentList?.title === 'All Lists';
    
    // Update local state immediately for smooth UI
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.id !== listId) return list;
        
        // Update from Framer Motion reorder
        if (newOrderedTasks && sourceBoard === targetBoard) {
          // Create a copy of all tasks
          let updatedTasks = [...list.tasks];
          
          // Update the reordered tasks with new order values
          newOrderedTasks.forEach((task, index) => {
            const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
              if (isAllListsView) {
                // Update allListsOrder for All Lists view
                updatedTasks[taskIndex] = { ...task, allListsOrder: index };
              } else {
                // Update regular order for normal lists
                updatedTasks[taskIndex] = { ...task, order: index };
              }
            }
          });
          
          return { ...list, tasks: updatedTasks };
        }
        
        return list;
      })
    );

    // Sync with API in background (for reordering)
    if (newOrderedTasks && sourceBoard === targetBoard) {
      try {
        if (isAllListsView) {
          // Use All Lists reorder API
          const taskUpdates = newOrderedTasks.map((task, index) => ({
            taskId: task.id,
            allListsOrder: index
          }));
          
          console.log('🔄 Frontend: Sending All Lists reorder request:', taskUpdates);
          const success = await apiReorderTasksAllLists(taskUpdates);
          
          if (success) {
            console.log('✅ Frontend: All Lists reorder API call successful');
          } else {
            console.error('❌ Frontend: All Lists reorder API call failed');
          }
        } else {
          // Use regular reorder API
          const taskUpdates = newOrderedTasks.map((task, index) => ({
            taskId: task.id,
            order: index
          }));
          
          console.log('🔄 Frontend: Sending regular reorder request:', taskUpdates);
          const success = await apiReorderTasks(taskUpdates);
          
          if (success) {
            console.log('✅ Frontend: Regular reorder API call successful');
          } else {
            console.error('❌ Frontend: Regular reorder API call failed');
          }
        }
      } catch (error) {
        console.error('❌ Frontend: Error syncing task order with API:', error);
      }
    }
  }, [lists]);

  // Cross-board movement function
  const moveTaskCrossBoard = useCallback(async (taskId, sourceBoard, targetBoard, listId) => {
    console.log('🔄 Cross-board move:', { taskId, sourceBoard, targetBoard });
    
    // Get current task from any list
    const task = lists.flatMap(l => l.tasks).find(t => t.id === taskId);
    if (!task) return;

    // Determine completion status based on target board
    const completedStatus = targetBoard === 'Done' ? true : 
                          targetBoard !== 'Done' && sourceBoard === 'Done' ? false : 
                          task.completed;

    try {
      // Move via API
      const updatedTask = await apiMoveTask(taskId, targetBoard, 0, completedStatus);

      if (updatedTask) {
        // Update local state in ALL lists (sync board changes everywhere)
        setLists(prevLists =>
          prevLists.map(list => {
            // Update the task in every list where it appears
            const hasTask = list.tasks.some(t => t.id === taskId);
            if (!hasTask) return list;
            
            return {
              ...list,
              tasks: list.tasks.map(t => {
                if (t.id === taskId) {
                  // For All Lists view, preserve the listInfo field
                  if (list.isAllLists || list.title === 'All Lists') {
                    return {
                      ...updatedTask,
                      listInfo: t.listInfo // Preserve the original listInfo
                    };
                  } else {
                    return updatedTask;
                  }
                }
                return t;
              })
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