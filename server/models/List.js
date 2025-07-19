import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'List title is required'],
    trim: true,
    maxlength: [100, 'List title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  color: {
    type: String,
    enum: ['red', 'orange', 'green', 'blue', 'purple', 'pink', 'black'],
    default: 'blue'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for updatedAt in frontend format
listSchema.virtual('formattedUpdatedAt').get(function() {
  const now = new Date();
  const diff = now - this.updatedAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Ensure virtual fields are included in JSON output
listSchema.set('toJSON', { virtuals: true });
listSchema.set('toObject', { virtuals: true });

// Index for performance
listSchema.index({ owner: 1 });

export default mongoose.model('List', listSchema);