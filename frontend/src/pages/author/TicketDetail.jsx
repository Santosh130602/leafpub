import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatDateTime, getPriorityClass, getStatusClass, getErrorMessage, getInitials } from '../../utils/helpers';
import { ArrowLeft, Send, RefreshCw, AlertCircle, HelpCircle, Layers, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const threadEndRef = useRef(null);

  const fetchTicket = useCallback(async () => {
    try {
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data.data.ticket);
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // Scroll to bottom of thread
  useEffect(() => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.responses]);

  // Real-time updates via WebSocket
  useEffect(() => {
    const handler = (event) => {
      if (event.detail?.ticket?._id === id) {
        fetchTicket();
      }
    };
    window.addEventListener('ticket-updated', handler);
    return () => window.removeEventListener('ticket-updated', handler);
  }, [id, fetchTicket]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      await api.post(`/tickets/${id}/respond`, { message: reply });
      setReply('');
      await fetchTicket();
      toast.success('Reply sent!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-emerald-800/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="text-sm font-medium text-slate-500 tracking-wide animate-pulse">Loading message stream...</span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Ticket Not Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">The support query node you are requesting cannot be fetched.</p>
        <Link to="/author/tickets" className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
          Back to Tickets
        </Link>
      </div>
    );
  }

  const canReply = !['Resolved', 'Closed'].includes(ticket.status);

  return (
    <>
      {/* Injecting Playfair Display Typography styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght=0,400..900;1,400..900&display=swap');
        .serif-title {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <div className="space-y-6 pb-12 font-sans antialiased text-slate-900">
        
        {/* Top Control Header Action Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div className="flex items-start gap-3.5">
            <Link 
              to="/author/tickets" 
              className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl shadow-sm hover:shadow transition-all shrink-0 mt-1"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-400">#{ticket.ticketNumber}</span>
                
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider border ${
                  ticket.status === 'open' ? 'bg-amber-50 border-amber-200/60 text-amber-700' :
                  ticket.status === 'in_progress' ? 'bg-blue-50 border-blue-200/60 text-blue-700' :
                  ticket.status === 'resolved' ? 'bg-emerald-50 border-emerald-200/60 text-emerald-700' :
                  'bg-slate-50 border-slate-200 text-slate-600'
                }`}>{ticket.status?.replace('_', ' ')}</span>
                
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider border ${
                  ticket.priority === 'Critical' ? 'bg-red-50 border-red-200/60 text-red-700' :
                  ticket.priority === 'High' ? 'bg-orange-50 border-orange-200/60 text-orange-700' :
                  ticket.priority === 'Medium' ? 'bg-amber-50 border-amber-200/60 text-amber-700' :
                  'bg-slate-50 border-slate-200 text-slate-600'
                }`}>{ticket.priority}</span>
              </div>
              <h1 className="serif-title text-xl sm:text-2xl font-bold tracking-wide text-slate-900">{ticket.subject}</h1>
            </div>
          </div>

          <button 
            onClick={fetchTicket} 
            className="self-start sm:self-auto p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-700 rounded-xl shadow-sm hover:shadow transition-all"
            title="Refresh Feed Sync"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Multi-Column Layout Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Core Component: Dialogue Message Thread Stream (Takes up 2 Units) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversation History</h2>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                {ticket.responses?.length || 0} message{ticket.responses?.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="p-5 space-y-5 max-h-[550px] overflow-y-auto bg-slate-50/30">
              
              {/* Root Genesis Author Inquiry Bubble */}
              <div className="flex flex-col space-y-1.5 max-w-[85%] mr-auto">
                <div className="text-[11px] font-medium text-slate-400 px-1">
                  <span className="font-bold text-slate-700">You</span> · {formatDateTime(ticket.createdAt)} · <span className="italic">Original query</span>
                </div>
                <div className="bg-emerald-50/60 text-emerald-950 border border-emerald-100/70 p-4 text-xs leading-relaxed rounded-2xl rounded-tl-sm shadow-sm whitespace-pre-wrap">
                  {ticket.description}
                </div>
              </div>

              {/* Mapped Responses Loops */}
              {ticket.responses?.map((response) => {
                const isAuthor = response.responderRole === 'author';
                return (
                  <div
                    key={response._id}
                    className={`flex flex-col space-y-1.5 max-w-[85%] ${
                      isAuthor ? 'mr-auto items-start' : 'ml-auto items-end'
                    }`}
                  >
                    <div className="text-[11px] font-medium text-slate-400 px-1">
                      <span className={`font-bold ${isAuthor ? 'text-slate-700' : 'text-emerald-800'}`}>
                        {isAuthor ? 'You' : 'BookLeaf Support'}
                      </span>
                      <span> · {formatDateTime(response.createdAt)}</span>
                    </div>
                    
                    <div className={`p-4 text-xs leading-relaxed rounded-2xl shadow-sm whitespace-pre-wrap w-full ${
                      isAuthor 
                        ? 'bg-emerald-50/60 border border-emerald-100/70 text-emerald-950 rounded-tl-sm' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tr-sm'
                    }`}>
                      {response.message}
                    </div>
                  </div>
                );
              })}
              <div ref={threadEndRef} />
            </div>

            {/* Input Reply Box Console Area conditional trigger */}
            <div className="p-5 border-t border-slate-100 bg-white">
              {canReply ? (
                <form onSubmit={handleSendReply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Add a public reply to support
                    </label>
                    <textarea
                      className="w-full p-3.5 border border-slate-200 focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all"
                      placeholder="Type your follow-up message detail here..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={sending || !reply.trim()}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-xl flex items-start gap-2.5 leading-relaxed">
                  <HelpCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    This ticket has transitioned into a <span className="font-bold uppercase tracking-wider">{ticket.status}</span> state node. If your publishing issue remains outstanding, please submit a brand new operations query.
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Right Side Column Panel: Meta Details Card Modules (Takes up 1 Unit) */}
          <div className="space-y-6">
            
            {/* Core Ticket Parameters Metadata Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Metadata</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { 
                    label: 'Workflow Status', 
                    value: (
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-block ${
                        ticket.status === 'open' ? 'bg-amber-50 border-amber-200/60 text-amber-700' :
                        ticket.status === 'in_progress' ? 'bg-blue-50 border-blue-200/60 text-blue-700' :
                        ticket.status === 'resolved' ? 'bg-emerald-50 border-emerald-200/60 text-emerald-700' :
                        'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>{ticket.status?.replace('_', ' ')}</span>
                    ) 
                  },
                  { 
                    label: 'Urgency Index', 
                    value: (
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-block ${
                        ticket.priority === 'Critical' ? 'bg-red-50 border-red-200/60 text-red-700' :
                        ticket.priority === 'High' ? 'bg-orange-50 border-orange-200/60 text-orange-700' :
                        ticket.priority === 'Medium' ? 'bg-amber-50 border-amber-200/60 text-amber-700' :
                        'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>{ticket.priority}</span>
                    ) 
                  },
                  { 
                    label: 'Routing Category', 
                    value: <span className="text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded-md">{ticket.category}</span> 
                  },
                  { 
                    label: 'Linked Manuscript', 
                    value: (
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                        <Layers size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{ticket.book?.title || 'General / Account Level'}</span>
                      </div>
                    ) 
                  },
                  { 
                    label: 'Ingress Created', 
                    value: (
                      <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>{formatDateTime(ticket.createdAt)}</span>
                      </div>
                    ) 
                  },
                  { 
                    label: 'Last Response Mutation', 
                    value: (
                      <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span>{formatDateTime(ticket.updatedAt)}</span>
                      </div>
                    ) 
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {label}
                    </div>
                    <div>{value}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default TicketDetail;