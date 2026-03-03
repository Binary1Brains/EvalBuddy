import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  BookOpen, Settings, UserCircle, LayoutDashboard, Plus, Search, 
  X, Upload, Folder, Maximize2, BarChart2, Network 
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

  const filteredStudents = studentDatabase.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.id.includes(searchQuery)
  );

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      alert(`Successfully selected ${e.target.files.length} file(s) for evaluation!`);
    }
  };

  return (
    // Added dark:bg-gray-900 here
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans relative transition-colors duration-300">
      
      {/* 1. TOP NAVBAR */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <img src="/logo.jpeg"alt="EvalBuddy Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">EvalBuddy</h1>
        </div>
        
        <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <button onClick={() => navigate('/dashboard')} className="text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-[#10b981]"><LayoutDashboard size={18}/> Overview</button>
          <button onClick={() => navigate('/subscriptions')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><BookOpen size={18}/> Subscriptions</button>
          <button onClick={() => navigate('/settings')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><Settings size={18}/> Settings</button>
          <button onClick={() => navigate('/account')} className="hover:text-[#10b981] flex items-center gap-1 pb-1 border-b-2 border-transparent"><UserCircle size={18}/> Account</button>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <div className="p-8 flex-1 max-w-7xl mx-auto w-full">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Teacher Dashboard</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search global student..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            
            <section>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 transition-colors">Overview</h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div 
                      key={student.id}
                      onClick={() => navigate('/student')}
                      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-[200px] border-l-4 border-l-${student.color}-500 cursor-pointer hover:shadow-md transition-all duration-300`}
                    >
                      <p className="font-medium text-gray-800 dark:text-white">{student.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {student.id}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic py-4">No students found matching "{searchQuery}"</p>
                )}

              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 transition-colors">History</h3>
                <span className="text-xs font-medium bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full">Evaluated Answers</span>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300 group">
                <div className="flex justify-between items-center mb-5 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h4 className="font-bold text-gray-800 dark:text-white text-xl flex items-center gap-2">
                    <BookOpen className="text-blue-500" size={24}/>
                    Computer Science Evaluation
                  </h4>
                  <button className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors bg-gray-50 dark:bg-gray-700 p-2 rounded-lg" title="Full Screen View">
                    <Maximize2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 transition-colors">
                    <h5 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                      <BarChart2 className="text-emerald-500" size={18}/> Marks Statistics
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-600 pb-2"><span className="text-gray-600 dark:text-gray-400">Highest Score</span><span className="font-bold text-emerald-600 dark:text-emerald-400">98 / 100</span></div>
                      <div className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-600 pb-2"><span className="text-gray-600 dark:text-gray-400">Class Average</span><span className="font-bold text-blue-600 dark:text-blue-400">72 / 100</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600 dark:text-gray-400">Concept Misses</span><span className="font-bold text-red-500 dark:text-red-400">Avg. 3 per paper</span></div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setIsGraphOpen(true)}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 border border-blue-100 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group/graph"
                  >
                    <div className="relative w-24 h-24 mb-3">
                      <Network className="absolute inset-0 w-full h-full text-blue-400 dark:text-blue-500 group-hover/graph:text-blue-600 dark:group-hover/graph:text-blue-400 transition-colors drop-shadow-md" />
                      <div className="absolute top-2 left-2 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-4 right-2 w-3 h-3 bg-red-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Check Knowledge Graph</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">Click to expand nodes</span>
                  </div>

                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={16} />
                  <input type="text" placeholder="Search student in C.S. Evaluation..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Catchup where you left</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-400 font-medium"><span>C.S. Evaluation</span><span>50%</span></div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '50%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-400 font-medium"><span>Physics Evaluation</span><span>78%</span></div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '78%' }}></div></div>
                </div>
              </div>
            </section>

            <button 
              onClick={() => setIsNewEvalModalOpen(true)}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Create new Evaluation
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Create New Evaluation */}
      {isNewEvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h3 className="font-bold text-gray-800 dark:text-white text-lg">Create new database</h3>
              <button onClick={() => setIsNewEvalModalOpen(false)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full p-1 hover:bg-red-50 dark:hover:bg-red-900/30"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Student database</label>
                  <select className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#10b981] focus:outline-none">
                    {filteredStudents.map(student => (
                      <option key={student.id}>{student.name} DB</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Subject</label>
                  <select className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#10b981] focus:outline-none">
                    <option>Computer Science</option><option>Physics</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paste path to Image directory</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Folder className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                    <input type="text" placeholder="C:/Users/Documents/Student_Answers/" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#10b981]" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <input type="file" multiple className="hidden" id="actual-file-upload" onChange={handleFileUpload} accept="image/*,.pdf"/>
                <button 
                  onClick={() => document.getElementById('actual-file-upload').click()}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold py-3 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex justify-center items-center gap-2"
                >
                  <Upload size={18} /> Add Images
                </button>
                <button 
                  onClick={() => alert("Ready for the backend developer to connect the edit logic!")}
                  className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold py-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit Content
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE KNOWLEDGE GRAPH */}
      {isGraphOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col border border-transparent dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
                  <Network className="text-blue-500" size={20}/> Class Knowledge Map
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Drag nodes to explore. Red nodes indicate missing concepts across the class.</p>
              </div>
              <button onClick={() => setIsGraphOpen(false)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full p-1 hover:bg-red-50 dark:hover:bg-red-900/30"><X size={24} /></button>
            </div>
            <div className="bg-gray-900 w-full h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing">
              <ForceGraph2D
                width={850}
                height={500}
                graphData={graphData}
                nodeAutoColorBy="group"
                nodeLabel="name"
                nodeColor={node => node.color}
                nodeRelSize={6}
                linkColor={() => '#4b5563'}
                linkWidth={2}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}