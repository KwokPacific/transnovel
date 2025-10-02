import React from 'react';

const Topbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
       <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Novel Translator AI</h1>
    </header>
  );
};

export default Topbar;
