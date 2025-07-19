import { useState, useEffect, useRef } from 'react';

const ListDropdown = ({ options, value, onChange, placeholder, className, icon, size = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Handle option selection
  const handleOptionClick = (option) => {
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
  };

  // Toggle dropdown
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Find selected option for display
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Get padding classes based on size
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          button: 'px-3 py-1.5 text-sm',
          option: 'px-3 py-2 text-sm',
          icon: 'w-4 h-4'
        };
      case 'compact':
        return {
          button: 'px-3 py-1 text-xs',
          option: 'px-3 py-1.5 text-xs',
          icon: 'w-3 h-3'
        };
      default:
        return {
          button: 'px-4 py-3',
          option: 'px-4 py-3',
          icon: 'w-5 h-5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`relative ${className || ''}`} ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        className={`w-full ${sizeClasses.button} text-left bg-gradient-glass backdrop-blur-glass border border-glass-border rounded-xl
                   flex justify-between items-center transition-all duration-300
                   hover:bg-gradient-glass-strong focus:outline-none focus:ring-2 focus:ring-turquoise/50
                   cursor-pointer group`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <span className={`${selectedOption ? 'text-text-primary' : 'text-text-secondary'} font-medium`}>
            {displayValue}
          </span>
        </div>
        <svg
          className={`${sizeClasses.icon} text-text-secondary transform transition-transform duration-300 group-hover:text-text-primary ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-gradient-glass backdrop-blur-glass-strong border border-glass-border
                     rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200"
        >
          {options.length === 0 ? (
            <div className={`${sizeClasses.option} text-text-secondary text-center italic`}>
              No options available
            </div>
          ) : (
            <div className="py-2">
              {options.map((option, index) => (
                <button
                  key={option.value || index}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  className={`w-full ${sizeClasses.option} text-left transition-all duration-200 flex items-center space-x-3
                             hover:bg-gradient-glass group cursor-pointer
                             ${index === 0 ? 'rounded-t-xl' : ''}
                             ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                             ${value === option.value ? 'bg-gradient-turquoise/10 text-turquoise' : 'text-text-primary'}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.icon && (
                    <div className="flex-shrink-0">
                      {option.icon}
                    </div>
                  )}
                  <span className="font-medium">{option.label}</span>
                  {value === option.value && (
                    <svg className="w-4 h-4 ml-auto text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListDropdown;