import List from '../models/List.js';
import Task from '../models/Task.js';

// @desc    Get all lists for the current user
// @route   GET /api/lists
// @access  Private
const getLists = async (req, res) => {
    try {
        const lists = await List.find({ owner: req.user.id}).sort({ createdAt: -1})

        const listsWithCounts = await Promise.all(lists.map(async (list) =>{
            const tasks = await Task.find({ list: list._id, owner: req.user.id});
            const completedCount = tasks.filter(task => task.completed).length;

            return {
                id: list._id,
                title: list.title,
                description: list.description,
                color: list.color,
                itemCount: tasks.length,
                completedCount: completedCount,
                updatedAt: list.formattedUpdatedAt, // Virtual field
                tasks: tasks.map(task => ({
                  id: task._id,
                  title: task.title,
                  completed: task.completed,
                  board: task.board,
                  originalBoard: task.originalBoard,
                  order: task.order,
                  note: task.note,
                  subTasks: task.subTasks.map(sub => ({
                    id: sub._id,
                    title: sub.title,
                    completed: sub.completed
                  }))
                }))
              };
            })
          );

        res.status(200).json({
            success: true,
            lists: listsWithCounts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lists', error: error.message });
    }
}



// @desc    Create a new list
// @route   POST /api/lists
// @access  Private
const createList = async (req, res) => {
    try {
        const { title, description = '', color = 'blue' } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'List title is required'
      });
    }

    const list = await List.create({
      title: title.trim(),
      description: description.trim(),
      color,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'List created successfully',
      list: {
        id: list._id,
        title: list.title,
        description: list.description,
        color: list.color,
        itemCount: 0,
        completedCount: 0,
        updatedAt: list.formattedUpdatedAt,
        tasks: []
      }
    });
    } catch (error) {
        res.status(500).json({ message: 'Error creating list', error: error.message });
    }
}


// @desc    Update a list
// @route   PUT /api/lists/:id
// @access  Private
const updateList = async (req,res) => {
    try {
        const { title, description, color } = req.body;

        const list = await List.findOne({ 
          _id: req.params.id, 
          owner: req.user.id 
        });
    
        if (!list) {
          return res.status(404).json({
            success: false,
            message: 'List not found'
          });
        }
    
        // Update fields if provided
        if (title !== undefined) list.title = title.trim();
        if (description !== undefined) list.description = description.trim();
        if (color !== undefined) list.color = color;
    
        await list.save();
    
        res.json({
          success: true,
          message: 'List updated successfully',
          list: {
            id: list._id,
            title: list.title,
            description: list.description,
            color: list.color,
            updatedAt: list.formattedUpdatedAt
          }
        });
    } catch (error) {
        res.status(500).json({message:'Failed to update list', error: error.message});
    }
}


// @desc    Delete a list and all its tasks
// @route   DELETE /api/lists/:id
// @access  Private
const deleteList = async (req,res) => {
    try {
        const list = await List.findOne({ 
            _id: req.params.id, 
            owner: req.user.id 
          });
      
          if (!list) {
            return res.status(404).json({
              success: false,
              message: 'List not found'
            });
          }
      
          // Delete all tasks in this list
          await Task.deleteMany({ list: list._id });
      
          // Delete the list
          await List.findByIdAndDelete(list._id);
      
          res.json({
            success: true,
            message: 'List and all its tasks deleted successfully'
          });
    } catch (error) {
        res.status(500).json({message:'Failed to delete list', error: error.message});
    }
}

export { getLists, createList, updateList, deleteList };




