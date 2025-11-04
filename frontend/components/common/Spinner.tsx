
import React from 'react';

const Spinner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white/10 dark:bg-black/10 rounded-lg">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default Spinner;
