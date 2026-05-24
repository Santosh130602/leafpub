import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import { Eye, EyeOff, Leaf, BookOpen, MessageSquare, TrendingUp, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/author');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setForm({ email, password });
  };

  return (
    <>
      {/* Injecting Playfair Display & a subtle geometric cross pattern directly into the layout */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .serif-title {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .pattern-bg {
          background-color: #11281c;
          background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="min-h-screen pattern-bg flex font-sans antialiased">
        
        {/* Left panel: Hidden on mobile/tablet, displays on large screens (Desktop) */}
        <div className="hidden lg:flex lg:w-[58%] p-16 flex-col justify-between text-slate-100">
          
          {/* Brand Header & Logo Grid */}
          <div className="flex items-center gap-6 mt-12">
            {/* <div className="bg-white p-4 rounded shadow-md max-w-[210px] flex flex-col items-center justify-center border border-emerald-900/20">
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-lg">
                <span className="text-red-400 font-light text-2xl mr-0.5">/</span>
                <span className="tracking-tight">BookLeaf</span>
              </div>
              <div className="text-slate-700 text-sm tracking-wider font-light -mt-1">Publishing</div>
              <div className="w-full border-t border-slate-200 my-1.5" />
              <div className="text-[9px] text-slate-400 tracking-widest font-mono">WWW.BOOKLEAFPUB.IN</div>
            </div> */}

               <img src='https://static.wixstatic.com/media/6d2cdc_fbad8eb25d304d57be46e9c494a1a355~mv2.jpg/v1/fill/w_360,h_162,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/book%20background%20white.jpg'  
               className='h-20 w-40'/>

            <h1 className="serif-title text-4xl font-medium tracking-wide text-white">
              BookLeaf Publishing
            </h1>
          </div>

          {/* Feature Elements Content Column */}
          <div className="space-y-7 max-w-xl my-auto pl-2">
            <p className="text-emerald-300/80 text-sm font-medium tracking-wide mb-4">
              Empowering 10,000+ authors across India and the US
            </p>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-emerald-900/60 border border-emerald-800 rounded text-emerald-400 shrink-0 mt-0.5">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm tracking-wide">Your Books, Your Dashboard</h3>
                <p className="text-emerald-100/60 text-xs mt-0.5 leading-relaxed">
                  Track sales, royalties, and production status for all your titles in one place.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-emerald-900/60 border border-emerald-800 rounded text-emerald-400 shrink-0 mt-0.5">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm tracking-wide">AI-Powered Support</h3>
                <p className="text-emerald-100/60 text-xs mt-0.5 leading-relaxed">
                  Get faster, more consistent responses powered by our intelligent support system.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-emerald-900/60 border border-emerald-800 rounded text-emerald-400 shrink-0 mt-0.5">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm tracking-wide">Real-Time Updates</h3>
                <p className="text-emerald-100/60 text-xs mt-0.5 leading-relaxed">
                  See ticket responses and status changes the moment they happen.
                </p>
              </div>
            </div>
          </div>

          {/* Footer branding element */}
          <div className="text-[11px] text-emerald-500/50 uppercase tracking-widest font-medium pl-2">
            Author Console v2.4
          </div>
        </div>

        {/* Right panel: Login Core (Takes full width on mobile, centers perfectly) */}
        <div className="w-full lg:w-[42%] flex items-center justify-center p-4 sm:p-8 md:p-12">
          <div className="w-full max-w-[440px] bg-white  shadow-2xl shadow-black/20 p-8 sm:p-10 border border-slate-100">
            
            <div className="mb-8">
              <h2 className="serif-title text-3xl font-semibold text-slate-900 mb-1.5">Sign in</h2>
              <p className="text-xs text-slate-400 tracking-wide font-medium">Access your BookLeaf author account</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg font-medium flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 transition-all"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 transition-all"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#1b3d2b] hover:bg-[#132c1f] text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-5 text-xs text-slate-400 font-medium tracking-wide">
              Don't have an account?{' '}
              <Link to="/register" className="text-slate-900 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors">
                Create one
              </Link>
            </p>

            {/* Demo Sandbox Profiles Module */}
            <div className="mt-8 pt-5 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Demo Credentials
              </p>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@bookleaf.com', 'admin123')}
                  className="flex items-center gap-3 w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-left text-xs transition-colors group"
                >
                  <span className="bg-amber-100 group-hover:bg-amber-200 text-amber-800 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase shrink-0">
                    Admin
                  </span>
                  <span className="font-mono text-slate-500 group-hover:text-slate-800">admin@bookleaf.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('arjun.malhotra@email.com', 'author123')}
                  className="flex items-center gap-3 w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-left text-xs transition-colors group"
                >
                  <span className="bg-blue-50 group-hover:bg-blue-100 text-blue-700 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase shrink-0">
                    Author
                  </span>
                  <span className="font-mono text-slate-500 group-hover:text-slate-800">arjun.malhotra@email.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('ananya.reddy@email.com', 'author123')}
                  className="flex items-center gap-3 w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-left text-xs transition-colors group"
                >
                  <span className="bg-blue-50 group-hover:bg-blue-100 text-blue-700 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase shrink-0">
                    Author
                  </span>
                  <span className="font-mono text-slate-500 group-hover:text-slate-800">ananya.reddy@email.com</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default LoginPage;