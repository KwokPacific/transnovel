import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Settings</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
        
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</p>
            <div className="flex space-x-4">
                <label className="flex items-center">
                    <input 
                        type="radio" 
                        name="theme" 
                        value="light"
                        checked={theme === 'light'}
                        onChange={(e) => setTheme(e.target.value)}
                        className="form-radio text-indigo-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Light</span>
                </label>
                 <label className="flex items-center">
                    <input 
                        type="radio" 
                        name="theme" 
                        value="dark"
                        checked={theme === 'dark'}
                        onChange={(e) => setTheme(e.target.value)}
                        className="form-radio text-indigo-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Dark</span>
                </label>
                 <label className="flex items-center">
                    <input 
                        type="radio" 
                        name="theme" 
                        value="system"
                        checked={theme === 'system'}
                        onChange={(e) => setTheme(e.target.value)}
                        className="form-radio text-indigo-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">System</span>
                </label>
            </div>
        </div>

        <div className="mt-8 border-t dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">API Configuration</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                The Google Gemini API key is configured via the <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">API_KEY</code> environment variable and is not manageable through this interface.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
