import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatDate, getPriorityClass, getStatusClass, truncate, getErrorMessage } from '../../utils/helpers';
import { Inbox, Users, BookOpen, AlertTriangle, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data.data);
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Real-time refresh on new ticket
  useEffect(() => {
    const handler = () => fetchDashboard();
    window.addEventListener('new-ticket', handler);
    window.addEventListener('ticket-updated', handler);
    return () => {
      window.removeEventListener('new-ticket', handler);
      window.removeEventListener('ticket-updated', handler);
    };
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-emerald-800/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-sm font-medium text-slate-500 tracking-wide animate-pulse">
          Loading operations engine...
        </span>
      </div>
    );
  }

  const { stats, categoryStats, priorityStats, recentTickets } = data || {};

  return (
    <div className="space-y-8 pb-12 font-sans antialiased text-slate-900">
      
      {/* Banner + Header Panel Area */}
      <div className="relative  overflow-hidden shadow-xl shadow-slate-100 border border-slate-200/60 bg-emerald-950 text-white min-h-[160px] md:min-h-[180px] flex items-center p-6 md:p-8">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url('https://static.wixstatic.com/media/401514_d0f09d2559d349b79699d1ce19126c4a~mv2.png/v1/fill/w_1443,h_535,al_c,q_90,enc_avif,quality_auto/401514_d0f09d2559d349b79699d1ce19126c4a~mv2.png')` }}
        />
        {/* Soft Linear Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-150 via-emerald-150/80 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1.5">
              Operations Dashboard
            </h1>
            <p className="text-xs md:text-sm font-medium text-emerald-200/80 max-w-md tracking-wide">
              Real-time synchronization engine & BookLeaf platform support queue overview
            </p>
          </div>
          <Link 
            to="/admin/tickets" 
            className="self-start md:self-auto px-4 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-semibold rounded-xl shadow-md transition-all duration-150 flex items-center gap-2"
          >
            <Inbox size={15} />
            Go to Ticket Queue
          </Link>
        </div>
      </div>

      {/* Metrics Grid Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* Total Tickets */}
        <div className="bg-white  rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Inbox size={16} />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Queue</div>
          <div className="text-xl font-bold text-slate-800 mt-0.5">{stats?.totalTickets ?? 0}</div>
        </div>

        {/* Open */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Clock size={16} />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open</div>
          <div className="text-xl font-bold text-slate-800 mt-0.5">{stats?.openTickets ?? 0}</div>
          <span className="text-[9px] font-medium text-amber-600 bg-amber-50 rounded px-1 py-0.5 mt-1 inline-block">Awaiting</span>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Clock size={16} />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Progressing</div>
          <div className="text-xl font-bold text-slate-800 mt-0.5">{stats?.inProgressTickets ?? 0}</div>
        </div>

        {/* Critical */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-3">
            <AlertTriangle size={16} />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical</div>
          <div className="text-xl font-bold text-red-600 mt-0.5">{stats?.criticalTickets ?? 0}</div>
          <span className="text-[9px] font-bold text-red-700 bg-red-50 rounded px-1 py-0.5 mt-1 inline-block animate-pulse">Action Required</span>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle size={16} />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Closed</div>
          <div className="text-xl font-bold text-slate-800 mt-0.5">{stats?.resolvedTickets ?? 0}</div>
        </div>

        {/* Total Authors */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center mb-3">
            <Users size={16} />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Authors</div>
          <div className="text-xl font-bold text-slate-800 mt-0.5">{stats?.totalAuthors ?? 0}</div>
        </div>

        {/* Total Books */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-lg bg-emerald-50/50 text-emerald-800 flex items-center justify-center mb-3">
            <BookOpen size={16} />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Books</div>
          <div className="text-xl font-bold text-slate-800 mt-0.5">{stats?.totalBooks ?? 0}</div>
        </div>

      </div>

      {/* Categorized Split Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Categories breakdown Card */}
        <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tickets by Category</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[290px] overflow-y-auto">
            {!(categoryStats || []).length ? (
              <div className="p-6 text-center text-xs text-slate-400 font-medium">No categorical data records loaded.</div>
            ) : (
              (categoryStats || []).map((cat) => (
                <div key={cat._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/40 transition-colors">
                  <span className="text-xs font-semibold text-slate-700">{cat._id}</span>
                  <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Priorities breakdown Card */}
        <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Tickets by Priority</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {['Critical', 'High', 'Medium', 'Low'].map((priority) => {
              const stat = (priorityStats || []).find(p => p._id === priority);
              const count = stat?.count || 0;
              return (
                <div key={priority} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/40 transition-colors">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wide border ${
                    priority === 'Critical' ? 'bg-red-50 border-red-200/60 text-red-700' :
                    priority === 'High' ? 'bg-orange-50 border-orange-200/60 text-orange-700' :
                    priority === 'Medium' ? 'bg-amber-50 border-amber-200/60 text-amber-700' :
                    'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    {priority}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Open Tickets Data Grid Layer */}
      <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">Recent Open Tickets</h2>
          <Link to="/admin/tickets" className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 transition-colors">
            View entire queue <ArrowUpRight size={14} />
          </Link>
        </div>

        {!recentTickets?.length ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-2.5">
              <CheckCircle size={18} />
            </div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">All Caught Up!</h4>
            <p className="text-xs text-slate-400 mt-1">There are no outstanding open support operations tickets</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Ticket ID</th>
                  <th className="px-5 py-3">Author</th>
                  <th className="px-5 py-3">Subject Descriptor</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created Timestamp</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentTickets.map(ticket => (
                  <tr key={ticket._id} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">
                      #{ticket.ticketNumber}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">
                      {ticket.author?.name || 'Unknown Author'}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900 max-w-xs truncate">
                      {truncate(ticket.subject, 55)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide ${
                        ticket.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold capitalize ${
                        ticket.status === 'open' ? 'text-amber-600' :
                        ticket.status === 'in_progress' ? 'text-blue-600' :
                        'text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ticket.status === 'open' ? 'bg-amber-500' :
                          ticket.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-slate-400'
                        }`} />
                        {ticket.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-medium">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link 
                        to={`/admin/tickets/${ticket._id}`} 
                        className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 group-hover:border-emerald-800 bg-white group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-900 font-semibold text-[11px] rounded-lg transition-all"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;