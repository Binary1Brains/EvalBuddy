import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Inbox, FileText, ClipboardList, Bell, Settings, LogOut, UploadCloud, FileJson, FileImage, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function SelfEvaluation() {
  const navigate = useNavigate();
  
  // REACT STATE: To track uploaded files and evaluation status
  const [questionFile, setQuestionFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  // Fake AI Evaluation Logic for the Hackathon Demo
  const handleEvaluate = () => {
    if (!questionFile || !answerFile) {
      alert("Please upload both the Question Set and Answer Script first!");
      return;
    }
    
    // Start loading spinner
    setIsEvaluating(true);
    setResult(null);

    // Pretend the Python AI takes 2.5 seconds to grade it
    setTimeout(() => {
      setIsEvaluating(false);
      setResult({
        score: "85 / 100",
        feedback: "Great job! You perfectly understood Dynamic Programming, but you lost points on the Graph Theory question. Review Dijkstra's Algorithm.",
        missedConcepts: ["Dijkstra's Algorithm", "Time Complexity Analysis"]
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 mb-2" />
          <h2 className="font-bold text-gray-800 text-lg">EvalBuddy</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-gray-600 font-medium text-sm">
          <button onClick={() => navigate('/student')} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"><LayoutDashboard size={18}/> Dashboard</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><Inbox size={18}/> Inbox</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><FileText size={18}/> Result</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><ClipboardList size={18}/> Assignment</button>
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-2 text-gray-600 font-medium text-sm">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><Bell size={18}/> Notifications</button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50"><Settings size={18}/> Settings</button>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 relative max-w-4xl mx-auto w-full">
        
        <button 
          onClick={() => navigate('/student')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#10b981] font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Start your self evaluation</h1>

        {/* UPLOAD CARD (Based on your sketch!) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          
          <div className="space-y-6">
            
            {/* Box 1: Question Set Upload */}
            <div>
              <input type="file" id="question-upload" accept=".json" className="hidden" onChange={(e) => setQuestionFile(e.target.files[0])} />
              <div 
                onClick={() => document.getElementById('question-upload').click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${questionFile ? 'border-[#10b981] bg-emerald-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
              >
                {questionFile ? (
                  <><FileJson className="text-[#10b981] mb-2" size={32} /><span className="font-bold text-[#10b981]">{questionFile.name}</span></>
                ) : (
                  <><UploadCloud className="text-gray-400 mb-2" size={32} /><span className="font-medium text-gray-600">Upload the question set (.json)</span></>
                )}
              </div>
            </div>

            {/* Box 2: Answer Script Upload */}
            <div>
              <input type="file" id="answer-upload" accept="image/*,.pdf" className="hidden" onChange={(e) => setAnswerFile(e.target.files[0])} />
              <div 
                onClick={() => document.getElementById('answer-upload').click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${answerFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
              >
                {answerFile ? (
                  <><FileImage className="text-blue-500 mb-2" size={32} /><span className="font-bold text-blue-500">{answerFile.name}</span></>
                ) : (
                  <><UploadCloud className="text-gray-400 mb-2" size={32} /><span className="font-medium text-gray-600">Upload your answer script (.pdf or image)</span></>
                )}
              </div>
            </div>

            {/* Evaluate Button */}
            <button 
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-lg py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <><Loader2 className="animate-spin" size={24} /> Evaluating with AI...</>
              ) : (
                'Evaluate'
              )}
            </button>

          </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#10b981] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CheckCircle className="text-[#10b981]" size={28}/> Result
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-gray-500 font-medium mb-2">Estimated Score</p>
                <p className="text-4xl font-black text-[#10b981]">{result.score}</p>
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">AI Feedback:</h3>
                  <p className="text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-100">{result.feedback}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">Concepts to Review:</h3>
                  <div className="flex gap-2 flex-wrap">
                    {result.missedConcepts.map((concept, index) => (
                      <span key={index} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium border border-red-100">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}