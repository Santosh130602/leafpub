import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/helpers';
import { Paperclip, Send, AlertCircle, FileText, Sparkles, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SubmitTicket = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    book: '',
    subject: '',
    description: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [booksLoading, setBooksLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        setBooks(res.data.data.books);
      } catch (err) {
        console.error('Failed to load books');
      } finally {
        setBooksLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (form.subject.length > 200) errs.subject = 'Subject cannot exceed 200 characters';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.description.trim().length < 20) errs.description = 'Please provide at least 20 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        subject: form.subject,
        description: form.description,
        book: form.book || null
      };
      const res = await api.post('/tickets', payload);
      toast.success('Ticket submitted! Our team will respond shortly.');
      navigate(`/author/tickets/${res.data.data.ticket._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const SUBJECT_TEMPLATES = [
    'Royalty payment not received for Q_ 20__',
    'My book is showing as unavailable on Amazon/Flipkart',
    'Incorrect ISBN showing on my book',
    'Print quality issue with author copies',
    'Book stuck in production stage - no updates',
    'Royalty calculation seems incorrect'
  ];

  return (
    <>
      {/* Injecting Playfair Display Serif Typography styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght=0,400..900;1,400..900&display=swap');
        .serif-title {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <div className="space-y-6 pb-12 font-sans antialiased text-slate-900">
        
        {/* Page Top Header Section */}
        <div className="border-b border-slate-200/60 pb-5">
          <h1 className="serif-title text-3xl font-bold tracking-wide text-slate-900 mb-1.5">
            Submit a Support Query
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-400 tracking-wide">
            Our platform support agents typically analyze and respond within 24–48 hours
          </p>
        </div>

        {/* Form and Sidebar Multi-Column Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Core Form Card (Takes 2 columns wide on large screens) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Related Book Context dropdown Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Related Book Node Context
                  </label>
                  {booksLoading ? (
                    <div className="text-xs font-medium text-slate-400 py-2 animate-pulse">
                      Syncing manuscript registry values...
                    </div>
                  ) : (
                    <select
                      name="book"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5 transition-all cursor-pointer"
                      value={form.book}
                      onChange={handleChange}
                    >
                      <option value="">General / Account Level Query</option>
                      {books.map(book => (
                        <option key={book._id} value={book._id}>
                          {book.title} {book.isbn ? `(${book.isbn})` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-[11px] font-medium text-slate-400 mt-1.5">
                    Select a specific book or leave as General for account-level queries
                  </p>
                </div>

                {/* Subject Header Input field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Subject Title <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">
                      {form.subject.length}/200
                    </span>
                  </div>
                  <input
                    type="text"
                    name="subject"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all ${
                      errors.subject 
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/5 bg-red-50/10' 
                        : 'border-slate-200 focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5'
                    }`}
                    placeholder="Provide a concise description of your platform issue..."
                    value={form.subject}
                    onChange={handleChange}
                    maxLength={200}
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.subject}
                    </p>
                  )}
                </div>

                {/* Description Textarea Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    className={`w-full p-3.5 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all ${
                      errors.description 
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/5 bg-red-50/10' 
                        : 'border-slate-200 focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5'
                    }`}
                    placeholder="Please itemize your query with relevant descriptors. Include any explicit timestamps, target royalty values, or merchant distribution reference numbers..."
                    value={form.description}
                    onChange={handleChange}
                    rows={7}
                  />
                  {errors.description ? (
                    <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.description}
                    </p>
                  ) : (
                    <p className="text-[11px] font-medium text-slate-400 mt-1.5">
                      The more context you render up-front, the more efficiently our team can audit and clear your token ticket.
                    </p>
                  )}
                </div>

                {/* Asset File Attachments Zone Layout Wrapper */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Supporting Documents / Attachments <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  
                  <div
                    onClick={() => document.getElementById('file-input').click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-150 ${
                      attachment 
                        ? 'border-emerald-600 bg-emerald-50/30 text-emerald-900' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
                    }`}
                  >
                    <Paperclip size={20} className={`mx-auto mb-2 ${attachment ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <p className="text-xs font-bold text-slate-700">
                      {attachment ? attachment.name : 'Click to look up or drag files here'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      High-resolution screenshots, receipt images, or operational PDFs (Max size aggregate limit: 10MB)
                    </p>
                    <input
                      id="file-input"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => setAttachment(e.target.files[0])}
                    />
                  </div>
                  
                  {attachment && (
                    <div className="flex items-center justify-between gap-3 p-2.5 mt-2 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in">
                      <div className="flex items-center gap-2 min-w-0 text-xs font-semibold text-slate-700">
                        <FileText size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{attachment.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">({(attachment.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </div>
                      <button
                        type="button"
                        className="text-[11px] font-bold text-red-600 hover:text-red-800 underline underline-offset-2 cursor-pointer shrink-0"
                        onClick={() => setAttachment(null)}
                      >
                        Remove Document
                      </button>
                    </div>
                  )}
                </div>

                {/* Submitting Actions Panel */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/author/tickets')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Submitting Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Submit Ticket</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Right Sidebar Section: Common Layout Blueprints & Tips (1 column wide) */}
          <div className="space-y-5">
            
            {/* Common Issues Injection Template Deck */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Common Subject Presets</h3>
              </div>
              <div className="p-3 space-y-1 max-h-[320px] overflow-y-auto">
                {SUBJECT_TEMPLATES.map((template, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full text-left px-3 py-2 text-[11px] font-semibold text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/40 rounded-xl transition-all border border-transparent hover:border-emerald-100 break-words leading-relaxed cursor-pointer"
                    onClick={() => setForm(prev => ({ ...prev, subject: template }))}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Tips Informational Advisory alert banner */}
            <div className="p-4 bg-emerald-950 border border-emerald-900 text-emerald-100 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider border-b border-emerald-900/60 pb-2">
                <HelpCircle size={14} />
                <span>Tips for Faster Clearance</span>
              </div>
              <ul className="text-[11px] text-emerald-100/70 space-y-2 list-disc pl-4 font-medium leading-relaxed">
                <li>Include explicit statement checkout dates and ledger aggregate values for royalty related metrics.</li>
                <li>Attach clean pixel images/screenshots for distribution catalog printing or quality errors.</li>
                <li>Explicitly mention your system ISBN inside the layout body for catalog search indexing defects.</li>
                <li>Verify your localized financial bank branch details are fully cleared in your author profile.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default SubmitTicket;