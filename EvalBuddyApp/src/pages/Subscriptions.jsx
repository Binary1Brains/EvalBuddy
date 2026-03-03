import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Settings, UserCircle, LayoutDashboard, CheckCircle } from 'lucide-react';

export default function Subscriptions() {
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
          <button onClick={() => navigate('/subscriptions')} className="text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-[#10b981]"><BookOpen size={18}/> Subscriptions</button>
          <button onClick={() => navigate('/settings')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><Settings size={18}/> Settings</button>
          <button onClick={() => navigate('/account')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><UserCircle size={18}/> Account</button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="p-8 flex-1 max-w-4xl mx-auto w-full mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Manage Subscription</h2>
        
        <div className="bg-white rounded-2xl shadow-sm border border-[#10b981] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#10b981] text-white px-4 py-1 rounded-bl-xl text-sm font-bold">CURRENT PLAN</div>
          <h3 className="text-3xl font-black text-gray-800 mb-2">Pro Educator</h3>
          <p className="text-gray-500 mb-6">Unlimited AI evaluations and knowledge graphs.</p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-gray-700 font-medium"><CheckCircle className="text-[#10b981]" size={20}/> Up to 500 Students</li>
            <li className="flex items-center gap-2 text-gray-700 font-medium"><CheckCircle className="text-[#10b981]" size={20}/> Advanced Analytics</li>
            <li className="flex items-center gap-2 text-gray-700 font-medium"><CheckCircle className="text-[#10b981]" size={20}/> Priority AI Processing</li>
          </ul>
          
          <button className="bg-gray-100 text-gray-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors">
            Manage Billing
          </button>
        </div>
      </div>
    </div>
  );
}