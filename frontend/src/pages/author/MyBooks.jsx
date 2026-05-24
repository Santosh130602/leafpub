import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatCurrency, formatNumber, formatDate, getBookStatusColor, getErrorMessage } from '../../utils/helpers';
import { BookOpen, TrendingUp, IndianRupee, ChevronDown, ChevronUp, Layers, Calendar, Tag, ShieldAlert } from 'lucide-react';

const PLATFORM_LABELS = {
  amazonIndia: 'Amazon India',
  flipkart: 'Flipkart',
  amazonUS: 'Amazon US',
  amazonUK: 'Amazon UK',
  bookleafStore: 'BookLeaf Store'
};

const BookCard = ({ book }) => {
  const [expanded, setExpanded] = useState(false);

  const totalSold = book.totalCopiesSold ?? (
    (book.sales?.amazonIndia || 0) +
    (book.sales?.flipkart || 0) +
    (book.sales?.amazonUS || 0) +
    (book.sales?.amazonUK || 0) +
    (book.sales?.bookleafStore || 0)
  );
  const royaltyPending = (book.royalty?.totalEarned || 0) - (book.royalty?.totalPaid || 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mb-5">
      <div className="p-5 sm:p-6">
        
        {/* Title and Top Parameters Header block */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">{book.title}</h3>
              
              {/* Status Indicator Badges */}
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider border ${
                book.status === 'Published & Live' 
                  ? 'bg-emerald-50 border-emerald-200/60 text-emerald-800' 
                  : 'bg-amber-50 border-amber-200/60 text-amber-800'
              }`}>
                {book.status}
              </span>
              <span className="text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                {book.genre}
              </span>
            </div>
            
            {/* Meta Properties Badges Grid line */}
            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1.5">
                <Layers size={13} className="text-slate-300" />
                <span><strong className="text-slate-500 font-semibold">ISBN:</strong> {book.isbn || '—'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-300" />
                <span><strong className="text-slate-500 font-semibold">Published:</strong> {formatDate(book.publicationDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IndianRupee size={12} className="text-slate-300" />
                <span><strong className="text-slate-500 font-semibold">MRP:</strong> {formatCurrency(book.mrp)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag size={13} className="text-slate-300" />
                <span><strong className="text-slate-500 font-semibold">Package:</strong> {book.publishingPackage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics Value Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-5 p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
          
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Copies Sold</div>
            <div className="text-lg font-extrabold text-slate-800 tracking-tight">{formatNumber(totalSold)}</div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Earned</div>
            <div className="text-lg font-extrabold text-slate-800 tracking-tight">{formatCurrency(book.royalty?.totalEarned)}</div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Royalty Paid</div>
            <div className="text-lg font-extrabold text-emerald-700 tracking-tight">{formatCurrency(book.royalty?.totalPaid)}</div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Payout</div>
            <div className={`text-lg font-extrabold tracking-tight ${royaltyPending > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {formatCurrency(royaltyPending)}
            </div>
          </div>

          {book.royalty?.nextPayoutDate && (
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Next Payout</div>
              <div className="text-xs font-bold text-slate-700 tracking-wide mt-0.5 bg-white border border-slate-200/60 rounded px-2 py-0.5 w-fit shadow-sm">
                {formatDate(book.royalty.nextPayoutDate)}
              </div>
            </div>
          )}

        </div>

        {/* Platform breakdown expandable section block toggle */}
        {book.status === 'Published & Live' && totalSold > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded(p => !p)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <span>{expanded ? 'Hide' : 'Show'} platform breakdown</span>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expanded && (
              <div className="mt-4 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-inner max-w-md animate-fade-in">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-4 py-2.5">Distribution Platform</th>
                      <th className="px-4 py-2.5 text-right">Copies Distributed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
                      <tr key={key} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-4 py-3 text-slate-600 font-medium">{label}</td>
                        <td className="px-4 py-3 text-right text-slate-900 font-mono font-bold">
                          {formatNumber(book.sales?.[key] || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* In production processing notification notice block */}
        {book.status !== 'Published & Live' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 text-blue-800 text-xs rounded-xl flex items-start gap-2.5 leading-relaxed">
            <TrendingUp size={15} className="text-blue-500 shrink-0 mt-0.5" />
            <span>
              Your book is currently in the <span className="font-bold">{book.status}</span> workspace tier. Channel distribution records and payout calculations sync here automatically once your manuscript transitions live.
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        setBooks(res.data.data.books);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-emerald-800/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="text-sm font-medium text-slate-500 tracking-wide animate-pulse">Syncing catalog registry...</span>
      </div>
    );
  }

  return (
    <>
      {/* Injecting Playfair Display Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght=0,400..900;1,400..900&display=swap');
        .serif-title {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <div className="space-y-6 pb-12 font-sans antialiased text-slate-900">
        
        {/* Page Header Layout Block */}
        <div className="border-b border-slate-200/60 pb-5">
          <h1 className="serif-title text-3xl font-bold tracking-wide text-slate-900 mb-1">My Books</h1>
          <p className="text-xs md:text-sm font-medium text-slate-400 tracking-wide">
            Your comprehensive publishing catalog mapped with retail logs and accumulated royalty values
          </p>
        </div>

        {/* Action Error Alerts Wrapper */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <ShieldAlert size={15} className="text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty States / Main Content Rendering Nodes */}
        {books.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center max-w-sm mx-auto shadow-sm shadow-slate-100/50">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3.5 border border-slate-100 shadow-sm">
              <BookOpen size={20} />
            </div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">No Books Found</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Your catalog nodes appear clear. Active books display instantly here the moment production triggers.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4 bg-slate-100 border border-slate-200/40 px-3 py-1.5 rounded-lg w-fit shadow-sm">
              Current Inventory: <span className="text-slate-800 font-mono">{books.length}</span> trackable node{books.length !== 1 ? 's' : ''}
            </p>
            
            <div className="space-y-4">
              {books.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyBooks;