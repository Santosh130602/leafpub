import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  formatDateTime, formatCurrency, formatNumber,
  getPriorityClass, getStatusClass, getErrorMessage, getInitials
} from '../../utils/helpers';
import {
  ArrowLeft, RefreshCw, Sparkles, Send, Lock, User, Edit2, Check, X, BookOpen, AlertCircle, HelpCircle, Phone, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Royalty & Payments', 'ISBN & Metadata Issues', 'Printing & Quality',
  'Distribution & Availability', 'Book Status & Production Updates', 'General Inquiry'
];

const AdminTicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [tempStatus, setTempStatus] = useState('');
  const [tempPriority, setTempPriority] = useState('');
  const [tempCategory, setTempCategory] = useState('');
  const threadEndRef = useRef(null);

  const fetchTicket = useCallback(async () => {
    try {
      const res = await api.get(`/admin/tickets/${id}`);
      setTicket(res.data.data.ticket);
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTicket(); }, [fetchTicket]);

  useEffect(() => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.responses]);

  useEffect(() => {
    const handler = (event) => {
      if (event.detail?.ticket?._id === id) fetchTicket();
    };
    window.addEventListener('ticket-updated', handler);
    return () => window.removeEventListener('ticket-updated', handler);
  }, [id, fetchTicket]);

  const handleUseDraft = () => {
    if (ticket?.aiDraftResponse) {
      setReplyText(ticket.aiDraftResponse);
      setIsInternal(false);
    }
  };

  const handleRegenerateDraft = async () => {
    setDraftLoading(true);
    try {
      const res = await api.post(`/admin/tickets/${id}/regenerate-draft`);
      setTicket(prev => ({ ...prev, aiDraftResponse: res.data.data.draft }));
      toast.success('AI draft regenerated!');
    } catch (err) {
      toast.error(getErrorMessage(err) || 'AI service unavailable. Please write the response manually.');
    } finally {
      setDraftLoading(false);
    }
  };

  const handleAssign = async () => {
    try {
      await api.put(`/admin/tickets/${id}`, { assignedTo: 'me' });
      await fetchTicket();
      toast.success('Ticket assigned to you.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUpdateField = async (field, value, override = {}) => {
    try {
      await api.put(`/admin/tickets/${id}`, { [field]: value, ...override });
      await fetchTicket();
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated.`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await api.post(`/admin/tickets/${id}/respond`, {
        message: replyText,
        isInternal
      });
      setReplyText('');
      setIsInternal(false);
      await fetchTicket();
      toast.success(isInternal ? 'Internal note added.' : 'Response sent to author.');
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
          <div className="absolute inset-0 border-4 border-emerald-800/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-sm font-medium text-slate-500 tracking-wide animate-pulse">Loading operations timeline...</span>
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
        <p className="text-xs text-slate-400 mt-1 max-w-xs">The ticket token requested may have expired or been deleted.</p>
        <Link to="/admin/tickets" className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
          Back to Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-slate-900">
      
      {/* Top Controls Action Toolbar Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="flex items-start gap-3.5">
          <Link 
            to="/admin/tickets" 
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
                'bg-slate-50 border-slate-200 text-slate-600'
              }`}>{ticket.status?.replace('_', ' ')}</span>
              
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider border ${
                ticket.priority === 'Critical' ? 'bg-red-50 border-red-200/60 text-red-700' :
                ticket.priority === 'High' ? 'bg-orange-50 border-orange-200/60 text-orange-700' :
                ticket.priority === 'Medium' ? 'bg-amber-50 border-amber-200/60 text-amber-700' :
                'bg-slate-50 border-slate-200 text-slate-600'
              }`}>{ticket.priority}</span>

              {ticket.categoryOverridden && (
                <span className="text-[9px] font-bold tracking-wide text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">Category Overridden</span>
              )}
              {ticket.priorityOverridden && (
                <span className="text-[9px] font-bold tracking-wide text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">Priority Overridden</span>
              )}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{ticket.subject}</h1>
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

      {/* Main Multi-Column Split Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side Section: Core Stream & Thread Replies Container (Takes 2 Units Wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Smart Automated AI Generation Module Panel */}
          {ticket.aiDraftResponse && (
            <div className="bg-gradient-to-br from-emerald-950 to-teal-950 text-white rounded-2xl shadow-lg border border-emerald-900/40 overflow-hidden">
              <div className="px-5 py-4 border-b border-emerald-900/40 bg-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                  <Sparkles size={14} className="animate-pulse" />
                  AI Generated Draft Engine
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-emerald-300 transition-colors disabled:opacity-40"
                    onClick={handleRegenerateDraft}
                    disabled={draftLoading}
                    title="Regenerate Copilot Response"
                  >
                    {draftLoading ? (
                      <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : <RefreshCw size={13} />}
                  </button>
                  <button
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
                    onClick={handleUseDraft}
                  >
                    Use this draft
                  </button>
                </div>
              </div>
              <div className="p-5">
                <p className="text-emerald-100/90 text-xs leading-relaxed font-normal whitespace-pre-wrap">{ticket.aiDraftResponse}</p>
                {ticket.aiError && (
                  <div className="mt-3 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-start gap-2">
                    <span>⚠ AI generated with partial errors: {ticket.aiError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fallback Display if Copilot Cache is currently empty */}
          {!ticket.aiDraftResponse && (
            <div className="bg-white border border-slate-200/60 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <HelpCircle size={15} className="text-slate-400" />
                No autonomous draft responses generated for this node yet.
              </div>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 text-emerald-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                onClick={handleRegenerateDraft}
                disabled={draftLoading}
              >
                {draftLoading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-emerald-800" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Generate AI Draft</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Core Interactive Messaging Stream Conversation Module */}
          <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversation Thread</h2>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-full">
                {ticket.responses?.length || 0} Update{(ticket.responses?.length !== 1) ? 's' : ''}
              </span>
            </div>

            <div className="p-5 space-y-5 max-h-[600px] overflow-y-auto bg-slate-50/30">
              
              {/* Root Genesis Ticket Inquiry Box */}
              <div className="space-y-1.5 max-w-[85%]">
                <div className="text-[11px] font-medium text-slate-400 px-1">
                  <span className="font-semibold text-slate-700">{ticket.author?.name}</span> · {formatDateTime(ticket.createdAt)} · <span className="italic">Original query</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                  {ticket.description}
                </div>
              </div>

              {/* Sequential Node Mapping Loops */}
              {ticket.responses?.map((response) => (
                <div
                  key={response._id}
                  className={`flex flex-col space-y-1.5 max-w-[85%] ${
                    response.isInternal ? 'mx-auto w-full max-w-full' :
                    response.responderRole === 'author' ? 'mr-auto' : 'ml-auto items-end'
                  }`}
                >
                  <div className="text-[11px] font-medium text-slate-400 px-1 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">
                      {response.responder?.name || (response.responderRole === 'author' ? ticket.author?.name : 'Admin Agent')}
                    </span>
                    <span>·</span>
                    <span>{formatDateTime(response.createdAt)}</span>
                    {response.isInternal && (
                      <span className="text-[9px] font-bold bg-amber-100 border border-amber-200/60 text-amber-800 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        INTERNAL ARCHIVE NOTE
                      </span>
                    )}
                  </div>

                  <div className={`p-4 text-xs leading-relaxed rounded-2xl shadow-sm whitespace-pre-wrap w-full ${
                    response.isInternal 
                      ? 'bg-amber-50/60 border border-dashed border-amber-300 text-amber-900 rounded-lg' 
                      : response.responderRole === 'author'
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                        : 'bg-emerald-800 text-white rounded-tr-sm'
                  }`}>
                    {response.message}
                  </div>
                </div>
              ))}
              <div ref={threadEndRef} />
            </div>

            {/* Response Dispatch Control Desk */}
            <form onSubmit={handleSendReply} className="p-5 border-t border-slate-100 bg-white space-y-4">
              
              {/* Type selector toggle tabs */}
              <div className="flex gap-2 border-b border-slate-100 pb-3">
                <button
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    !isInternal 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                  onClick={() => setIsInternal(false)}
                >
                  <Send size={13} />
                  <span>Public Reply to Author</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isInternal 
                      ? 'bg-amber-600 text-white shadow-sm' 
                      : 'text-amber-600 hover:bg-amber-50'
                  }`}
                  onClick={() => setIsInternal(true)}
                >
                  <Lock size={13} />
                  <span>Internal Operational Note</span>
                </button>
              </div>

              <textarea
                className={`w-full p-3.5 border rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-all ${
                  isInternal 
                    ? 'border-amber-300 bg-amber-50/10 focus:border-amber-600 focus:ring-1 focus:ring-amber-600' 
                    : 'border-slate-200 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800'
                }`}
                placeholder={isInternal ? 'Type internal notes here... (Hidden from authors entirely)' : 'Draft response content destined for the client portal ecosystem...'}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
              />

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className={`px-4 py-2.5 font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isInternal ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                  disabled={sending || !replyText.trim()}
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Transmitting...</span>
                    </>
                  ) : isInternal ? (
                    <>
                      <Lock size={13} />
                      <span>Commit Notes</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Dispatch Response</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Section: Field Modifiers & Object Contextual Cards (1 Unit Wide) */}
        <div className="space-y-6">
          
          {/* Operations Core Fields Actions Manager Card */}
          <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Parameters</h3>
            </div>
            <div className="p-4 space-y-4">
              
              {/* Assignment Status Tracker */}
              <div className="pb-3.5 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ownership Operator</div>
                {!ticket.assignedTo ? (
                  <button 
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-emerald-700 text-slate-700 hover:text-emerald-900 font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer" 
                    onClick={handleAssign}
                  >
                    <User size={13} /> 
                    <span>Claim Ticket Assignment</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-medium text-emerald-900">
                    <span className="truncate">✓ Bound: {ticket.assignedTo?.name}</span>
                    {ticket.assignedTo?._id && (
                      <button
                        className="text-[10px] font-bold text-red-600 hover:text-red-800 underline underline-offset-2 cursor-pointer"
                        onClick={() => handleUpdateField('assignedTo', 'unassign')}
                      >
                        Unassign
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Interactive Status Modifiers field block */}
              <div className="pb-3.5 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Workflow State</div>
                {editingStatus ? (
                  <div className="flex items-center gap-1.5">
                    <select
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-800"
                      value={tempStatus}
                      onChange={e => setTempStatus(e.target.value)}
                    >
                      {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      className="p-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
                      onClick={() => { handleUpdateField('status', tempStatus); setEditingStatus(false); }}
                    >
                      <Check size={13} />
                    </button>
                    <button
                      className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                      onClick={() => setEditingStatus(false)}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 group/field">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      ticket.status === 'open' ? 'bg-amber-50 border-amber-200/60 text-amber-700' :
                      ticket.status === 'in_progress' ? 'bg-blue-50 border-blue-200/60 text-blue-700' :
                      'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>{ticket.status?.replace('_', ' ')}</span>
                    <button
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors"
                      onClick={() => { setTempStatus(ticket.status); setEditingStatus(true); }}
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Priority Modifiers field block */}
              <div className="pb-3.5 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Urgency Profile</span>
                  {ticket.priorityOverridden && <span className="text-[9px] font-bold text-amber-600 lowercase tracking-normal">(overridden)</span>}
                </div>
                {editingPriority ? (
                  <div className="flex items-center gap-1.5">
                    <select
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-800"
                      value={tempPriority}
                      onChange={e => setTempPriority(e.target.value)}
                    >
                      {['Critical', 'High', 'Medium', 'Low'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <button
                      className="p-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
                      onClick={() => { handleUpdateField('priority', tempPriority); setEditingPriority(false); }}
                    >
                      <Check size={13} />
                    </button>
                    <button
                      className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                      onClick={() => setEditingPriority(false)}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      ticket.priority === 'Critical' ? 'bg-red-50 border-red-200/60 text-red-700' :
                      ticket.priority === 'High' ? 'bg-orange-50 border-orange-200/60 text-orange-700' :
                      ticket.priority === 'Medium' ? 'bg-amber-50 border-amber-200/60 text-amber-700' :
                      'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>{ticket.priority}</span>
                    <button
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors"
                      onClick={() => { setTempPriority(ticket.priority); setEditingPriority(true); }}
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Category Modifiers field block */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Routing Category</span>
                  {ticket.categoryOverridden && <span className="text-[9px] font-bold text-amber-600 lowercase tracking-normal">(overridden)</span>}
                </div>
                {editingCategory ? (
                  <div className="flex flex-col gap-2">
                    <select
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-emerald-800"
                      value={tempCategory}
                      onChange={e => setTempCategory(e.target.value)}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex gap-1.5 justify-end">
                      <button
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] rounded transition-colors flex items-center gap-1"
                        onClick={() => { handleUpdateField('category', tempCategory); setEditingCategory(false); }}
                      >
                        <Check size={11} /> Save
                      </button>
                      <button
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-[11px] rounded transition-colors"
                        onClick={() => setEditingCategory(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 leading-relaxed break-words max-w-[85%]">
                      {ticket.category}
                    </span>
                    <button
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors shrink-0"
                      onClick={() => { setTempCategory(ticket.category); setEditingCategory(true); }}
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Author Details Snapshot Block */}
          <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Identity</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100">
                <div className="w-10 h-10 font-bold text-xs rounded-xl flex items-center justify-center shrink-0 uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {getInitials(ticket.author?.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">{ticket.author?.name}</div>
                  <div className="text-[11px] font-medium text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <Mail size={11} className="shrink-0" />
                    <span>{ticket.author?.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-3.5 space-y-2 text-xs">
                {ticket.author?.phone && (
                  <div className="text-slate-600 font-medium flex items-center gap-2">
                    <Phone size={12} className="text-slate-400 shrink-0" />
                    <span>{ticket.author.phone}</span>
                  </div>
                )}
                {ticket.author?.bio && (
                  <p className="text-slate-400 text-[11px] leading-relaxed italic bg-slate-50/40 p-2.5 border border-slate-100 rounded-lg">
                    "{ticket.author.bio}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Linked Manuscript Catalog Meta Context Card */}
          {ticket.book && (
            <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1.5 text-slate-700">
                <BookOpen size={14} className="text-slate-400" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bound Title Context</h3>
              </div>
              <div className="p-4 space-y-3.5">
                <div className="text-xs font-bold text-slate-800 tracking-tight leading-tight border-b border-slate-100 pb-2.5">
                  {ticket.book.title}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'System ISBN', value: ticket.book.isbn || 'Unassigned' },
                    { label: 'Genre Classification', value: ticket.book.genre || 'Standard' },
                    { label: 'Market MRP Value', value: formatCurrency(ticket.book.mrp) },
                    { label: 'Distribution Status', value: ticket.book.status },
                    { label: 'Aggregate Earned', value: formatCurrency(ticket.book.royalty?.totalEarned) },
                    { label: 'Outstanding Balance', value: formatCurrency((ticket.book.royalty?.totalEarned || 0) - (ticket.book.royalty?.totalPaid || 0)), highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex items-center justify-between gap-4 text-xs font-medium">
                      <span className="text-slate-400">{label}</span>
                      <span className={`font-semibold tracking-wide ${highlight ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Core Node System Logs Timestamp Meta Card */}
          <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trace Ledger</h3>
            </div>
            <div className="p-4 space-y-3.5">
              {[
                { label: 'Token Key', value: ticket.ticketNumber },
                { label: 'Ingress Created', value: formatDateTime(ticket.createdAt) },
                { label: 'Last Mutated', value: formatDateTime(ticket.updatedAt) },
                { label: 'AI Classified Vector', value: ticket.aiProcessed ? '✓ Verified True' : '✗ Unanalyzed' },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                  <div className="text-xs font-semibold text-slate-700">{value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminTicketDetail;