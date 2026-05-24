import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'author'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      // Auto login after register
      const user = await login(form.email, form.password);
      toast.success(`Welcome to BookLeaf, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/author');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Injecting Playfair Display & a subtle geometric cross pattern directly into the layout */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght=0,400..900;1,400..900&display=swap');
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

          {/* Left Panel Center Content */}
          <div className="my-auto pl-2 max-w-xl">
            <h2 className="serif-title text-5xl text-white leading-tight mb-4">
              Begin your author journey with us.
            </h2>
            <p className="text-emerald-100/60 text-sm tracking-wide leading-relaxed">
              Join thousands of authors publishing and tracking their real-time earnings, 
              distribution stats, and manuscript production transparently across India and the US.
            </p>
          </div>

          {/* Footer branding element */}
          <div className="text-[11px] text-emerald-500/50 uppercase tracking-widest font-medium pl-2">
            Author Console v2.4
          </div>
        </div>

        {/* Right panel: Form Core (Takes full width on mobile, centers perfectly) */}
        <div className="w-full lg:w-[42%] flex items-center justify-center p-4 sm:p-8 md:p-12">
          <div className="w-full max-w-[440px] bg-white  shadow-2xl shadow-black/20 p-8 sm:p-10 border border-slate-100 my-auto">
            
            <div className="mb-6">
              <h2 className="serif-title text-3xl font-semibold text-slate-900 mb-1.5">Create account</h2>
              <p className="text-xs text-slate-400 tracking-wide font-medium">Start your publishing journey with BookLeaf</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wide">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/10' 
                      : 'border-slate-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800'
                  }`}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wide">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/10' 
                      : 'border-slate-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800'
                  }`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wide">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm bg-white focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 transition-all cursor-pointer"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="author">Author</option>
                  <option value="admin">Admin (BookLeaf Team)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wide">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`w-full pl-3.5 pr-10 py-2.5 border rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/10' 
                        : 'border-slate-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800'
                    }`}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wide">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/10' 
                      : 'border-slate-300 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800'
                  }`}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#1b3d2b] hover:bg-[#132c1f] text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-3"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center mt-5 text-xs text-slate-400 font-medium tracking-wide">
              Already have an account?{' '}
              <Link to="/login" className="text-slate-900 font-semibold underline underline-offset-2 hover:text-emerald-800 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default RegisterPage;