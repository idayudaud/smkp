
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RecordForm from './components/RecordForm';
import AdminDashboard from './components/AdminDashboard';
import { User } from './types';

const Login: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'mmi2024') {
      onLogin({ username: 'admin', role: 'admin' });
    } else {
      setError('Kata laluan atau nama pengguna salah.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">
            <i className="fas fa-user-shield"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Portal Pentadbiran</h2>
          <p className="text-slate-500 font-medium text-sm mt-2">Sila log masuk untuk akses dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Pengguna</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition bg-slate-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kata Laluan</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition bg-slate-50"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-[#1e3a8a] text-white font-black py-4 rounded-2xl hover:bg-blue-900 transition shadow-xl"
          >
            LOG MASUK
          </button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<RecordForm />} />
            <Route 
              path="/admin" 
              element={user ? <AdminDashboard /> : <Login onLogin={setUser} />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
