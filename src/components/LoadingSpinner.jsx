import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading todos...</p>
    </div>
  );
};

export default LoadingSpinner;