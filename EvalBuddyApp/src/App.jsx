import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. IMPORT ALL YOUR PAGES
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard'; // This is the Teacher Dashboard
import StudentDashboard from './pages/StudentDashboard';
import StudentResult from './pages/StudentResult';
import AdminDashboard from './pages/AdminDashboard';
import SelfEvaluation from './pages/SelfEvaluation';
// Keep your settings pages if you still have them!
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import Account from './pages/Account';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 2. AUTHENTICATION ROUTES */}
        <Route path="/" element={<Login />} />
        
        {/* THIS IS THE ROUTE THAT WAS MISSING! */}
        <Route path="/signup" element={<Signup />} />

        {/* 3. ROLE-SPECIFIC DASHBOARDS */}
        <Route path="/teacher" element={<Dashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/self-evaluation" element={<SelfEvaluation />} />
        <Route path="/student/results" element={<StudentResult />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 4. EXTRA SETTINGS PAGES */}
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}