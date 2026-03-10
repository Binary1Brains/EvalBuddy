import React from 'react';
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentDetail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8 relative">
      
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Back Button */}import React from 'react';
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentDetail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8 relative">
      
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 flex justify-between items-center border-l-8 border-l-blue-500">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Parijat Dhar </h1>
            <p className="text-gray-500 mt-2 font-medium">ID: 16500123019 | Class: Computer Science</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Overall Grade</p>
            <p className="text-5xl font-black text-emerald-500 drop-shadow-sm">A-</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Past Papers (Takes up 2 columns) */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-500" /> Evaluated Papers
            </h2>

            {/* Paper Item 1 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Midterm Exam: Data Structures</h3>
                <p className="text-sm text-gray-500 mt-1">Evaluated on: Oct 12, 2025</p>
              </div>
              <div className="bg-emerald-50 text-emerald-700 font-bold text-lg py-2 px-4 rounded-xl border border-emerald-100">
                88 / 100
              </div>
            </div>

            {/* Paper Item 2 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Quiz: Graph Theory & Trees</h3>
                <p className="text-sm text-gray-500 mt-1">Evaluated on: Sept 28, 2025</p>
              </div>
              <div className="bg-blue-50 text-blue-700 font-bold text-lg py-2 px-4 rounded-xl border border-blue-100">
                92 / 100
              </div>
            </div>
          </div>

          {/* Right Column: AI Insights */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Award className="text-yellow-500" /> AI Insights
            </h2>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" /> Mastered Concepts
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Array Manipulation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Big-O Notation</li>
              </ul>

              <div className="w-full h-px bg-gray-100 my-6"></div>

              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" /> Needs Review
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Dynamic Programming</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Graph Traversals (BFS/DFS)</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 flex justify-between items-center border-l-8 border-l-blue-500">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Parijat Dhar </h1>
            <p className="text-gray-500 mt-2 font-medium">ID: 16500123019 | Class: Computer Science</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Overall Grade</p>
            <p className="text-5xl font-black text-emerald-500 drop-shadow-sm">A-</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Past Papers (Takes up 2 columns) */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-500" /> Evaluated Papers
            </h2>

            {/* Paper Item 1 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Midterm Exam: Data Structures</h3>
                <p className="text-sm text-gray-500 mt-1">Evaluated on: Oct 12, 2025</p>
              </div>
              <div className="bg-emerald-50 text-emerald-700 font-bold text-lg py-2 px-4 rounded-xl border border-emerald-100">
                88 / 100
              </div>
            </div>

            {/* Paper Item 2 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Quiz: Graph Theory & Trees</h3>
                <p className="text-sm text-gray-500 mt-1">Evaluated on: Sept 28, 2025</p>
              </div>
              <div className="bg-blue-50 text-blue-700 font-bold text-lg py-2 px-4 rounded-xl border border-blue-100">
                92 / 100
              </div>
            </div>
          </div>

          {/* Right Column: AI Insights */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Award className="text-yellow-500" /> AI Insights
            </h2>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" /> Mastered Concepts
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Array Manipulation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Big-O Notation</li>
              </ul>

              <div className="w-full h-px bg-gray-100 my-6"></div>

              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" /> Needs Review
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Dynamic Programming</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Graph Traversals (BFS/DFS)</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}