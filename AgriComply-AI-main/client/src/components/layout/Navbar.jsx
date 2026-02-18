import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArchive, FaRobot, FaSlidersH } from 'react-icons/fa';

const Navbar = ({ onToggleChatbot }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active track based on URL
  const isCompliance = location.pathname.includes('/compliance');
  const isGrowth = location.pathname.includes('/growth');
  const activeTrackLabel = isGrowth ? 'Track B Active' : 'Track A Active';
  const activeTrackClasses = isGrowth
    ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
    : 'border-blue-200 bg-blue-100 text-blue-800';

  return (
    <nav className="flex items-center justify-between border-b border-emerald-100 bg-white px-4 py-3 shadow-sm">
      <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 px-3 py-2 shadow-sm">
        <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-500 to-emerald-700" />
        <div className="flex items-center gap-3 pl-1">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white shadow-sm">
            <FaSlidersH className="text-xs" />
          </span>
          <div className="text-left leading-tight">
            <p className="text-sm font-semibold text-gray-800">Workspace</p>
            <p className="text-xs text-gray-500">Track and manage farmer compliance</p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${activeTrackClasses}`}>
            {activeTrackLabel}
          </span>
        </div>
      </div>
      
      {/* The Core Dual-Track Switch */}
      <div className="flex rounded-xl border border-gray-200 bg-gray-100 p-1.5 shadow-sm">
        <button 
          onClick={() => navigate('/compliance')}
          className={`rounded-lg px-4 py-2 transition-all ${isCompliance ? 'bg-white font-bold text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
        >
          Track A: Compliance
        </button>
        <button 
          onClick={() => navigate('/growth')}
          className={`rounded-lg px-4 py-2 transition-all ${isGrowth ? 'bg-white font-bold text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
        >
          Track B: Growth
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleChatbot}
          className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:from-green-700 hover:to-emerald-800"
        >
          <FaRobot className="text-xs" />
          Chatbot
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-lime-300 ring-2 ring-white" />
        </button>
        <button
          onClick={() => navigate('/vault')}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
        >
          <FaArchive className="text-xs" />
          My Vault
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-200 to-green-300 text-base font-bold text-emerald-900 ring-2 ring-white shadow-md shadow-emerald-100">
          U
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
