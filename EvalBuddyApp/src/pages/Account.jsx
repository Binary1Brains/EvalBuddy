import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Settings, UserCircle, LayoutDashboard, LogOut } from 'lucide-react';

export default function Account() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400"></div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">EvalBuddy</h1>
        </div>
        
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <button onClick={() => navigate('/dashboard')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><LayoutDashboard size={18}/> Overview</button>
          <button onClick={() => navigate('/subscriptions')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><BookOpen size={18}/> Subscriptions</button>
          <button onClick={() => navigate('/settings')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><Settings size={18}/> Settings</button>
          <button onClick={() => navigate('/account')} className="text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-[#10b981]"><UserCircle size={18}/> Account</button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="p-8 flex-1 max-w-2xl mx-auto w-full mt-8">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 mx-auto mb-4 border-4 border-white shadow-lg"></div>
          <h2 className="text-2xl font-bold text-gray-800">Teacher Profile</h2>
          <p className="text-gray-500 font-medium mb-8">teacher@school.com</p>
          
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18}/> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}