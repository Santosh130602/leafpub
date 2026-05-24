import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatCurrency, formatNumber, formatDate, getPriorityClass, getStatusClass, getErrorMessage } from '../../utils/helpers';
import { BookOpen, IndianRupee, TrendingUp, Ticket, PlusCircle, ArrowRight, Layers, Mail } from 'lucide-react';

const AuthorDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, ticketsRes] = await Promise.all([
          api.get('/books/summary'),
          api.get('/tickets?limit=5')
        ]);
        setSummary(summaryRes.data.data.summary);
        setTickets(ticketsRes.data.data.tickets);
      } catch (err) {
        console.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-emerald-800/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-sm font-medium text-slate-500 tracking-wide animate-pulse">
          Loading your workspace...
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Injecting Playfair Display Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght=0,400..900;1,400..900&display=swap');
        .serif-title {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <div className="space-y-8 pb-12 font-sans antialiased text-slate-900">
        
        {/* Workspace Header Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="serif-title text-3xl font-bold tracking-wide text-slate-900 mb-1.5">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-400 tracking-wide">
              Here's a live overview of your active publishing and royalty distribution metrics
            </p>
          </div>
          <Link 
            to="/author/tickets/new" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-[0.99]"
          >
            <PlusCircle size={15} />
            <span>Submit a Query</span>
          </Link>
        </div>

        {/* Analytics Statistics Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Published Books */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
              <BookOpen size={18} />
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Published Books</div>
            <div className="text-2xl font-extrabold text-slate-800 mt-0.5">{summary?.publishedBooks ?? 0}</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 inline-block">
              of {summary?.totalBooks ?? 0} total submission nodes
            </span>
          </div>

          {/* Total Copies Sold */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
              <TrendingUp size={18} />
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Copies Sold</div>
            <div className="text-2xl font-extrabold text-slate-800 mt-0.5">{formatNumber(summary?.totalCopiesSold)}</div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 mt-1.5 inline-block">
              Live Network Metrics
            </span>
          </div>

          {/* Total Royalty Earned */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
              <IndianRupee size={16} />
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Royalty Earned</div>
            <div className="text-2xl font-extrabold text-slate-800 mt-0.5">{formatCurrency(summary?.totalRoyaltyEarned)}</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 inline-block">Aggregate Net Earnings</span>
          </div>

          {/* Royalty Pending */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
              <IndianRupee size={16} />
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Royalty Pending</div>
            <div className="text-2xl font-extrabold text-rose-700 mt-0.5">{formatCurrency(summary?.totalRoyaltyPending)}</div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 mt-1.5 inline-block">
              Awaiting Payout
            </span>
          </div>

        </div>

        {/* Recent Tickets Workspace Component Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Support Logs</h2>
            <Link 
              to="/author/tickets" 
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 transition-colors"
            >
              <span>View entire history</span> 
              <ArrowRight size={14} />
            </Link>
          </div>

          {tickets.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3.5 border border-slate-100 shadow-sm">
                <Ticket size={20} />
              </div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">No Tickets Active</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Have an inquiry concerning metadata validation, printing errors or royalty issues? Reach out to support.
              </p>
              <Link 
                to="/author/tickets/new" 
                className="mt-4 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-colors hover:bg-emerald-100/70"
              >
                Submit Your First Query
              </Link>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Inquiry Token</th>
                    <th className="px-6 py-4">Subject Context</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Urgency</th>
                    <th className="px-6 py-4">Created Inbound</th>
                    <th className="px-6 py-4 text-right">Records Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {tickets.map((ticket, index) => (
                    <tr 
                      key={ticket._id} 
                      className={`transition-colors group/row ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      } hover:bg-emerald-50/10`}
                    >
                      {/* Ticket Number */}
                      <td className="px-6 py-4.5 font-mono text-[11px] text-slate-400 font-bold">
                        #{ticket.ticketNumber}
                      </td>

                      {/* Subject Metadata */}
                      <td className="px-6 py-4.5 max-w-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 group-hover/row:text-emerald-900 transition-colors truncate">
                            {ticket.subject}
                          </span>
                          {ticket.book && (
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1 bg-slate-100 border border-slate-200/30 w-fit px-1.5 py-0.5 rounded">
                              <Layers size={9} className="opacity-60" />
                              Title Context: {truncate(ticket.book.title, 35)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4.5 text-center">
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

                      {/* Priority Urgency level badge */}
                      <td className="px-6 py-4.5 text-center">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide border ${
                          ticket.priority === 'Critical' ? 'bg-red-50 border-red-100 text-red-800' :
                          ticket.priority === 'High' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                          ticket.priority === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                          'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>

                      {/* Created Timestamp */}
                      <td className="px-6 py-4.5 text-slate-400 font-medium font-mono text-[10px]">
                        {formatDate(ticket.createdAt)}
                      </td>

                      {/* Core routing access inspect anchor link */}
                      <td className="px-6 py-4.5 text-right">
                        <Link 
                          to={`/author/tickets/${ticket._id}`} 
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 group-hover/row:border-emerald-800 bg-white group-hover/row:bg-emerald-50 text-slate-700 group-hover/row:text-emerald-900 font-bold text-[11px] rounded-lg transition-all"
                        >
                          View Link
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
    </>
  );
};

export default AuthorDashboard;