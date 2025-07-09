import React from 'react';

const EmptyState = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <div className="text-6xl mb-4">📝</div>
      <p className="text-lg">No todos yet</p>
      <p className="text-sm">Add one above to get started!</p>
    </div>
  );
};

export default EmptyState;