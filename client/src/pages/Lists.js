import { useState } from 'react';
import useListData from '../hooks/useListData';
import ListCard from '../components/lists/ListCard';
import CreateListCard, { CreateListModal } from '../components/lists/CreateListCard';

function Lists() {
  const { lists, loading, error, createList, editList, deleteList } = useListData();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Error loading lists</h3>
        <p className="text-text-secondary mb-6 max-w-sm mx-auto">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-turquoise text-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Empty State (if no lists and no error) */}
      {lists.length === 0 && !loading && !error && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-glass rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">No lists yet</h3>
          <p className="text-sm sm:text-base text-text-secondary mb-4 sm:mb-6 max-w-sm mx-auto px-4">
            Create your first list to start organizing your tasks and boost your productivity.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-turquoise text-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20 text-sm sm:text-base">
            Create Your First List
          </button>
          <CreateListModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} createList={createList} />
        </div>
      )}
      {/* Lists Grid (only if lists exist) */}
      {lists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {/* Existing Lists */}
          {lists.map((list) => (
            <ListCard key={list.id} list={list} editList={editList} deleteList={deleteList} />
          ))}
          {/* Create New List Card */}
          <CreateListCard createList={createList} />
        </div>
      )}
    </div>
  );
}

export default Lists; 