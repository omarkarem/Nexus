import { useState } from 'react';
import ListCard from '../components/lists/ListCard';
import CreateListCard from '../components/lists/CreateListCard';

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
      updatedAt: '2 hours ago'
    },
    {
      id: 2,
      title: 'Work Projects',
      description: 'Current work assignments and deadlines',
      itemCount: 12,
      completedCount: 7,
      color: 'blue',
      updatedAt: '1 day ago'
    },
    {
      id: 3,
      title: 'Shopping List',
      description: 'Groceries and household items',
      itemCount: 15,
      completedCount: 15,
      color: 'green',
      updatedAt: '3 days ago'
    },
    {
      id: 4,
      title: 'Learning Goals',
      description: 'Skills and courses to complete',
      itemCount: 6,
      completedCount: 2,
      color: 'yellow',
      updatedAt: '1 week ago'
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