import React from 'react';

const TodoFilters = ({ filter, onFilterChange }) => {
  const filters = ['all', 'active', 'completed'];

  return (
    <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            filter === f 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default TodoFilters;