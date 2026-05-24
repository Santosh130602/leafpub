import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getInitials, getErrorMessage } from '../../utils/helpers';
import { Search, Users, ChevronLeft, ChevronRight, Mail, Phone, BookOpen, Ticket, ExternalLink } from 'lucide-react';

const AuthorsList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
  // Persistent reference for debouncer optimization
  const searchTimeoutRef = useRef(null);

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.append('search', search);
      const res = await api.get(`/admin/authors?${params}`);
      setAuthors(res.data.data.authors);
      setPagination({ total: res.data.total, pages: res.data.pages });
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchAuthors(); }, [fetchAuthors]);

  const handleSearch = (e) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    const val = e.target.value;
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  // Clean up component timeout refs when unmounting
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-slate-900">
      
      {/* Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Authors Registry
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-400 tracking-wide">
            View analytics, core credentials, and operational tickets across the distribution network
          </p>
        </div>
      </div>

      {/* Main Core Registry Container Module */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm shadow-slate-100/50 overflow-hidden">
        
        {/* Context Filtering Header Bar */}
        <div className="p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={15} />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5 transition-all"
              placeholder="Search creators by explicit name or email credentials..."
              onChange={handleSearch}
            />
          </div>
          
          {pagination.total !== undefined && (
            <div className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 tracking-wider uppercase self-start sm:self-auto flex items-center gap-2">
              <Users size={13} className="text-slate-400" />
              <span>Total Indexed: <span className="text-slate-900 font-mono font-bold">{pagination.total}</span></span>
            </div>
          )}
        </div>

        {/* Async Rendering Pipelines */}
        {loading ? (
          <div className="min-h-[45vh] flex flex-col items-center justify-center gap-4 bg-slate-50/20">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 border-4 border-emerald-800/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
            </div>
            <span className="text-xs font-semibold text-slate-400 tracking-wide animate-pulse">Syncing platform ledgers...</span>
          </div>
        ) : authors.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3.5 border border-slate-100 shadow-sm">
              <Users size={20} />
            </div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">No Profiles Found</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">No active registered publisher tokens fit your current criteria match parameter.</p>
          </div>
        ) : (
          <>
            {/* Structured Table Layout with Advanced Contrasting Rows */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Author Profile</th>
                    <th className="px-6 py-4">Email Channel</th>
                    <th className="px-6 py-4">Contact Gateway</th>
                    <th className="px-6 py-4 text-center">Books Bound</th>
                    <th className="px-6 py-4 text-center">Total Queries</th>
                    <th className="px-6 py-4 text-center">Awaiting Action</th>
                    <th className="px-6 py-4 text-right">Operations Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 text-xs">
                  {authors.map((author, index) => (
                    <tr 
                      key={author._id} 
                      className={`transition-all group/row hover:bg-emerald-50/20 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      
                      {/* Name Profile Box */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 font-bold text-[11px] rounded-xl flex items-center justify-center shrink-0 uppercase tracking-wider bg-[#11281c] text-emerald-300 border border-emerald-950 shadow-inner group-hover/row:scale-105 transition-transform">
                            {getInitials(author.name)}
                          </div>
                          <span className="font-bold text-slate-800 tracking-tight text-sm group-hover/row:text-emerald-900 transition-colors">
                            {author.name}
                          </span>
                        </div>
                      </td>

                      {/* Email Identity Row */}
                      <td className="px-6 py-4.5 text-slate-500 font-medium font-mono text-[11px]">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-slate-300 shrink-0" />
                          <span>{author.email}</span>
                        </div>
                      </td>

                      {/* Phone Metadata Cell */}
                      <td className="px-6 py-4.5 text-slate-400 font-medium">
                        {author.phone ? (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone size={13} className="text-slate-300 shrink-0" />
                            <span>{author.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 font-light tracking-widest">—</span>
                        )}
                      </td>

                      {/* Books Metrics Badge Count */}
                      <td className="px-6 py-4.5 text-center">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">
                          <BookOpen size={11} className="opacity-60 text-emerald-700" />
                          {author.bookCount}
                        </span>
                      </td>

                      {/* Total Tickets Metrics Counter */}
                      <td className="px-6 py-4.5 text-center font-mono font-bold text-slate-500">
                        {author.ticketCount}
                      </td>

                      {/* Open Active Alert Red Indicators */}
                      <td className="px-6 py-4.5 text-center">
                        {author.openTickets > 0 ? (
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-1 rounded-full shadow-sm animate-pulse">
                            <Ticket size={11} className="opacity-70 text-red-600" />
                            {author.openTickets}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-medium font-mono">—</span>
                        )}
                      </td>

                      {/* Explicit Interactive Action Route Trigger */}
                      <td className="px-6 py-4.5 text-right">
                        <Link
                          to={`/admin/tickets?search=${author.name}`}
                          className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 border border-slate-200 group-hover/row:border-emerald-800 bg-white text-slate-700 group-hover/row:text-emerald-900 font-bold text-[11px] rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap"
                        >
                          <span>View Tickets</span>
                          <ExternalLink size={11} className="opacity-40 group-hover/row:opacity-100 transition-opacity" />
                        </Link>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Layer */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  Displaying page <span className="font-bold text-slate-700">{page}</span> of <span className="font-bold text-slate-700">{pagination.pages}</span> data blocks
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
  );
};

export default AuthorsList;