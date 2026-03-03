import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// THIS IS THE MAGIC LINE YOU WERE LIKELY MISSING:
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    navigate('/dashboard');
  };

  return (
    <div className="w-full min-h-screen bg-[#fffef9] flex items-center justify-center relative overflow-hidden p-4 font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-[10%] right-[15%] w-72 h-72 bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-full blur-2xl opacity-80 mix-blend-multiply"></div>
      <div className="absolute bottom-[20%] left-[10%] w-32 h-32 bg-gradient-to-tr from-orange-400 to-yellow-300 rounded-full blur-xl opacity-90 mix-blend-multiply"></div>

      {/* Login Card */}
      <div className="relative bg-white px-8 py-10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md z-10">
        
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400"></div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">EvalBuddy</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Good to see you again</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Your email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                type="email"
                placeholder="e.g. teacher@school.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Your password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 px-4 rounded-full transition-colors duration-200 mt-4 shadow-md hover:shadow-lg"
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 flex justify-between items-center text-sm font-medium">
          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Don't have an account?</a>
          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}