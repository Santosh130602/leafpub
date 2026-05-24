import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatDate, getPriorityClass, getStatusClass, truncate, getErrorMessage } from '../../utils/helpers';
import { Search, Filter, ChevronLeft, ChevronRight, Inbox, Mail, User, Layers, MessageSquare, Trash2 } from 'lucide-react';

const CATEGORIES = [
  'Royalty & Payments',
  'ISBN & Metadata Issues',
  'Printing & Quality',
  'Distribution & Availability',
  'Book Status & Production Updates',
  'General Inquiry'
];

const TicketQueue = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '', category: '', priority: '', assignedTo: '', search: ''
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Persistent reference for debouncer optimization
  const searchTimeoutRef = useRef(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.search) params.append('search', filters.search);

      const res = await api.get(`/admin/tickets?${params}`);
      setTickets(res.data.data.tickets);
      setPagination({ total: res.data.total, pages: res.data.pages });
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    const handler = () => fetchTickets();
    window.addEventListener('new-ticket', handler);
    window.addEventListener('ticket-updated', handler);
    return () => {
      window.removeEventListener('new-ticket', handler);
      window.removeEventListener('ticket-updated', handler);
    };
  }, [fetchTickets]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    const val = e.target.value;
    searchTimeoutRef.current = setTimeout(() => {
      handleFilter('search', val);
    }, 400);
  };

  const clearFilters = () => {
    setFilters({ status: '', category: '', priority: '', assignedTo: '', search: '' });
    setPage(1);
  };

  // Clean up component timeout refs when unmounting
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      {/* Injecting Playfair Display & Layout Patterns */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght=0,400..900;1,400..900&display=swap');
        .serif-title {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <div className="space-y-6 pb-12 font-sans antialiased text-slate-900">
        
        {/* Page Header Section */}
        <div className="border-b border-slate-200/60 pb-5">
          <h1 className="serif-title text-3xl font-bold tracking-wide text-slate-900 mb-1">
            Ticket Operations Queue
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-400 tracking-wide">
            Process, triage, and response stream engine for incoming author platform request metrics
          </p>
        </div>

        {/* Main Operational Card Interface */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm shadow-slate-100/50 overflow-hidden">
          
          {/* Dynamic Filter Operations Strip */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Search Field Box Container */}
              <div className="relative lg:col-span-1 sm:col-span-2">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5 transition-all"
                  placeholder="Search subject or token ID..."
                  defaultValue={filters.search}
                  onChange={handleSearch}
                />
              </div>

              {/* Status Selector dropdown */}
              <select 
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-emerald-800 cursor-pointer" 
                value={filters.status} 
                onChange={e => handleFilter('status', e.target.value)}
              >
                <option value="">All Status Profiles</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              {/* Priority Selector dropdown */}
              <select 
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-emerald-800 cursor-pointer" 
                value={filters.priority} 
                onChange={e => handleFilter('priority', e.target.value)}
              >
                <option value="">All Urgencies</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Category Selector dropdown */}
              <select
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-emerald-800 cursor-pointer truncate"
                value={filters.category}
                onChange={e => handleFilter('category', e.target.value)}
              >
                <option value="">All Routing Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Ownership Assignment filter */}
              <select 
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-emerald-800 cursor-pointer" 
                value={filters.assignedTo} 
                onChange={e => handleFilter('assignedTo', e.target.value)}
              >
                <option value="">All Owner Nodes</option>
                <option value="me">Assigned to me</option>
                <option value="unassigned">Unassigned</option>
              </select>

            </div>

            {/* Sub Filter Status Counters Row */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-2">
                {hasFilters && (
                  <button 
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 hover:border-red-300 text-slate-500 hover:text-red-700 text-xs font-semibold rounded-lg bg-white shadow-sm transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Clear Workspace Filters</span>
                  </button>
                )}
              </div>

              {pagination.total !== undefined && (
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-sm flex items-center gap-1.5">
                  <Inbox size={12} />
                  <span>Matches: <span className="text-slate-800 font-mono font-bold">{pagination.total}</span> logs</span>
                </div>
              )}
            </div>
          </div>

          {/* Core Data Presentation Switching States */}
          {loading ? (
            <div className="min-h-[45vh] flex flex-col items-center justify-center gap-4 bg-slate-50/10">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-emerald-800/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              </div>
              <span className="text-xs font-semibold text-slate-400 tracking-wide animate-pulse">Syncing operations queue...</span>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3.5 border border-slate-100 shadow-sm">
                <Filter size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">No Tickets Found</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">No tracking issues ledger records matching your configuration matrices parameters.</p>
            </div>
          ) : (
            <>
              {/* Structured Registry Grid Framework */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-5 py-4">Inquiry Token</th>
                      <th className="px-5 py-4">Account Origin</th>
                      <th className="px-5 py-4">Subject Vector</th>
                      <th className="px-5 py-4">Routing Category</th>
                      <th className="px-5 py-4 text-center">Urgency</th>
                      <th className="px-5 py-4 text-center">Workflow Status</th>
                      <th className="px-5 py-4">Ownership</th>
                      <th className="px-5 py-4 text-center">Responses</th>
                      <th className="px-5 py-4">Ingress Inbound</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/70 text-xs">
                    {tickets.map((ticket, index) => {
                      const isCriticalAlert = ticket.priority === 'Critical' && ticket.status !== 'Closed' && ticket.status !== 'Resolved';
                      return (
                        <tr
                          key={ticket._id}
                          className={`transition-all group/row ${
                            isCriticalAlert 
                              ? 'bg-red-50/60 hover:bg-red-100/60 text-red-950 font-medium' 
                              : index % 2 === 0 ? 'bg-white hover:bg-emerald-50/20' : 'bg-slate-50/50 hover:bg-emerald-50/20'
                          }`}
                        >
                          {/* Ticket Number Token */}
                          <td className="px-5 py-4.5 font-mono text-[11px] font-bold text-slate-400 group-hover/row:text-slate-600 transition-colors">
                            #{ticket.ticketNumber}
                          </td>

                          {/* Author Identity Info */}
                          <td className="px-5 py-4.5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 tracking-tight">{ticket.author?.name || 'Unknown Node'}</span>
                              <span className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                                <Mail size={10} className="opacity-60" />
                                {ticket.author?.email}
                              </span>
                            </div>
                          </td>

                          {/* Subject Meta Description */}
                          <td className="px-5 py-4.5 max-w-xs">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900 group-hover/row:text-emerald-950 transition-colors truncate">
                                {truncate(ticket.subject, 50)}
                              </span>
                              {ticket.book && (
                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1 bg-slate-100 border border-slate-200/40 w-fit px-1.5 py-0.5 rounded">
                                  <Layers size={9} className="opacity-60" />
                                  Title: {truncate(ticket.book.title, 24)}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Routing Categorized Block */}
                          <td className="px-5 py-4.5">
                            <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-inner max-w-[130px] inline-block leading-normal break-words">
                              {ticket.category}
                            </span>
                          </td>

                          {/* Urgency Level Class */}
                          <td className="px-5 py-4.5 text-center">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide border ${
                              ticket.priority === 'Critical' ? 'bg-red-100 border-red-200 text-red-800' :
                              ticket.priority === 'High' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                              ticket.priority === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                              'bg-slate-50 border-slate-200 text-slate-600'
                            }`}>
                              {ticket.priority}
                            </span>
                          </td>

                          {/* Status workflow tag */}
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

                          {/* Operator Claim Binding Node */}
                          <td className="px-5 py-4.5 font-medium">
                            {ticket.assignedTo ? (
                              <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                                <User size={11} className="text-slate-400" />
                                {ticket.assignedTo.name}
                              </span>
                            ) : (
                              <span className="text-slate-300 font-light italic">Unassigned</span>
                            )}
                          </td>

                          {/* Response Streams aggregate counters */}
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

                          {/* Timestamp logs entry */}
                          <td className="px-5 py-4.5 text-slate-400 font-medium font-mono text-[10px] whitespace-nowrap">
                            {formatDate(ticket.createdAt)}
                          </td>

                          {/* Inspector Routing Link Button triggers */}
                          <td className="px-5 py-4.5 text-right">
                            <Link 
                              to={`/admin/tickets/${ticket._id}`} 
                              className={`inline-flex items-center justify-center px-3 py-1.5 font-bold text-[11px] rounded-lg shadow-sm border transition-all ${
                                isCriticalAlert 
                                  ? 'bg-red-700 hover:bg-red-800 text-white border-red-800 shadow-red-700/10' 
                                  : 'bg-white group-hover/row:bg-emerald-50 text-slate-700 group-hover/row:text-emerald-900 border-slate-200 group-hover/row:border-emerald-800'
                              }`}
                            >
                              Open
                            </Link>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls Footer Layer */}
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

export default TicketQueue;