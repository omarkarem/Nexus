import { useParams, useNavigate } from 'react-router-dom';
import useListData from '../hooks/useListData';
import { createListOptions } from '../utils/listUtils';
import ListHeader from '../components/lists/ListHeader';
import BoardsContainer from '../components/lists/BoardsContainer';

function ListDetail() {
  const { listId } = useParams();
  const navigate = useNavigate();

  // Use custom hook for data management
  const {
    lists,
    loading,
    toggleTaskComplete,
    updateTaskTitle,
    deleteTask,
    updateTaskNote,
    addTask,
    addSubTask,
    toggleSubTaskComplete,
    deleteSubtask,
    updateSubtaskTitle,
    moveTask,
    deleteAllCompletedTasks
  } = useListData();

  // Find the current list
  const currentList = lists.find(list => list.id === listId);

  // Navigation handlers
  const handleBack = () => {
    navigate('/app/lists');
  };

  const handleListChange = (listOption) => {
    navigate(`/app/lists/${listOption.value}`);
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise"></div>
      </div>
    );
  }

  // Handle case when list is not found (only after loading is complete)
  if (!loading && !currentList) {
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

  // Create dropdown options
  const listOptions = createListOptions(lists);

  return (
    <div className="space-y-6">
      {/* Header with Back Button and List Switcher */}
      <ListHeader 
        onBack={handleBack}
        listOptions={listOptions}
        currentList={currentList}
        onListChange={handleListChange}
      />

      {/* Kanban Boards Container */}
      <BoardsContainer 
        currentList={currentList}
        listId={listId}
        toggleTaskComplete={toggleTaskComplete}
        updateTaskTitle={updateTaskTitle}
        deleteTask={deleteTask}
        updateTaskNote={updateTaskNote}
        addTask={addTask}
        listOptions={listOptions}
        addSubTask={addSubTask}
        toggleSubTaskComplete={toggleSubTaskComplete}
        deleteSubtask={deleteSubtask}
        updateSubtaskTitle={updateSubtaskTitle}
        moveTask={moveTask}
        deleteAllCompletedTasks={deleteAllCompletedTasks}
      />
    </div>
  );
}

export default ListDetail; 