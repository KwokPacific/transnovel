
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpenIcon, UsersIcon, CogIcon, ClipboardListIcon, HomeIcon } from './icons/Icons';

const Sidebar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 transition-colors duration-200 transform rounded-lg ${
      isActive
        ? 'bg-gray-700 text-white'
        : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
    }`;

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-400">Dịch Truyện</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <NavLink to="/" className={navLinkClasses}>
          <HomeIcon className="w-6 h-6" />
          <span className="mx-4 font-medium">Dashboard</span>
        </NavLink>
        <NavLink to="/glossary" className={navLinkClasses}>
          <BookOpenIcon className="w-6 h-6" />
          <span className="mx-4 font-medium">Glossary</span>
        </NavLink>
        <NavLink to="/characters" className={navLinkClasses}>
          <UsersIcon className="w-6 h-6" />
          <span className="mx-4 font-medium">Characters</span>
        </NavLink>
        <NavLink to="/settings" className={navLinkClasses}>
          <CogIcon className="w-6 h-6" />
          <span className="mx-4 font-medium">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
