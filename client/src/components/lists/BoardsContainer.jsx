import Board from './Board';
import { getTasksByBoard } from '../../utils/listUtils';

const BoardsContainer = ({ 
  currentList, 
  listId, 
  toggleTaskComplete, 
  updateTaskTitle, 
  deleteTask, 
  updateTaskNote,
  addTask,
  listOptions,
  addSubTask,
  toggleSubTaskComplete,
  deleteSubtask,
  updateSubtaskTitle,
  moveTask
}) => {
  return (
    <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
        {/* Backlog Board */}
        <Board 
          name='Backlog' 
          borderColor="glass-border" 
          tasks={getTasksByBoard(currentList, 'backlog')}
          boardId="backlog"
          color={currentList.color}
          toggleTaskComplete={(taskId, boardId) => toggleTaskComplete(taskId, boardId, listId)}
          updateTaskTitle={(taskId, newTitle) => updateTaskTitle(taskId, newTitle, listId)}
          deleteTask={(taskId, boardId) => deleteTask(taskId, boardId, listId)}
          updateTaskNote={(taskId, boardId, noteText) => updateTaskNote(taskId, boardId, noteText, listId)}
          addTask={(taskTitle, boardId, targetListId) => addTask(taskTitle, boardId, targetListId)}
          listOptions={listOptions}
          currentList={currentList}
          addSubTask={(taskId, subTaskTitle) => addSubTask(taskId, subTaskTitle, listId)}
          toggleSubTaskComplete={(taskId, subTaskId) => toggleSubTaskComplete(taskId, subTaskId, listId)}
          deleteSubtask={(taskId, subTaskId) => deleteSubtask(taskId, subTaskId, listId)}
          updateSubtaskTitle={(taskId, subTaskId, newTitle) => updateSubtaskTitle(taskId, subTaskId, newTitle, listId)}
          listId={listId}
          moveTask={moveTask}
        />

        {/* This Week Board */}
        <Board 
          name='This Week' 
          borderColor="glass-border" 
          tasks={getTasksByBoard(currentList, 'thisWeek')}
          boardId="thisWeek"
          color={currentList.color}
          toggleTaskComplete={(taskId, boardId) => toggleTaskComplete(taskId, boardId, listId)}
          updateTaskTitle={(taskId, newTitle) => updateTaskTitle(taskId, newTitle, listId)}
          deleteTask={(taskId, boardId) => deleteTask(taskId, boardId, listId)}
          updateTaskNote={(taskId, boardId, noteText) => updateTaskNote(taskId, boardId, noteText, listId)}
          addTask={(taskTitle, boardId, targetListId) => addTask(taskTitle, boardId, targetListId)}
          listOptions={listOptions}
          currentList={currentList}
          addSubTask={(taskId, subTaskTitle) => addSubTask(taskId, subTaskTitle, listId)}
          toggleSubTaskComplete={(taskId, subTaskId) => toggleSubTaskComplete(taskId, subTaskId, listId)}
          deleteSubtask={(taskId, subTaskId) => deleteSubtask(taskId, subTaskId, listId)}
          updateSubtaskTitle={(taskId, subTaskId, newTitle) => updateSubtaskTitle(taskId, subTaskId, newTitle, listId)}
          listId={listId}
          moveTask={moveTask}
        />

        {/* Today Board */}
        <Board 
          name='Today' 
          borderColor="glass-border" 
          tasks={getTasksByBoard(currentList, 'today')}
          boardId="today"
          color={currentList.color}
          toggleTaskComplete={(taskId, boardId) => toggleTaskComplete(taskId, boardId, listId)}
          updateTaskTitle={(taskId, newTitle) => updateTaskTitle(taskId, newTitle, listId)}
          deleteTask={(taskId, boardId) => deleteTask(taskId, boardId, listId)}
          updateTaskNote={(taskId, boardId, noteText) => updateTaskNote(taskId, boardId, noteText, listId)}
          addTask={(taskTitle, boardId, targetListId) => addTask(taskTitle, boardId, targetListId)}
          listOptions={listOptions}
          currentList={currentList}
          addSubTask={(taskId, subTaskTitle) => addSubTask(taskId, subTaskTitle, listId)}
          toggleSubTaskComplete={(taskId, subTaskId) => toggleSubTaskComplete(taskId, subTaskId, listId)}
          deleteSubtask={(taskId, subTaskId) => deleteSubtask(taskId, subTaskId, listId)}
          updateSubtaskTitle={(taskId, subTaskId, newTitle) => updateSubtaskTitle(taskId, subTaskId, newTitle, listId)}
          listId={listId}
          moveTask={moveTask}
        />

        {/* Done Board */}
        <Board 
          name='Done' 
          borderColor="glass-border" 
          tasks={getTasksByBoard(currentList, 'Done')}
          boardId="Done"
          color={currentList.color}
          toggleTaskComplete={(taskId, boardId) => toggleTaskComplete(taskId, boardId, listId)}
          updateTaskTitle={(taskId, newTitle) => updateTaskTitle(taskId, newTitle, listId)}
          deleteTask={(taskId, boardId) => deleteTask(taskId, boardId, listId)}
          updateTaskNote={(taskId, boardId, noteText) => updateTaskNote(taskId, boardId, noteText, listId)}
          addTask={(taskTitle, boardId, targetListId) => addTask(taskTitle, boardId, targetListId)}
          listOptions={listOptions}
          currentList={currentList}
          addSubTask={(taskId, subTaskTitle) => addSubTask(taskId, subTaskTitle, listId)}
          toggleSubTaskComplete={(taskId, subTaskId) => toggleSubTaskComplete(taskId, subTaskId, listId)}
          deleteSubtask={(taskId, subTaskId) => deleteSubtask(taskId, subTaskId, listId)}
          updateSubtaskTitle={(taskId, subTaskId, newTitle) => updateSubtaskTitle(taskId, subTaskId, newTitle, listId)}
          listId={listId}
          moveTask={moveTask}
        />
    </div>
  );
};

export default BoardsContainer; 