import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Users, Server, Activity, Settings, LogOut, 
  Search, Bell, MoreVertical, CheckCircle2, AlertTriangle, GraduationCap
} from 'lucide-react';

// Fake Data for the Hackathon Demo
const systemStats = [
  { label: "Total Students", value: "1,248", icon: <Users size={20} className="text-blue-500" />, trend: "+12% this month" },
  { label: "Active Teachers", value: "42", icon: <GraduationCap size={20} className="text-purple-500" />, trend: "+3 new this week" },
  { label: "AI Evaluations", value: "8,439", icon: <Activity size={20} className="text-emerald-500" />, trend: "Processing fast" },
  { label: "System Uptime", value: "99.9%", icon: <Server size={20} className="text-orange-500" />, trend: "All systems operational" }
];

const recentUsers = [
  { id: "16500123009", name: "Bhishal Sikdar", role: "Student", status: "Online", date: "Just now" },
  { id: "16500323002", name: "Ankita Dhar", role: "Teacher", status: "Online", date: "2 mins ago" },
  { id: "16500123019", name: "Parijat Dhar", role: "Student", status: "Offline", date: "1 hour ago" },
  { id: "16500123026", name: "Soham Dutta", role: "Student", status: "In Evaluation", date: "3 hours ago" },
  { id: "T-894", name: "Dr. A. Sharma", role: "Admin", status: "Offline", date: "1 day ago" }
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* ADMIN SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <ShieldAlert className="text-emerald-400" size={28} />
          <h2 className="font-bold text-white text-lg tracking-wide">EvalBuddy Admin</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 font-medium text-sm">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Overview</p>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-emerald-500/10 text-emerald-400"><Activity size={18}/> System Status</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"><Users size={18}/> User Management</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"><Server size={18}/> Server Logs</button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 font-medium text-sm">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-800 hover:text-white"><Settings size={18}/> Global Settings</button>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"><LogOut size={18}/> Secure Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">CIEM Administration Portal</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2 text-gray-400" size={16} />
              <input type="text" placeholder="Search logs or users..." className="w-full pl-9 pr-4 py-1.5 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
            </div>
            <button className="relative text-gray-500 hover:text-gray-800">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD CONTENT */}
        <div className="p-8 flex-1 overflow-y-auto">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {systemStats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
                  <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-emerald-600 font-bold mt-4 bg-emerald-50 inline-block px-2 py-1 rounded-md">{stat.trend}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* USER MANAGEMENT TABLE */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Recent Network Activity</h2>
                <button className="text-sm font-bold text-blue-600 hover:underline">View All Users</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">User</th>
                      <th className="p-4 font-bold">Role</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentUsers.map((user, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                            user.role === 'Teacher' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 flex items-center gap-2 mt-2">
                          <div className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-emerald-500' : user.status === 'Offline' ? 'bg-gray-400' : 'bg-yellow-500 animate-pulse'}`}></div>
                          <span className="text-sm font-medium text-gray-700">{user.status}</span>
                        </td>
                        <td className="p-4 text-sm text-gray-500 font-medium">{user.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SYSTEM ALERTS PANEL */}
            <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 flex flex-col text-white">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Server className="text-blue-400" /> Python AI Server Status
              </h2>
              
              <div className="space-y-4 flex-1">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex gap-4">
                  <CheckCircle2 className="text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Vision Model Connected</h4>
                    <p className="text-xs text-slate-400 mt-1">OCR endpoint responding in 120ms.</p>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex gap-4">
                  <CheckCircle2 className="text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Database Synchronized</h4>
                    <p className="text-xs text-slate-400 mt-1">Student records synced successfully.</p>
                  </div>
                </div>

                <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 flex gap-4">
                  <AlertTriangle className="text-orange-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-orange-300">High API Load</h4>
                    <p className="text-xs text-orange-200/70 mt-1">Evaluation queue currently at 85% capacity. Scaling recommended.</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50">
                Restart Services
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}