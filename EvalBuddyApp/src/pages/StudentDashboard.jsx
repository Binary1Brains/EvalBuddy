import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Inbox, FileText, ClipboardList, Bell, Settings, LogOut, MessageCircle } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SIDEBAR (From  sketch) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 mb-2" />
          <h2 className="font-bold text-gray-800 text-lg">EvalBuddy</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 text-gray-600 font-medium text-sm">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-emerald-50 text-emerald-600"><LayoutDashboard size={18}/> Dashboard</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><Inbox size={18}/> Inbox</button>
          <button 
           onClick={() => navigate('/student/results')}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><FileText size={18}/> Result</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><ClipboardList size={18}/> Assignment</button>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2 text-gray-600 font-medium text-sm">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><Bell size={18}/> Notifications</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><Settings size={18}/> Settings</button>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 relative">
        
        {/* Top Search Bar */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input type="text" placeholder="Ask or Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-[#10b981] outline-none" />
          </div>
        </div>

        {/* Welcome Section (From Sketch) */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 shadow-inner"></div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Welcome, Sumit Dey</h2>
              <button className="text-sm font-medium text-blue-500 hover:underline mt-1">Edit Profile</button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 font-medium">Student ID</p>
            <p className="text-xl font-bold text-gray-800">16500123035</p>
          </div>
        </div>

        {/* Action Button */}
        <button 
        onClick={() => navigate('/self-evaluation')}
        className="w-full max-w-2xl bg-gradient-to-r from-[#10b981] to-emerald-400 text-white font-bold text-xl py-5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all mb-12 border border-emerald-500 flex justify-center items-center">
          Start your self evaluation
        </button>

        {/* Info Links */}
        <div className="flex gap-12 border-t border-gray-200 pt-8">
          <button className="text-gray-500 font-medium hover:text-gray-800 transition-colors underline decoration-2 underline-offset-4">How to use</button>
          <button className="text-gray-500 font-medium hover:text-gray-800 transition-colors underline decoration-2 underline-offset-4">FAQs</button>
        </div>

        {/* Chatbot Floating Icon (Bottom Right) */}
        <button className="absolute bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white hover:bg-indigo-700 hover:scale-105 transition-all">
          <MessageCircle size={28} />
        </button>

      </main>
    </div>
  );
}