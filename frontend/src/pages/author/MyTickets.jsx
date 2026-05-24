import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatDate, getPriorityClass, getStatusClass, truncate, getErrorMessage } from '../../utils/helpers';
import { PlusCircle, Ticket, ChevronLeft, ChevronRight, MessageSquare, Layers, Inbox } from 'lucide-react';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (statusFilter) params.append('status', statusFilter);
      const res = await api.get(`/tickets?${params}`);
      setTickets(res.data.data.tickets);
      setPagination({ total: res.data.total, pages: res.data.pages });
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Real-time refresh on ticket updates
  useEffect(() => {
    const handler = () => fetchTickets();
    window.addEventListener('ticket-updated', handler);
    return () => window.removeEventListener('ticket-updated', handler);
  }, [fetchTickets]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  return (
    <>
      {/* Injecting Editorial Playfair Typography */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght=0,400..900;1,400..900&display=swap');
        .serif-title {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <div className="space-y-6 pb-12 font-sans antialiased text-slate-900">
        
        {/* Page Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="serif-title text-3xl font-bold tracking-wide text-slate-900 mb-1">
              My Support Tickets
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-400 tracking-wide">
              Track outstanding queries, look up structural responses, and view ticket resolutions
            </p>
          </div>
          <Link 
            to="/author/tickets/new" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-[0.99]"
          >
            <PlusCircle size={15} />
            <span>New Ticket</span>
          </Link>
        </div>

        {/* Main Table View Wrapper */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm shadow-slate-100/50 overflow-hidden">
          
          {/* Dynamic Filter Layout Section */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:max-w-xs">
              <select 
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5 transition-all cursor-pointer" 
                value={statusFilter} 
                onChange={handleStatusChange}
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            {pagination.total !== undefined && (
              <div className="text-[11px] font-bold text-slate-400 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm tracking-wider uppercase flex items-center gap-1.5">
                <Inbox size={12} />
                <span>Total: <span className="text-slate-800 font-mono font-bold">{pagination.total}</span> logs</span>
              </div>
            )}
          </div>

          {/* Core Conditional Rendering Engine */}
          {loading ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 bg-slate-50/10">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-emerald-800/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              </div>
              <span className="text-xs font-semibold text-slate-400 tracking-wide animate-pulse">Syncing communications queue...</span>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3.5 border border-slate-100 shadow-sm">
                <Ticket size={20} />
              </div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">No Tickets Found</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {statusFilter ? `No active tickets currently match the "${statusFilter}" criteria.` : "You haven't submitted any platform support queries yet."}
              </p>
              {!statusFilter && (
                <Link 
                  to="/author/tickets/new" 
                  className="mt-4 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-colors hover:bg-emerald-100/70"
                >
                  Submit a Query
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Structured Zebra-Contrasting Table Elements */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-5 py-4">Ticket Token</th>
                      <th className="px-5 py-4">Subject</th>
                      <th className="px-5 py-4">Bound Manuscript</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4 text-center">Workflow Status</th>
                      <th className="px-5 py-4 text-center">Urgency</th>
                      <th className="px-5 py-4 text-center">Responses</th>
                      <th className="px-5 py-4">Created Inbound</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/70 text-xs">
                    {tickets.map((ticket, index) => (
                      <tr 
                        key={ticket._id} 
                        className={`transition-colors group/row hover:bg-emerald-50/10 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                        }`}
                      >
                        {/* Token Identifier */}
                        <td className="px-5 py-4.5 font-mono text-[11px] font-bold text-slate-400 group-hover/row:text-slate-600">
                          #{ticket.ticketNumber}
                        </td>

                        {/* Subject Heading Column */}
                        <td className="px-5 py-4.5 font-semibold text-slate-900 max-w-xs truncate">
                          {truncate(ticket.subject, 60)}
                        </td>

                        {/* Bound Book Element */}
                        <td className="px-5 py-4.5 font-medium text-slate-500">
                          {ticket.book?.title ? (
                            <span className="inline-flex items-center gap-1 max-w-[150px] truncate">
                              <Layers size={11} className="text-slate-300 shrink-0" />
                              {ticket.book.title}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-light italic tracking-wide">General</span>
                          )}
                        </td>

                        {/* Category Row */}
                        <td className="px-5 py-4.5">
                          <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md shadow-inner max-w-[130px] inline-block truncate">
                            {ticket.category}
                          </span>
                        </td>

                        {/* Workflow Status Indicators */}
                        <td className="px-5 py-4.5 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold capitalize ${
                            ticket.status === 'open' ? 'text-amber-600' :
                            ticket.status === 'in_progress' ? 'text-blue-600' :
                            ticket.status === 'resolved' ? 'text-emerald-600' :
                            'text-slate-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              ticket.status === 'open' ? 'bg-amber-500 animate-pulse' :
                              ticket.status === 'in_progress' ? 'bg-blue-500' :
                              ticket.status === 'resolved' ? 'bg-emerald-500' :
                              'bg-slate-400'
                            }`} />
                            {ticket.status?.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Priority Level Badging Grid */}
                        <td className="px-5 py-4.5 text-center">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide border ${
                            ticket.priority === 'Critical' ? 'bg-red-50 border-red-100 text-red-800' :
                            ticket.priority === 'High' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                            ticket.priority === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                            'bg-slate-50 border-slate-200 text-slate-600'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>

                        {/* Stream Aggregate Responses Counter */}
                        <td className="px-5 py-4.5 text-center">
                          {ticket.responses?.length > 0 ? (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md shadow-sm">
                              <MessageSquare size={10} className="opacity-60" />
                              {ticket.responses.length}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-medium font-mono">0</span>
                          )}
                        </td>

                        {/* Timestamp Data String */}
                        <td className="px-5 py-4.5 text-slate-400 font-medium font-mono text-[10px] whitespace-nowrap">
                          {formatDate(ticket.createdAt)}
                        </td>

                        {/* Router Inspect link action point */}
                        <td className="px-5 py-4.5 text-right">
                          <Link
                            to={`/author/tickets/${ticket._id}`}
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 group-hover/row:border-emerald-800 bg-white group-hover/row:bg-emerald-50 text-slate-700 group-hover/row:text-emerald-900 font-bold text-[11px] rounded-lg transition-all"
                          >
                            View
                          </Link>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls Footer Strip */}
              {pagination.pages > 1 && (
                <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
                  <span className="text-xs text-slate-400 font-medium tracking-wide">
                    Displaying page <span className="font-bold text-slate-700">{page}</span> of <span className="font-bold text-slate-700">{pagination.pages}</span> dataset blocks
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-40 rounded-xl shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed" 
                      disabled={page === 1} 
                      onClick={() => setPage(p => p - 1)}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button 
                      className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-40 rounded-xl shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed" 
                      disabled={page === pagination.pages} 
                      onClick={() => setPage(p => p + 1)}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </>
  );
};

export default MyTickets;