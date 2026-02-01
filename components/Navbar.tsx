
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-[#1e3a8a] p-4 text-white shadow-xl border-b-4 border-[#ef4444] sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-4">
          <img 
            src="https://i.ibb.co/v4mYp0N/logo-smk-penampang.png" 
            alt="Logo SMK Penampang" 
            className="h-12 w-12 bg-white p-1 rounded-full shadow-md object-contain"
          />
          <div>
            <h1 className="text-lg md:text-xl font-bold leading-tight tracking-tight">E-MMI SYSTEM</h1>
            <p className="text-[10px] md:text-xs text-blue-200 font-medium uppercase">SMK Penambang Kota Bharu</p>
          </div>
        </Link>
        <div className="flex gap-2">
          <Link 
            to="/" 
            className={`text-sm px-4 py-2 rounded-lg transition font-medium ${location.pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
          >
            <i className="fas fa-edit mr-2 hidden md:inline"></i>Borang
          </Link>
          <Link 
            to="/admin" 
            className="text-sm bg-yellow-400 text-blue-900 px-5 py-2 rounded-lg font-bold hover:bg-yellow-300 transition shadow-sm flex items-center"
          >
            <i className="fas fa-lock mr-2"></i>Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
