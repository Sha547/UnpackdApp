import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center py-10">
      <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-slate-500 dark:text-slate-400">Building your learning path...</p>
    </div>
  );
};

export default LoadingSpinner;