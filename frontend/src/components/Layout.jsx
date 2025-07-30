import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-8">Wellness App</h1>
        <Link to="/" className="hover:text-indigo-200">🏠 Dashboard</Link>
        <Link to="/my-sessions" className="hover:text-indigo-200">📄 My Sessions</Link>
        <Link to="/editor" className="hover:text-indigo-200">📝 Create New</Link>
        <button onClick={logout} className="mt-auto bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Wellness Session Platform</h2>
          <span className="text-gray-600">👤 Logged In</span>
        </div>

        {/* Page Content */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
