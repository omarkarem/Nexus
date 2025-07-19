import { useState } from 'react';
import ListCard from '../components/lists/ListCard';
import CreateListCard from '../components/lists/CreateListCard';
import Dropdown from '../components/Dropdown';
import useListData from '../hooks/useListData';


function Lists() {
  const { lists, loading, error, createList, editList, deleteList } = useListData();

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-glass-border border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Loading your lists...</h3>
          <p className="text-text-secondary">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Failed to load lists</h3>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-turquoise text-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Existing Lists */}
        {lists.map((list) => (
          <ListCard key={list.id} list={list} editList={editList} deleteList={deleteList} />
        ))}
        {/* Create New List Card */}
        <CreateListCard createList={createList} />
      </div>

      {/* Empty State (if no lists) */}
      {lists.length === 0 && !loading && (
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
          <button
          onClick={() => createList('New List', 'blue')}
          className="px-6 py-3 bg-gradient-turquoise text-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20">
            Create Your First List
          </button>
        </div>
      )}
    </div>
  );
}

export default Lists; 