import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, Building2, User, ArrowLeft, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface AuthProps {
  onLogin: () => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('srijan.singh@techmsme.com');
  const [password, setPassword] = useState('password123');

  // Register State
  const [regData, setRegData] = useState({
    businessName: '',
    entityType: 'Private Limited',
    industry: 'Technology',
    fullName: '',
    email: '',
    password: '',
    udyamNumber: ''
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      toast.success('Welcome back, Srijan Singh!');
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLogin(true);
      toast.success('Registration successful! Please login with your credentials.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans py-12">
      <motion.div 
        layout
        className="max-w-xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-4 flex flex-col items-center">
            <motion.div 
              layoutId="logo"
              className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100"
            >
              <ShieldCheck size={32} />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-900">CompliAssist AI</h1>
            <p className="text-slate-500 mt-2 text-center">
              {isLogin ? 'Compliance & Financial Assistance for Tech MSMEs' : 'Join 5,000+ MSMEs managing compliance smarter'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8"
              >
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Business Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                        placeholder="srijan.singh@techmsme.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-700">Password</label>
                      <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="remember" className="text-sm text-slate-600">Remember for 30 days</label>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:bg-blue-400 disabled:shadow-none"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>Sign In <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                  <p className="text-sm text-slate-500">
                    Don't have an account? <button onClick={() => setIsLogin(false)} className="font-bold text-blue-600 hover:underline">Register your MSME</button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text"
                          required
                          value={regData.fullName}
                          onChange={(e) => setRegData({...regData, fullName: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                          placeholder="e.g. Srijan Singh"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Business Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text"
                          required
                          value={regData.businessName}
                          onChange={(e) => setRegData({...regData, businessName: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                          placeholder="Company Ltd."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Entity Type</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm appearance-none"
                          value={regData.entityType}
                          onChange={(e) => setRegData({...regData, entityType: e.target.value})}
                        >
                          <option>Proprietorship</option>
                          <option>Partnership</option>
                          <option>Private Limited</option>
                          <option>LLP</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Industry</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                        value={regData.industry}
                        onChange={(e) => setRegData({...regData, industry: e.target.value})}
                      >
                        <option>Technology</option>
                        <option>Manufacturing</option>
                        <option>Services</option>
                        <option>Healthcare</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Udyam No. (Optional)</label>
                      <input 
                        type="text"
                        value={regData.udyamNumber}
                        onChange={(e) => setRegData({...regData, udyamNumber: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                        placeholder="UDYAM-XX-00-0000000"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Business Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="email"
                          required
                          value={regData.email}
                          onChange={(e) => setRegData({...regData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Create Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type={showPassword ? "text" : "password"}
                          required
                          value={regData.password}
                          onChange={(e) => setRegData({...regData, password: e.target.value})}
                          className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                          placeholder="Min. 8 characters"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mt-2">
                    <input type="checkbox" required id="terms" className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="terms" className="text-xs text-slate-500 leading-normal">
                      I agree to the <button type="button" className="text-blue-600 hover:underline">Terms of Service</button> and <button type="button" className="text-blue-600 hover:underline">Privacy Policy</button>.
                    </label>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:bg-blue-400 disabled:shadow-none mt-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>Create Account <ArrowRight size={18} /></>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mt-2"
                  >
                    <ArrowLeft size={16} /> Back to Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest">
          The Gold Standard for MSME Compliance
        </p>
      </motion.div>
    </div>
  );
}
