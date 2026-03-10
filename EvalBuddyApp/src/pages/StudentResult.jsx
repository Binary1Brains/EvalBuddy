import React from 'react';
import { useNavigate } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import { LayoutDashboard, Inbox, FileText, ClipboardList, Bell, Settings, LogOut, TrendingUp, AlertCircle, Award, CheckCircle } from 'lucide-react';

// FAKE STUDENT KNOWLEDGE GRAPH DATA
const studentGraphData = {
  nodes: [
    { id: 'CS', name: 'Computer Science', val: 8, color: '#3b82f6' },
    { id: 'Array', name: 'Arrays (Mastered)', val: 6, color: '#10b981' }, // Green
    { id: 'Linked', name: 'Linked Lists (Mastered)', val: 6, color: '#10b981' }, // Green
    { id: 'Tree', name: 'Trees (Struggling)', val: 6, color: '#ef4444' }, // Red
    { id: 'DP', name: 'Dynamic Programming (Struggling)', val: 6, color: '#ef4444' }, // Red
    { id: 'Sort', name: 'Sorting (Review)', val: 5, color: '#eab308' } // Yellow
  ],
  links: [
    { source: 'CS', target: 'Array' }, { source: 'CS', target: 'Linked' },
    { source: 'CS', target: 'Tree' }, { source: 'CS', target: 'DP' },
    { source: 'Array', target: 'Sort' }
  ]
};

const pastEvaluations = [
  { id: 1, title: "Midterm: Data Structures", date: "Oct 12, 2025", score: "85 / 100", status: "Evaluated" },
  { id: 2, title: "Quiz: Graph Theory", date: "Sept 28, 2025", score: "92 / 100", status: "Evaluated" },
  { id: 3, title: "Practice: Dynamic Programming", date: "Sept 15, 2025", score: "68 / 100", status: "Needs Review" }
];

export default function StudentResult() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 mb-2" />
          <h2 className="font-bold text-gray-800 text-lg">EvalBuddy</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-gray-600 font-medium text-sm">
          <button onClick={() => navigate('/student')} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><LayoutDashboard size={18}/> Dashboard</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><Inbox size={18}/> Inbox</button>
          <button onClick={() => navigate('/student/results')} className="flex items-center gap-3 w-full p-3 rounded-lg bg-emerald-50 text-[#10b981]"><FileText size={18}/> Result</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><ClipboardList size={18}/> Assignment</button>
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-2 text-gray-600 font-medium text-sm">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><Bell size={18}/> Notifications</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><Settings size={18}/> Settings</button>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 relative overflow-y-auto">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Performance Insights</h1>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600"><Award size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Average Score</p>
              <h3 className="text-2xl font-bold text-gray-800">81.6%</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600"><TrendingUp size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Evaluations Taken</p>
              <h3 className="text-2xl font-bold text-gray-800">12</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-red-100 p-4 rounded-full text-red-600"><AlertCircle size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Weakest Subject</p>
              <h3 className="text-xl font-bold text-gray-800">Dyn. Programming</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Interactive Graph */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Personal Knowledge Map</h2>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">Interactive</span>
            </div>
            <div className="w-full h-[400px] bg-gray-900 flex items-center justify-center cursor-grab active:cursor-grabbing">
              <ForceGraph2D
                width={600}
                height={400}
                graphData={studentGraphData}
                nodeAutoColorBy="group"
                nodeLabel="name"
                nodeColor={node => node.color}
                nodeRelSize={6}
                linkColor={() => '#4b5563'}
                linkWidth={2}
              />
            </div>
            <div className="p-4 bg-white flex justify-center gap-6 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Mastered</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Needs Review</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Struggling</span>
            </div>
          </div>

          {/* Right: Past Evaluations List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ClipboardList className="text-blue-500" /> Past Evaluations
            </h2>
            
            <div className="space-y-4">
              {pastEvaluations.map((evalItem) => (
                <div key={evalItem.id} className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{evalItem.title}</h3>
                    <span className="font-black text-lg text-gray-800">{evalItem.score}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{evalItem.date}</span>
                    <span className={`px-3 py-1 rounded-full font-medium text-xs ${evalItem.status === 'Evaluated' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {evalItem.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 text-[#10b981] font-bold bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
              View All History
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}