import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Settings as SettingsIcon, UserCircle, LayoutDashboard, Bell, Shield, Moon, Sun } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  
  // REACT STATE
  const [isDarkMode, setIsDarkMode] = useState(false);

  // When the page loads, check if the app is already in dark mode
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const handleToggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  return (
    // Notice the new dark:bg-gray-900 here!
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
      
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400"></div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">EvalBuddy</h1>
        </div>
        
        <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <button onClick={() => navigate('/dashboard')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><LayoutDashboard size={18}/> Overview</button>
          <button onClick={() => navigate('/subscriptions')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><BookOpen size={18}/> Subscriptions</button>
          <button onClick={() => navigate('/settings')} className="text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-[#10b981]"><SettingsIcon size={18}/> Settings</button>
          <button onClick={() => navigate('/account')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><UserCircle size={18}/> Account</button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="p-8 flex-1 max-w-4xl mx-auto w-full mt-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 transition-colors">System Settings</h2>
        
        <div className="space-y-4">
          
          {/* THE DARK MODE TOGGLE */}
          <div 
            onClick={handleToggleTheme}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-500 transition-colors duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 dark:bg-gray-700 p-3 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors">
                {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">Appearance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between Light and Dark mode.</p>
              </div>
            </div>

            <div className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:border-blue-200 dark:hover:border-blue-500 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg text-blue-600 dark:text-blue-400"><Bell size={24}/></div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage email alerts when evaluations are complete.</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:border-blue-200 dark:hover:border-blue-500 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 dark:bg-gray-700 p-3 rounded-lg text-purple-600 dark:text-purple-400"><Shield size={24}/></div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">Privacy & Security</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update password and student data visibility.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}