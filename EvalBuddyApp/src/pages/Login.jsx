import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  LayoutDashboard, Inbox, Megaphone, Bell, Settings, LogOut, 
  Search, Plus, BookOpen, Maximize2, BarChart2, Network, X, Folder, Upload 
} from 'lucide-react';

const graphData = {
  nodes: [
    { id: 'CS', name: 'C.S. Evaluation', val: 8, color: '#10b981' },
    { id: 'DS', name: 'Data Structures', val: 6, color: '#3b82f6' },
    { id: 'Algo', name: 'Algorithms', val: 6, color: '#3b82f6' },
    { id: 'Array', name: 'Arrays (Mastered)', val: 4, color: '#3b82f6' },
    { id: 'Tree', name: 'Trees (Struggling)', val: 5, color: '#ef4444' },
    { id: 'Sort', name: 'Sorting', val: 4, color: '#eab308' },
    { id: 'Graph', name: 'Graph Theory', val: 4, color: '#3b82f6' }
  ],
  links: [
    { source: 'CS', target: 'DS' }, { source: 'CS', target: 'Algo' },
    { source: 'DS', target: 'Array' }, { source: 'DS', target: 'Tree' },
    { source: 'Algo', target: 'Sort' }, { source: 'Algo', target: 'Graph' }
  ]
};

const studentDatabase = [
  { id: "16500123009", name: "Bhishal Sikdar", color: "blue" },
  { id: "16500123019", name: "Parijat Dhar", color: "purple" },
  { id: "16500123026", name: "Soham Dutta", color: "emerald" },
  { id: "16500123035", name: "Sumit Dey", color: "orange" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [isNewEvalModalOpen, setIsNewEvalModalOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans transition-colors duration-300">
      
      {/* SIDEBAR (From your sketch!) */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden md:flex transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <h2 className="font-bold text-gray-800 dark:text-white text-lg tracking-tight">EvalBuddy</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 text-gray-600 dark:text-gray-300 font-medium text-sm">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#10b981]"><LayoutDashboard size={18}/> Dashboard</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"><Inbox size={18}/> Inbox</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"><Megaphone size={18}/> New announcement</button>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2 text-gray-600 dark:text-gray-300 font-medium text-sm">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"><Bell size={18}/> Notifications</button>
          
          {/* SETTINGS BUTTON: Navigates to the Settings Page */}
          <button onClick={() => navigate('/settings')} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Settings size={18}/> Settings
          </button>
          
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><LogOut size={18}/> Log out</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 relative overflow-y-auto w-full">
        
        {/* Top Search Bar */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Teacher Dashboard</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Ask or Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-[#10b981] outline-none transition-colors" 
            />
          </div>
        </div>

        {/* WELCOME SECTION (From Sketch) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-inner"></div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, Bhishal Sikdar</h2>
              <button className="mt-2 text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Teacher ID</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">T-894</p>
          </div>
        </div>

        {/* CREATE EVALUATION BUTTON (From Sketch) */}
        <button 
          onClick={() => setIsNewEvalModalOpen(true)}
          className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xl py-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all mb-12 flex justify-center items-center gap-3 border border-emerald-500"
        >
          <Plus size={28} /> Create new Evaluation
        </button>

        {/* EXISTING AWESOME DASHBOARD FEATURES */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BookOpen className="text-blue-500" size={24}/> Recent: Computer Science Evaluation
            </h3>
            <button className="text-gray-400 hover:text-blue-500 transition-colors bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
              <Maximize2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <h5 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <BarChart2 className="text-[#10b981]" size={18}/> Marks Statistics
              </h5>
              <div className="space-y-4">
                <div className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-600 pb-2"><span className="text-gray-600 dark:text-gray-400">Highest Score</span><span className="font-bold text-emerald-600 dark:text-emerald-400">98 / 100</span></div>
                <div className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-600 pb-2"><span className="text-gray-600 dark:text-gray-400">Class Average</span><span className="font-bold text-blue-600 dark:text-blue-400">72 / 100</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600 dark:text-gray-400">Concept Misses</span><span className="font-bold text-red-500 dark:text-red-400">Avg. 3 per paper</span></div>
              </div>
            </div>

            <div 
              onClick={() => setIsGraphOpen(true)}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group/graph"
            >
              <div className="relative w-24 h-24 mb-4">
                <Network className="absolute inset-0 w-full h-full text-blue-400 dark:text-blue-500 group-hover/graph:text-blue-600 transition-colors drop-shadow-md" />
                <div className="absolute top-2 left-2 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 right-2 w-3 h-3 bg-red-400 rounded-full"></div>
              </div>
              <span className="text-lg font-bold text-blue-800 dark:text-blue-300">Check Knowledge Graph</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full">Click to expand nodes</span>
            </div>
          </div>
        </div>

      </main>

      {/* MODAL 1: Create New Evaluation */}
      {isNewEvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-transparent dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h3 className="font-bold text-gray-800 dark:text-white text-lg">Create new database</h3>
              <button onClick={() => setIsNewEvalModalOpen(false)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Student database</label>
                  <select className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-200 outline-none">
                    {studentDatabase.map(student => <option key={student.id}>{student.name} DB</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Subject</label>
                  <select className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-200 outline-none">
                    <option>Computer Science</option><option>Physics</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paste path to Image directory</label>
                <div className="relative">
                  <Folder className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                  <input type="text" placeholder="C:/Users/Documents/Student_Answers/" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none" />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold py-3 rounded-lg flex justify-center items-center gap-2"><Upload size={18} /> Add Images</button>
                <button className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold py-3 rounded-lg border border-gray-200 dark:border-gray-600">Edit Content</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE KNOWLEDGE GRAPH */}
      {isGraphOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-transparent dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
                  <Network className="text-blue-500" size={20}/> Class Knowledge Map
                </h3>
              </div>
              <button onClick={() => setIsGraphOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="bg-gray-900 w-full h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing">
              <ForceGraph2D width={850} height={500} graphData={graphData} nodeAutoColorBy="group" nodeLabel="name" nodeColor={node => node.color} nodeRelSize={6} linkColor={() => '#4b5563'} linkWidth={2} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}