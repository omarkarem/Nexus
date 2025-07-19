import List from '../models/List.js';
import Task from '../models/Task.js';

// @desc    Get all lists for the current user
// @route   GET /api/lists
// @access  Private
const getLists = async (req, res) => {
    try {
        console.log('🔄 Fetching lists for user:', req.user.id);
        
        const lists = await List.find({ owner: req.user.id}).sort({ createdAt: -1})
        
        console.log('📋 Raw lists from DB:', lists.map(l => ({ id: l._id, title: l.title, isAllLists: l.isAllLists })));

        // Check if "All Lists" exists, if not create it (for existing users)
        const allListsExists = lists.some(list => list.isAllLists || list.title === 'All Lists');
        if (!allListsExists && lists.length > 0) {
            console.log('🎯 All Lists not found, creating it for existing user...');
            const allListsList = await List.create({
                title: 'All Lists',
                color: 'gray',
                description: 'Contains all your tasks from every list',
                owner: req.user.id,
                isAllLists: true
            });
            console.log('✅ All Lists created for existing user:', allListsList.title, 'ID:', allListsList._id);
            
            // Add the new All Lists to the beginning of the lists array
            lists.unshift(allListsList);
        }

        const listsWithCounts = await Promise.all(lists.map(async (list) =>{
            const tasks = await Task.find({ list: list._id, owner: req.user.id});
            const completedCount = tasks.filter(task => task.completed).length;

            return {
                id: list._id,
                title: list.title,
                description: list.description,
                color: list.color,
                isAllLists: list.isAllLists,
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

        // Sort lists to put All Lists first
        listsWithCounts.sort((a, b) => {
            if (a.isAllLists) return -1;
            if (b.isAllLists) return 1;
            return 0;
        });

        console.log('✅ Final lists with counts:', listsWithCounts.map(l => ({ id: l.id, title: l.title, isAllLists: l.isAllLists, itemCount: l.itemCount })));

        res.status(200).json({
            success: true,
            lists: listsWithCounts
        });
    } catch (error) {
        console.error('Error fetching lists:', error);
        res.status(500).json({ message: 'Error fetching lists', error: error.message });
    }
}



// @desc    Create a new list
// @route   POST /api/lists
// @access  Private
const createList = async (req, res) => {
  try {
    const { title, color, description } = req.body;
    
    console.log('🔄 Creating list:', { title, color, description, userId: req.user.id });
    
    // Check if this is the user's first list
    const existingListsCount = await List.countDocuments({ owner: req.user.id });
    const isFirstList = existingListsCount === 0;
    
    console.log('📊 Existing lists count:', existingListsCount, 'Is first list:', isFirstList);
    
    // Create the requested list
    const list = await List.create({
      title: title.trim(),
      color: color || 'blue',
      description: description ? description.trim() : '',
      owner: req.user.id
    });

    console.log('✅ Main list created:', list.title);

    // If this is the first list, also create the "All Lists" list
    if (isFirstList) {
      console.log('🎯 First list detected, creating All Lists...');
      const allListsList = await List.create({
        title: 'All Lists',
        color: 'gray',
        description: 'Contains all your tasks from every list',
        owner: req.user.id,
        isAllLists: true // Special flag to identify this list
      });
      console.log('✅ All Lists created:', allListsList.title, 'ID:', allListsList._id);
    }

    // Return the created list with virtual field
    const responseList = {
      id: list._id,
      title: list.title,
      description: list.description,
      color: list.color,
      itemCount: 0,
      completedCount: 0,
      updatedAt: list.formattedUpdatedAt
    };

    console.log('📤 Sending response:', responseList);

    res.status(201).json({
      success: true,
      message: 'List created successfully',
      list: responseList
    });
  } catch (error) {
    console.error('Create list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create list'
    });
  }
};


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




