import ListDropdown from './ListDropdown';
import { getColorClass } from '../../utils/listUtils';

const ListHeader = ({ 
  onBack, 
  listOptions, 
  currentList, 
  onListChange 
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-300"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Lists</span>
      </button>

      {/* List Switcher Dropdown */}
      <div className='flex flex-col'>
        <div className='w-full md:w-80'>
          <ListDropdown 
            options={listOptions}
            value={currentList.id}
            onChange={onListChange}
            placeholder='Select List'
            className='w-full'
            icon={<div className={`w-6 h-6 rounded-md ${getColorClass(currentList.color)}`}></div>}
          />
        </div>
      </div>
    </div>
  );
};

export default ListHeader; 