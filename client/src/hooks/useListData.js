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
  deleteSubTask as apiDeleteSubTask,
  deleteAllCompletedTasks as apiDeleteAllCompletedTasks
} from '../utils/taskApi';
import useSocket, { SOCKET_EVENTS } from './useSocket';

const useListData = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user info from localStorage for socket authentication
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // WebSocket event handlers for real-time updates
  const socketEventHandlers = {
    [SOCKET_EVENTS.TASK_CREATED]: (data) => {
      console.log('📨 Task created via WebSocket:', data);
      const { task, listId } = data;
      
      setLists(prevLists =>
        prevLists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              tasks: [...list.tasks, task]
            };
          } else if (list.isAllLists || list.title === 'All Lists') {
            // Add to All Lists view with listInfo
            const targetList = prevLists.find(l => l.id === listId);
            const taskWithListInfo = {
              ...task,
              listInfo: {
                id: targetList?.id,
                title: targetList?.title,
                color: targetList?.color,
                imageUrl: targetList?.imageUrl
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
    },

    [SOCKET_EVENTS.TASK_UPDATED]: (data) => {
      console.log('📨 Task updated via WebSocket:', data);
      const { task } = data;
      
      setLists(prevLists =>
        prevLists.map(list => ({
          ...list,
          tasks: list.tasks.map(t =>
            t.id === task.id
              ? { ...task, listInfo: t.listInfo } // Preserve listInfo for All Lists
              : t
          )
        }))
      );
    },

    [SOCKET_EVENTS.TASK_DELETED]: (data) => {
      console.log('📨 Task deleted via WebSocket:', data);
      const { taskId } = data;
      
      setLists(prevLists =>
        prevLists.map(list => ({
          ...list,
          tasks: list.tasks.filter(task => task.id !== taskId)
        }))
      );
    },

    [SOCKET_EVENTS.TASK_MOVED]: (data) => {
      console.log('📨 Task moved via WebSocket:', data);
      const { task } = data;
      
      setLists(prevLists =>
        prevLists.map(list => ({
          ...list,
          tasks: list.tasks.map(t =>
            t.id === task.id
              ? { ...task, listInfo: t.listInfo } // Preserve listInfo for All Lists
              : t
          )
        }))
      );
    },

    [SOCKET_EVENTS.TASK_REORDERED]: (data) => {
      console.log('📨 Tasks reordered via WebSocket:', data);
      const { tasks, type } = data;
      
      // Handle both regular reordering and All Lists reordering
      setLists(prevLists =>
        prevLists.map(list => {
          const updatedTasks = [...list.tasks];
          
          tasks.forEach(({ taskId, order, allListsOrder }) => {
            const taskIndex = updatedTasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              if (type === 'allLists' && (list.isAllLists || list.title === 'All Lists')) {
                updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], allListsOrder: allListsOrder };
              } else if (type === 'regular') {
                updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], order: order };
              }
            }
          });
          
          return { ...list, tasks: updatedTasks };
        })
      );
    },

    [SOCKET_EVENTS.TASKS_DELETED_BULK]: (data) => {
      console.log('📨 Tasks deleted bulk via WebSocket:', data);
      const { listId, isAllLists } = data;
      
      setLists(prevLists =>
        prevLists.map(list => {
          if (isAllLists) {
            // Remove all completed tasks from all lists
            return {
              ...list,
              tasks: list.tasks.filter(task => !task.completed)
            };
          } else if (list.id === listId) {
            // Remove completed tasks from specific list only
            return {
              ...list,
              tasks: list.tasks.filter(task => !task.completed)
            };
          } else if (list.isAllLists || list.title === 'All Lists') {
            // Remove completed tasks from All Lists view (only for this specific list)
            return {
              ...list,
              tasks: list.tasks.filter(task => 
                !(task.completed && (task.listInfo?.id === listId || task.list === listId))
              )
            };
          }
          return list;
        })
      );
    },

    [SOCKET_EVENTS.SUBTASK_CREATED]: (data) => {
      console.log('📨 Subtask created via WebSocket:', data);
      const { taskId, subTask } = data;
      
      setLists(prevLists =>
        prevLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId
              ? { ...task, subTasks: [...(task.subTasks || []), subTask] }
              : task
          )
        }))
      );
    },

    [SOCKET_EVENTS.SUBTASK_UPDATED]: (data) => {
      console.log('📨 Subtask updated via WebSocket:', data);
      const { taskId, subTask } = data;
      
      setLists(prevLists =>
        prevLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks?.map(st =>
                    st.id === subTask.id ? subTask : st
                  )
                }
              : task
          )
        }))
      );
    },

    [SOCKET_EVENTS.SUBTASK_DELETED]: (data) => {
      console.log('📨 Subtask deleted via WebSocket:', data);
      const { taskId, subTaskId } = data;
      
      setLists(prevLists =>
        prevLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks?.filter(st => st.id !== subTaskId)
                }
              : task
          )
        }))
      );
    },

    [SOCKET_EVENTS.LIST_CREATED]: (data) => {
      console.log('📨 List created via WebSocket:', data);
      const { list } = data;
      
      setLists(prevLists => [list, ...prevLists]);
    },

    [SOCKET_EVENTS.LIST_UPDATED]: (data) => {
      console.log('📨 List updated via WebSocket:', data);
      const { list } = data;
      
      setLists(prevLists =>
        prevLists.map(l =>
          l.id === list.id ? { ...l, ...list } : l
        )
      );
    },

    [SOCKET_EVENTS.LIST_DELETED]: (data) => {
      console.log('📨 List deleted via WebSocket:', data);
      const { listId } = data;
      
      setLists(prevLists => prevLists.filter(list => list.id !== listId));
    }
  };

  // Initialize WebSocket connection for real-time updates
  const { socket, isConnected } = useSocket(user, socketEventHandlers);

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

  // Create List - hybrid approach with optimistic updates + WebSocket sync
  const createList = async (listTitle, listColor, description = '', imageFile = null) => {
    try {
      console.log('🔄 Creating list:', { listTitle, listColor, description, hasImage: !!imageFile });
      
      // Create optimistic list entry for instant feedback
      const optimisticList = {
        id: 'temp-' + Date.now(),
        title: listTitle,
        description: description,
        color: listColor,
        imageUrl: null,
        isOptimistic: true,
        itemCount: 0,
        completedCount: 0,
        tasks: [],
        updatedAt: new Date().toISOString()
      };
      
      // Add optimistic list immediately
      setLists(prevLists => [optimisticList, ...prevLists]);
      
      // Make API call
      const newList = await apiCreateList(listTitle, listColor, description, imageFile);
      console.log('✅ New list created:', newList);
      
      if (newList) {
        // Replace optimistic list with real one
        setLists(prevLists => 
          prevLists.map(list => 
            list.id === optimisticList.id 
              ? { ...newList, tasks: [] }
              : list
          )
        );
        
        // Check if this was the first list and we need to reload for "All Lists"
        const isFirstList = lists.length === 1; // Only the optimistic list
        if (isFirstList) {
          console.log('🔄 Reloading all lists to include All Lists...');
          await loadLists();
        }
        
        return newList;
      }
    } catch (error) {
      console.error('Error creating list:', error);
      setError('Failed to create list');
      // Remove the optimistic list on error
      setLists(prevLists => prevLists.filter(list => !list.isOptimistic));
    }
  };

  // Edit List - hybrid approach with optimistic updates + WebSocket sync
  const editList = async (listId, newTitle, newColor, newDescription = '', imageFile = null) => {
    try {
      console.log('🔄 Editing list:', { listId, newTitle, newColor, newDescription, hasImage: !!imageFile });
      
      // Optimistic update for instant feedback
      setLists(prevLists =>
        prevLists.map(list =>
          list.id === listId ? { 
            ...list, 
            title: newTitle,
            color: newColor,
            description: newDescription,
            updatedAt: new Date().toISOString()
          } : list
        )
      );
      
      // Make API call
      const updatedList = await apiUpdateList(listId, newTitle, newColor, newDescription, imageFile);
      if (updatedList) {
        // Update with real data from server (including imageUrl if changed)
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === listId ? { 
              ...list, 
              title: updatedList.title,
              color: updatedList.color,
              description: updatedList.description,
              imageUrl: updatedList.imageUrl,
              updatedAt: updatedList.updatedAt
            } : list
          )
        );
      }
    } catch (error) {
      console.error('Error editing list:', error);
      setError('Failed to update list');
      // Revert optimistic update on error
      loadLists();
    }
  };

  // Delete List - hybrid approach with optimistic updates + WebSocket sync
  const deleteList = async (listId) => {
    try {
      // Store the list for potential rollback
      const listToDelete = lists.find(list => list.id === listId);
      
      // Optimistic update for instant feedback
      setLists(prevLists => prevLists.filter(list => list.id !== listId));
      
      // Make API call
      const success = await apiDeleteList(listId);
      if (!success) {
        // Rollback if API failed
        setLists(prevLists => [...prevLists, listToDelete]);
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      setError('Failed to delete list');
      // Rollback on error
      const listToDelete = lists.find(list => list.id === listId);
      if (listToDelete) {
        setLists(prevLists => [...prevLists, listToDelete]);
      }
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

  // Task management functions - hybrid approach (optimistic + WebSocket backup)
  const toggleTaskComplete = async (taskId, boardId, listId) => {
    try {
      // Get current task to determine new completion status
      const list = lists.find(l => l.id === listId);
      const task = list?.tasks.find(t => t.id === taskId);
      if (!task) return;

      const newCompletedStatus = !task.completed;
      const newBoard = newCompletedStatus ? 'Done' : (task.lastBoard || task.originalBoard || boardId);
      const originalListId = task.listInfo?.id || task.listId || listId;

      console.log('🔄 Toggling task completion:', { taskId, newCompletedStatus, newBoard });

      // Optimistic UI update for immediate feedback
      setLists(prevLists =>
        prevLists.map(l => {
          // Remove from all boards
          const filteredTasks = l.tasks.filter(t => t.id !== taskId);
          const isAllLists = l.isAllLists || l.title === 'All Lists';
          const isOriginalList = l.id === originalListId;
          const isDoneBoard = newCompletedStatus && isOriginalList && newBoard === 'Done';
          if (isAllLists || isOriginalList || isDoneBoard) {
            return {
              ...l,
              tasks: [
                ...filteredTasks,
                { ...task, completed: newCompletedStatus, board: newBoard }
              ]
            };
          }
          return {
            ...l,
            tasks: filteredTasks
          };
        })
      );

      // API call in background
      await apiUpdateTask(taskId, {
        completed: newCompletedStatus,
        board: newBoard
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      setError('Failed to update task');
      // Revert optimistic update on error
      loadLists();
    }
  };

  const updateTaskTitle = async (taskId, newTitle, listId) => {
    try {
      console.log('🔄 Updating task title:', { taskId, newTitle });
      
      // Just make API call - WebSocket will handle UI updates
      await apiUpdateTask(taskId, { title: newTitle });
    } catch (error) {
      console.error('Error updating task title:', error);
      setError('Failed to update task title');
    }
  };

  const deleteTask = async (taskId, boardId, listId) => {
    try {
      console.log('🔄 Deleting task:', { taskId });
      
      // Optimistic UI update for immediate feedback
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
      
      // API call
      await apiDeleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
      // Revert optimistic update on error
      loadLists();
    }
  };

  const deleteAllCompletedTasks = async (listId) => {
    try {
      console.log(`🗑️ Deleting all completed tasks for list: ${listId}`);
      
      // Get completed tasks for optimistic update
      const currentList = lists.find(list => list.id === listId);
      const isAllListsView = currentList?.isAllLists || currentList?.title === 'All Lists';
      
      // Optimistic UI update for immediate feedback
      setLists(prevLists =>
        prevLists.map(list => {
          if (isAllListsView) {
            // If deleting from All Lists view, remove ALL completed tasks from ALL lists
            return {
              ...list,
              tasks: list.tasks.filter(task => !task.completed)
            };
          } else if (list.id === listId) {
            // Remove completed tasks from current specific list only
            return {
              ...list,
              tasks: list.tasks.filter(task => !task.completed)
            };
          } else if (list.isAllLists || list.title === 'All Lists') {
            // Remove completed tasks from All Lists view (only for this specific list)
            return {
              ...list,
              tasks: list.tasks.filter(task => 
                !(task.completed && (task.listInfo?.id === listId || task.list === listId))
              )
            };
          }
          return list;
        })
      );
      
      // API call
      const result = await apiDeleteAllCompletedTasks(listId);
      
      if (result.success) {
        console.log(`✅ Successfully deleted ${result.deletedCount} completed tasks`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error deleting all completed tasks:', error);
      setError('Failed to delete completed tasks');
      // Revert optimistic update on error
      loadLists();
      return { success: false, message: error.message };
    }
  };

  const addTask = async (taskTitle, boardId, targetListId) => {
    try {
      console.log('🔄 Adding task:', { taskTitle, boardId, targetListId });
      
      // Just make API call - WebSocket will handle UI updates
      await apiCreateTask(taskTitle, boardId, targetListId);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task');
    }
  };

  const updateTaskNote = async (taskId, boardId, noteText, listId) => {
    try {
      console.log('🔄 Updating task note:', { taskId, noteText });
      
      // Just make API call - WebSocket will handle UI updates
      await apiUpdateTask(taskId, { note: noteText });
    } catch (error) {
      console.error('Error updating task note:', error);
      setError('Failed to update task note');
    }
  };

  // SubTasks functions - simplified for WebSocket
  const addSubTask = async (taskId, subTaskTitle, listId) => {
    try {
      console.log('🔄 Adding subtask:', { taskId, subTaskTitle });
      
      // Just make API call - WebSocket will handle UI updates
      await apiAddSubTask(taskId, subTaskTitle);
    } catch (error) {
      console.error('Error adding subtask:', error);
      setError('Failed to add subtask');
    }
  };

  const toggleSubTaskComplete = async (taskId, subTaskId, listId) => {
    try {
      // Get current subtask to determine new completion status
      const list = lists.find(l => l.id === listId);
      const task = list?.tasks.find(t => t.id === taskId);
      const subTask = task?.subTasks?.find(st => st.id === subTaskId);
      if (!subTask) return;

      console.log('🔄 Toggling subtask completion:', { taskId, subTaskId, newStatus: !subTask.completed });

      // Optimistic UI update for immediate feedback
      setLists(prevLists =>
        prevLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId ? {
              ...task,
              subTasks: task.subTasks?.map(st =>
                st.id === subTaskId ? { ...st, completed: !st.completed } : st
              )
            } : task
          )
        }))
      );

      // API call
      await apiUpdateSubTask(taskId, subTaskId, {
        completed: !subTask.completed
      });
    } catch (error) {
      console.error('Error toggling subtask completion:', error);
      setError('Failed to update subtask');
      // Revert optimistic update on error
      loadLists();
    }
  };

  const deleteSubtask = async (parentTaskId, subtaskId, listId) => {
    try {
      console.log('🔄 Deleting subtask:', { parentTaskId, subtaskId });
      
      // Optimistic UI update for immediate feedback
      setLists(prevLists =>
        prevLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task =>
            task.id === parentTaskId ? {
              ...task,
              subTasks: task.subTasks?.filter(subtask => subtask.id !== subtaskId)
            } : task
          )
        }))
      );
      
      // API call
      await apiDeleteSubTask(parentTaskId, subtaskId);
    } catch (error) {
      console.error('Error deleting subtask:', error);
      setError('Failed to delete subtask');
      // Revert optimistic update on error
      loadLists();
    }
  };
  
  const updateSubtaskTitle = async (parentTaskId, subtaskId, newTitle, listId) => {
    try {
      console.log('🔄 Updating subtask title:', { parentTaskId, subtaskId, newTitle });
      
      // Just make API call - WebSocket will handle UI updates
      await apiUpdateSubTask(parentTaskId, subtaskId, {
        title: newTitle
      });
    } catch (error) {
      console.error('Error updating subtask title:', error);
      setError('Failed to update subtask title');
    }
  };

  // Handle same-board reordering with Framer Motion
  const moveTask = useCallback((taskId, sourceBoard, targetBoard, dropIndex, listId, newOrderedTasks) => {
    const currentList = lists.find(l => l.id === listId);
    const isAllListsView = currentList?.isAllLists || currentList?.title === 'All Lists';
    
    // For reordering within the same board, apply immediate UI updates for smooth animation
    if (newOrderedTasks && sourceBoard === targetBoard) {
      console.log('🔄 Reordering tasks:', { listId, isAllListsView, taskCount: newOrderedTasks.length });
      
      // Update local state immediately for smooth UI
      setLists(prevLists =>
        prevLists.map(list => {
          if (list.id !== listId) return list;
          
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
        })
      );

      // Make API call - WebSocket will sync updates to other clients
      (async () => {
        try {
          if (isAllListsView) {
            const taskUpdates = newOrderedTasks.map((task, index) => ({
              taskId: task.id,
              allListsOrder: index
            }));
            await apiReorderTasksAllLists(taskUpdates);
          } else {
            const taskUpdates = newOrderedTasks.map((task, index) => ({
              taskId: task.id,
              order: index
            }));
            await apiReorderTasks(taskUpdates);
          }
        } catch (error) {
          console.error('❌ Error syncing task order with API:', error);
          setError('Failed to reorder tasks');
        }
      })();
    }
  }, [lists]);

  // Cross-board movement function - back to optimistic updates
  const moveTaskCrossBoard = useCallback(async (taskId, sourceBoard, targetBoard, listId) => {
    try {
      console.log('🔄 Cross-board move:', { taskId, sourceBoard, targetBoard });
      
      // Get current task from any list
      const task = lists.flatMap(l => l.tasks).find(t => t.id === taskId);
      if (!task) return;
      
      // Determine completion status based on target board
      const completedStatus = targetBoard === 'Done' ? true : 
                            targetBoard !== 'Done' && sourceBoard === 'Done' ? false : 
                            task.completed;
      const originalListId = task.listInfo?.id || task.listId || listId;

      // Optimistic UI update for immediate feedback
      setLists(prevLists =>
        prevLists.map(l => {
          // Remove from all boards
          const filteredTasks = l.tasks.filter(t => t.id !== taskId);
          const isAllLists = l.isAllLists || l.title === 'All Lists';
          const isOriginalList = l.id === originalListId;
          const isDoneBoard = completedStatus && isOriginalList && targetBoard === 'Done';
          if (isAllLists || isOriginalList || isDoneBoard) {
            return {
              ...l,
              tasks: [
                ...filteredTasks,
                { ...task, board: targetBoard, completed: completedStatus }
              ]
            };
          }
          return {
            ...l,
            tasks: filteredTasks
          };
        })
      );

      // API call
      await apiMoveTask(taskId, targetBoard, 0, completedStatus);
    } catch (error) {
      console.error('Error moving task across boards:', error);
      setError('Failed to move task');
      // Revert optimistic update on error
      loadLists();
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
    moveTaskCrossBoard,
    deleteAllCompletedTasks
  };
};

export default useListData; 