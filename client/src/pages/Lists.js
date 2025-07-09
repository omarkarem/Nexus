import { useState } from 'react';
import ListCard from '../components/lists/ListCard';
import CreateListCard from '../components/lists/CreateListCard';
import Dropdown from '../components/Dropdown';


function Lists() {
  // Mock data for demonstration
  const [lists] = useState([
    {
      id: 1,
      title: 'Daily Tasks',
      description: 'Things I need to do today',
      itemCount: 8,
      completedCount: 3,
      color: 'red',
      updatedAt: '2 hours ago',
      tasks: [
        { id: 1, title: 'Review morning emails', completed: true },
        { id: 2, title: 'Team standup meeting', completed: true },
        { id: 3, title: 'Complete project proposal', completed: false },
        { id: 4, title: 'Call dentist for appointment', completed: false },
        { id: 5, title: 'Buy groceries', completed: true },
        { id: 6, title: 'Workout session', completed: false },
        { id: 7, title: 'Read industry news', completed: false },
        { id: 8, title: 'Plan weekend activities', completed: false }
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
        { id: 9, title: 'Design new landing page', completed: true },
        { id: 10, title: 'Code user authentication', completed: true },
        { id: 11, title: 'Write API documentation', completed: false },
        { id: 12, title: 'Test mobile responsiveness', completed: true },
        { id: 13, title: 'Client presentation prep', completed: false },
        { id: 14, title: 'Database optimization', completed: true },
        { id: 15, title: 'Code review for team', completed: false },
        { id: 16, title: 'Deploy to staging', completed: true },
        { id: 17, title: 'Update project timeline', completed: false },
        { id: 18, title: 'Security audit checklist', completed: true },
        { id: 19, title: 'Performance testing', completed: false },
        { id: 20, title: 'Final client approval', completed: true }
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
        { id: 21, title: 'Milk and eggs', completed: true },
        { id: 22, title: 'Fresh vegetables', completed: true },
        { id: 23, title: 'Bread and butter', completed: true },
        { id: 24, title: 'Cleaning supplies', completed: true },
        { id: 25, title: 'Fruits for the week', completed: true },
        { id: 26, title: 'Coffee beans', completed: true },
        { id: 27, title: 'Toilet paper', completed: true },
        { id: 28, title: 'Shampoo', completed: true },
        { id: 29, title: 'Pasta and sauce', completed: true },
        { id: 30, title: 'Yogurt', completed: true },
        { id: 31, title: 'Chicken breast', completed: true },
        { id: 32, title: 'Rice', completed: true },
        { id: 33, title: 'Olive oil', completed: true },
        { id: 34, title: 'Cheese', completed: true },
        { id: 35, title: 'Snacks', completed: true }
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
        { id: 36, title: 'Complete React course', completed: true },
        { id: 37, title: 'Read "Clean Code" book', completed: false },
        { id: 38, title: 'Practice algorithm problems', completed: false },
        { id: 39, title: 'Learn TypeScript basics', completed: true },
        { id: 40, title: 'Build portfolio project', completed: false },
        { id: 41, title: 'Attend tech conference', completed: false }
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Existing Lists */}
        {lists.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
        {/* Create New List Card */}
        <CreateListCard />
      </div>

      {/* Empty State (if no lists) */}
      {lists.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-glass rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No lists yet</h3>
          <p className="text-text-secondary mb-6 max-w-sm mx-auto">
            Create your first list to start organizing your tasks and boost your productivity.
          </p>
          <button className="px-6 py-3 bg-gradient-turquoise text-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20">
            Create Your First List
          </button>
        </div>
      )}
    </div>
  );
}

export default Lists; 