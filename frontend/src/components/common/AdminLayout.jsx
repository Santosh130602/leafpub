import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import {
  LayoutDashboard, Inbox, Users, LogOut, Leaf, ChevronLeft, ChevronRight
} from 'lucide-react';
import useWebSocket from '../../hooks/useWebSocket';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State to manage whether the sidebar is collapsed (icons-only) or expanded
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleWsMessage = React.useCallback((data) => {
    if (data.type === 'NEW_TICKET') {
      toast(`New ticket: ${data.ticket.subject}`, {
        icon: '🎫',
        duration: 6000,
        style: { maxWidth: '400px' }
      });
      window.dispatchEvent(new CustomEvent('new-ticket', { detail: data }));
    }
    if (data.type === 'TICKET_UPDATED') {
      window.dispatchEvent(new CustomEvent('ticket-updated', { detail: data }));
    }
  }, []);

  useWebSocket(handleWsMessage);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased">
      
      {/* Dynamic Collapsible Sidebar container */}
      <aside 
        className={`bg-[#11281c] text-slate-200 border-r border-emerald-950/40 flex flex-col justify-between relative transition-all duration-300 ease-in-out shrink-0 h-screen sticky top-0 ${
          isCollapsed ? 'w-20 p-4' : 'w-64 p-5'
        }`}
      >
        {/* Toggle Expand/Collapse Trigger Button floating on the right border */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-7 -right-3.5 bg-white border border-slate-200 text-slate-700 p-1 rounded-full shadow-md hover:bg-slate-50 hover:text-emerald-800 transition-all z-50 cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div>
          {/* Top Brand Block */}
          <div className={`flex items-center gap-3 mb-8 mt-2 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/10 shrink-0">
              <Leaf size={20} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-fade-in">
                <span className="font-bold tracking-tight text-white leading-none">BookLeaf</span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mt-1">Admin Portal</span>
              </div>
            )}
          </div>

          {/* Navigation Links Grid */}
          <nav className="space-y-1.5">
            {!isCollapsed && (
              <div className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest px-2.5 mb-2.5 animate-fade-in">
                Operations
              </div>
            )}

            {/* Dashboard Workspace Route Link */}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                ${isActive 
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/30' 
                  : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <LayoutDashboard size={18} className="shrink-0" />
              {!isCollapsed && <span className="animate-fade-in">Dashboard</span>}
              
              {/* Native tooltip displayed only when layout is collapsed */}
              {isCollapsed && (
                <div className="absolute left-16 bg-slate-900 text-white text-xs font-normal py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                  Dashboard
                </div>
              )}
            </NavLink>

            {/* Ticket Queue Route Link */}
            <NavLink
              to="/admin/tickets"
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                ${isActive 
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/30' 
                  : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Inbox size={18} className="shrink-0" />
              {!isCollapsed && <span className="animate-fade-in">Ticket Queue</span>}
              
              {isCollapsed && (
                <div className="absolute left-16 bg-slate-900 text-white text-xs font-normal py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                  Ticket Queue
                </div>
              )}
            </NavLink>

            {/* Authors Management Route Link */}
            <NavLink
              to="/admin/authors"
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                ${isActive 
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/30' 
                  : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Users size={18} className="shrink-0" />
              {!isCollapsed && <span className="animate-fade-in">Authors</span>}
              
              {isCollapsed && (
                <div className="absolute left-16 bg-slate-900 text-white text-xs font-normal py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                  Authors
                </div>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer: User Account Metadata Block */}
        <div className="pt-4 border-t border-emerald-900/60">
          <div className={`flex items-center rounded-xl bg-emerald-950/40 border border-emerald-900/30 ${
            isCollapsed ? 'p-1.5 flex-col gap-3 justify-center' : 'p-3 justify-between'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              {/* Initials Avatar Box */}
              <div 
                className="w-9 h-9 font-bold text-xs rounded-lg flex items-center justify-center shrink-0 uppercase tracking-wider"
                style={{ background: '#D4A853', color: '#0F2E21' }}
              >
                {getInitials(user?.name)}
              </div>
              
              {!isCollapsed && (
                <div className="min-w-0 animate-fade-in">
                  <div className="text-xs font-semibold text-white truncate leading-tight">
                    {user?.name || "Admin Account"}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium tracking-wide mt-0.5">
                    Platform Admin
                  </div>
                </div>
              )}
            </div>

            {/* Sign Out Trigger Interactive Icon Button */}
            <button
              onClick={handleLogout}
              className={`text-emerald-300/60 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all cursor-pointer group relative ${
                isCollapsed ? 'w-full flex justify-center' : ''
              }`}
              title={isCollapsed ? "" : "Logout"}
            >
              <LogOut size={16} />
              
              {isCollapsed && (
                <div className="absolute left-16 bg-red-950 text-red-200 text-xs font-semibold py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-red-900/30">
                  Logout Session
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container Layer where application panels/outlets render */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <div className="p-6 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
          {/* Dynamic nested sub-routes populate perfectly within this block */}
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;