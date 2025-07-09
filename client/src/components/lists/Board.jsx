import AddTask from './AddTask';
import Task from './Task';

const Board = ({ name, borderColor, tasks = [], boardId, color, toggleTaskComplete, updateTaskTitle, deleteTask, updateTaskNote }) => {

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


    return(
        <div className={`w-2/6 min-h-[80vh] bg-gradient-glass backdrop-blur-glass border border-${borderColor} rounded-3xl py-4 px-6`}>
            <div className="flex flex-col items-center">
                <div className="w-full flex items-center">
                    <h3 className='text-[24px]'>{name}</h3>
                    <div className='flex items-center ml-auto text-[26px]'>+</div>
                </div>
                <div className="space-y-3 w-full py-4">
                  {tasks.map((task) => (
                      <Task key={task.id} task={task} 
                      toggleTaskComplete={toggleTaskComplete} 
                      boardId={boardId} 
                      updateTaskTitle={updateTaskTitle}
                      deleteTask={deleteTask}
                      updateTaskNote={updateTaskNote}
                      />
                  ))}
                </div>

                {/*Add Task */}
                <AddTask boardId={boardId} />
            </div>
        </div>
    )
}

export default Board;