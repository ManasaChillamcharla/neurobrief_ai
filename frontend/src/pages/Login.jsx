import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Sparkles, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const { user, token, login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // If already authenticated, bypass login
  if (token && user) {
    return <Navigate to="/dashboard/studio" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegisterMode) {
      const success = await register(formData.username, formData.email, formData.password);
      if (success) navigate('/dashboard/studio');
    } else {
      const success = await login(formData.email, formData.password);
      if (success) navigate('/dashboard/studio');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen dot-grid bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dynamic Background Neon Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[100px] animate-pulse-slow duration-3000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-cyber-border/80">
          
          {/* Logo Brand Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyber-neonPurple to-cyber-neonCyan flex items-center justify-center shadow-lg shadow-purple-500/25 mb-4">
              <Sparkles className="w-6 h-6 text-white animate-spin duration-3000" />
            </div>
            <h2 className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyber-neonCyan bg-clip-text text-transparent">
              NEUROBRIEF AI
            </h2>
            <p className="text-xs text-cyber-textMuted mt-1">
              Smart Context-Aware Content Summarizer
            </p>
          </div>

          {/* Toggle form selector */}
          <div className="flex bg-slate-950/40 p-1.5 rounded-2xl border border-cyber-border mb-8">
            <button
              type="button"
              onClick={() => setIsRegisterMode(false)}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                !isRegisterMode 
                  ? 'bg-gradient-to-r from-purple-900/60 to-slate-900 text-white shadow-md border border-purple-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In Portal
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterMode(true)}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                isRegisterMode 
                  ? 'bg-gradient-to-r from-purple-900/60 to-slate-900 text-white shadow-md border border-purple-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Initialize Profile
            </button>
          </div>

          {/* Core Auth Forms */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {isRegisterMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-semibold text-slate-400 ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      required
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="e.g. neuro_agent"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-cyber-border bg-slate-900/40 text-slate-100 cyber-input text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. quantum@neurobrief.ai"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-cyber-border bg-slate-900/40 text-slate-100 cyber-input text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 ml-1">Secret Keyphrase</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-cyber-border bg-slate-900/40 text-slate-100 cyber-input text-sm"
                />
              </div>
            </div>

            {/* Glowing submission button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                isRegisterMode ? 'btn-neon-purple' : 'btn-neon-cyan'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{isRegisterMode ? 'Deploy Profile' : 'De-encrypt Vaults'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Mock Credentials hint for ease of use! */}
          <div className="mt-8 pt-6 border-t border-cyber-border flex justify-between text-[11px] text-cyber-textMuted font-medium">
            <span>Demo Portal:</span>
            <span>Email: guest@neurobrief.ai</span>
            <span>Pass: 123456</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
