import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Notice we imported 'Mail' instead of 'Phone' here!
import { UserCircle, Hash, Mail, Lock, UserPlus, User, GraduationCap, ShieldAlert } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Student'); 

  const handleSignup = (e) => {
    e.preventDefault();
    // Strict Redirection after account creation!
    if (role === 'Student') navigate('/student');
    else if (role === 'Teacher') navigate('/teacher');
    else if (role === 'Admin') navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="flex flex-col items-center justify-center gap-2 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-sm">Join EvalBuddy today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Role Selector */}
          <div className="bg-gray-100 p-1.5 rounded-xl flex justify-between items-center mb-4">
            {['Student', 'Teacher', 'Admin'].map((r) => (
              <button
                key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                  role === r ? 'bg-white text-[#10b981] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r === 'Student' && <User size={16} />}
                {r === 'Teacher' && <GraduationCap size={16} />}
                {r === 'Admin' && <ShieldAlert size={16} />}
                {r}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" required placeholder="John Doe" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#10b981] outline-none transition-all focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" required placeholder="e.g. 16500123..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#10b981] outline-none transition-all focus:bg-white" />
            </div>
          </div>

          {/* THE NEW EMAIL FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="email" required placeholder="name@school.edu" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#10b981] outline-none transition-all focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="password" required placeholder="Create a secure password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#10b981] outline-none transition-all focus:bg-white" />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4">
            <UserPlus size={18} /> Register as {role}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/" className="text-[#10b981] font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}