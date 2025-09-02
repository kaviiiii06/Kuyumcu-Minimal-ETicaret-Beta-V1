import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'yellow' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    yellow: 'text-yellow-500',
    blue: 'text-blue-500',
    green: 'text-green-500'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin rounded-full border-4 border-gray-200 border-t-current`}></div>
    </div>
  );
};

export default LoadingSpinner;
