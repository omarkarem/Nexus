import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListDropdown from '../components/lists/ListDropdown';
import Board from '../components/lists/Board'
function ListDetail() {

  // Same data as Lists.js (will be replaced with API call later)
  const [lists, setLists] = useState([
    {
      id: 1,
      title: 'Daily Tasks',
      description: 'Things I need to do today',
      itemCount: 8,
      completedCount: 3,
      color: 'red',
      updatedAt: '2 hours ago',
      tasks: [
        { id: 1, title: 'Review morning emails', completed: true, board: 'today', note: 'Check for important client updates and respond to urgent requests' },
        { id: 2, title: 'Team standup meeting', completed: true, board: 'today' },
        { id: 3, title: 'Complete project proposal', completed: false, board: 'thisWeek' },
        { id: 4, title: 'Call dentist for appointment', completed: false, board: 'thisWeek' },
        { id: 5, title: 'Buy groceries', completed: true, board: 'today' },
        { id: 6, title: 'Workout session', completed: false, board: 'today' },
        { id: 7, title: 'Read industry news', completed: false, board: 'backlog' },
        { id: 8, title: 'Plan weekend activities', completed: false, board: 'backlog' }
      ]
    },
    {
      id: 2,
      title: 'Work Projects',
      description: 'Current work assignments and deadlines',
      itemCount: 12,
      completedCount: 7,
      color: 'blue',
      updatedAt: '1 day ago',
      tasks: [
        { id: 9, title: 'Design new landing page', completed: true, board: 'today' },
        { id: 10, title: 'Code user authentication', completed: true, board: 'today' },
        { id: 11, title: 'Write API documentation', completed: false, board: 'thisWeek' },
        { id: 12, title: 'Test mobile responsiveness', completed: true, board: 'today' },
        { id: 13, title: 'Client presentation prep', completed: false, board: 'thisWeek' },
        { id: 14, title: 'Database optimization', completed: true, board: 'today' },
        { id: 15, title: 'Code review for team', completed: false, board: 'thisWeek' },
        { id: 16, title: 'Deploy to staging', completed: true, board: 'today' },
        { id: 17, title: 'Update project timeline', completed: false, board: 'backlog' },
        { id: 18, title: 'Security audit checklist', completed: true, board: 'today' },
        { id: 19, title: 'Performance testing', completed: false, board: 'backlog' },
        { id: 20, title: 'Final client approval', completed: true, board: 'today' }
      ]
    },
    {
      id: 3,
      title: 'Shopping List',
      description: 'Groceries and household items',
      itemCount: 15,
      completedCount: 15,
      color: 'green',
      updatedAt: '3 days ago',
      tasks: [
        { id: 21, title: 'Milk and eggs', completed: true, board: 'today' },
        { id: 22, title: 'Fresh vegetables', completed: true, board: 'today' },
        { id: 23, title: 'Bread and butter', completed: true, board: 'today' },
        { id: 24, title: 'Cleaning supplies', completed: true, board: 'thisWeek' },
        { id: 25, title: 'Fruits for the week', completed: true, board: 'today' },
        { id: 26, title: 'Coffee beans', completed: true, board: 'today' },
        { id: 27, title: 'Toilet paper', completed: true, board: 'thisWeek' },
        { id: 28, title: 'Shampoo', completed: true, board: 'thisWeek' },
        { id: 29, title: 'Pasta and sauce', completed: true, board: 'today' },
        { id: 30, title: 'Yogurt', completed: true, board: 'today' },
        { id: 31, title: 'Chicken breast', completed: true, board: 'today' },
        { id: 32, title: 'Rice', completed: true, board: 'backlog' },
        { id: 33, title: 'Olive oil', completed: true, board: 'backlog' },
        { id: 34, title: 'Cheese', completed: true, board: 'today' },
        { id: 35, title: 'Snacks', completed: true, board: 'backlog' }
      ]
    },
    {
      id: 4,
      title: 'Learning Goals',
      description: 'Skills and courses to complete',
      itemCount: 6,
      completedCount: 2,
      color: 'yellow',
      updatedAt: '1 week ago',
      tasks: [
        { id: 36, title: 'Complete React course', completed: true, board: 'today' },
        { id: 37, title: 'Read "Clean Code" book', completed: false, board: 'thisWeek' },
        { id: 38, title: 'Practice algorithm problems', completed: false, board: 'thisWeek' },
        { id: 39, title: 'Learn TypeScript basics', completed: true, board: 'today' },
        { id: 40, title: 'Build portfolio project', completed: false, board: 'backlog' },
        { id: 41, title: 'Attend tech conference', completed: false, board: 'backlog' }
      ]
    }
  ]);

  const { listId } = useParams();
  const navigate = useNavigate();

  // Find the current list
  const currentList = lists.find(list => list.id === parseInt(listId));

  // Helper function to get tasks by board
  const getTasksByBoard = (boardType) => {
    if (!currentList) return [];
    return currentList.tasks.filter(task => task.board === boardType);
  };


  // Dropdown options from Lists
  const listOptions = lists.map(list => ({
    value: list.id.toString(),
    label: list.title,
    icon: <div className={`w-4 h-4 rounded bg-${list.color}-500`}></div>
  }))

  // URL Navigation 
  const handleListChange = (listOption) => {
    navigate(`/app/lists/${listOption.value}`);
  };

  // Get color class based on color
  const getColorClass = (colorName) => {
    const colorMap = {
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500'
    };
    return colorMap[colorName] || 'bg-blue-500';
  };

  const handleBack = () => {
    navigate('/app/lists');
  };

  // Task management functions
  const toggleTaskComplete = (taskId, boardId) => {
    setLists(prevLists => 
      prevLists.map(list =>
        list.id === parseInt(listId) ? { ...list, tasks : list.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task)} : list
        )
    );
  };

  const updateTaskTitle = (taskId, newTitle) =>{
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === parseInt(listId) ? {
          ...list, tasks: list.tasks.map(task =>
            task.id === taskId ? {...task, title: newTitle } : task
          )} : list
      )
    );
  };

  const deleteTask = (taskId, boardId) => {
    setLists(prevLists =>
      prevLists.map(list => ({
        ...list, 
        tasks: list.tasks.filter(task => 
          !(task.id === taskId && task.board === boardId)
          )
        }))
      )
  }

  // Note management functions
  const updateTaskNote = (taskId, boardId, noteText) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === parseInt(listId) ? {
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId ? { ...task, note: noteText } : task
          )
        } : list
      )
    );
  };


  if (!currentList) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-text-primary mb-2">List Not Found</h2>
          <p className="text-text-secondary mb-6">The list you're looking for doesn't exist.</p>
          <button 
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-turquoise text-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20"
          >
            Back to Lists
          </button>
        </div>
      </div>
    );
  }

  const completionPercentage = currentList.itemCount > 0 ? Math.round((currentList.completedCount / currentList.itemCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Lists</span>
        </button>
        <div className='flex flex-col'>
          <div className='w-full md:w-80'>
            
            <ListDropdown 
              options={listOptions}
              value={currentList.id.toString()}
              onChange={handleListChange}
              placeholder='Select Color'
              className='w-full'
              icon={<div className={`w-6 h-6 rounded-md ${getColorClass(currentList.color)}`}></div>}
            />
          </div>
        </div>

      </div>

      {/* kanban Boards */}
       <div className='w-full flex space-x-4'>
         <Board 
           name='Backlog' 
           borderColor="glass-border" 
           tasks={getTasksByBoard('backlog')}
           boardId="backlog"
           color={currentList.color}
           toggleTaskComplete={toggleTaskComplete}
           updateTaskTitle={updateTaskTitle}
           deleteTask={deleteTask}
           updateTaskNote={updateTaskNote}
         />
         <Board 
           name='This Week' 
           borderColor="glass-border" 
           tasks={getTasksByBoard('thisWeek')}
           boardId="thisWeek"
           color={currentList.color}
           toggleTaskComplete={toggleTaskComplete}
           updateTaskTitle={updateTaskTitle}
           deleteTask={deleteTask}
           updateTaskNote={updateTaskNote}
         />
         <Board 
           name='Today' 
           tasks={getTasksByBoard('today')}
           boardId="today"
           color={currentList.color}
           toggleTaskComplete={toggleTaskComplete}
           updateTaskTitle={updateTaskTitle}
           deleteTask={deleteTask}
           updateTaskNote={updateTaskNote}
         />
       </div>
    </div>
  );
}

export default ListDetail; 