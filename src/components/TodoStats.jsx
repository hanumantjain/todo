import React from 'react';

const TodoStats = ({ activeCount, completedCount, totalCount }) => {
  return (
    <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
      <span>{activeCount} active</span>
      <span>{completedCount} completed</span>
      <span>{totalCount} total</span>
    </div>
  );
};

export default TodoStats;