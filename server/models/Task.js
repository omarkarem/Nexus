import mongoose from 'mongoose';

const subTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Subtask title cannot exceed 200 characters']
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { _id: true }); // Keep _id for frontend compatibility

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  note: {
    type: String,
    trim: true,
    default: '',
    maxlength: [1000, 'Note cannot exceed 1000 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  board: {
    type: String,
    enum: ['today', 'thisWeek', 'backlog', 'Done'],
    default: 'backlog'
  },
  originalBoard: {
    type: String,
    enum: ['today', 'thisWeek', 'backlog', 'Done'],
    default: 'backlog'
  },
  lastBoard: {
    type: String,
    enum: ['today', 'thisWeek', 'backlog', 'Done'],
    default: 'backlog'
  },
  order: {
    type: Number,
    default: 0
  },
  allListsOrder: {
    type: Number,
    default: 0
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subTasks: [subTaskSchema]
}, {
  timestamps: true
});

// Indexes for performance
taskSchema.index({ list: 1, board: 1, order: 1 });
taskSchema.index({ owner: 1 });

export default mongoose.model('Task', taskSchema);