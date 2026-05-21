import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Search, 
  Database, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { name: 'AI Summary Studio', path: '/dashboard/studio', icon: BrainCircuit, color: 'text-cyber-neonCyan' },
    { name: 'Memory Vault', path: '/dashboard/vault', icon: Database, color: 'text-cyber-neonPurple' },
    { name: 'Semantic Search', path: '/dashboard/semantic', icon: Search, color: 'text-cyber-neonPink' },
    { name: 'Analytics Board', path: '/dashboard/analytics', icon: LayoutDashboard, color: 'text-cyber-neonEmerald' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#030712] dot-grid flex text-slate-100 overflow-hidden">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 glass-card border-r border-cyber-border h-screen sticky top-0 z-40">
        {/* Brand Header */}
        <div className="p-6 border-b border-cyber-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-neonPurple to-cyber-neonCyan flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyber-neonCyan bg-clip-text text-transparent">
              NEUROBRIEF AI
            </h1>
            <span className="text-[10px] uppercase font-bold text-cyber-textMuted tracking-widest">
              Smart Summarizer
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-950/40 to-slate-900 border-l-4 border-cyber-neonPurple text-white shadow-inner shadow-purple-500/5' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/30 border-l-4 border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span className="text-sm">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-cyber-border bg-slate-950/20">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/30 border border-cyber-border">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-cyber-neonCyan">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-200">
                {user?.username || 'NeuroUser'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || 'user@neurobrief.ai'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-300 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Session
          </button>
        </div>
      </aside>

      {/* 2. Mobile Header Bar */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 glass-card border-b border-cyber-border z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyber-neonPurple to-cyber-neonCyan flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-widest text-white">NEUROBRIEF</span>
          </div>

          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-cyber-border"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-card border-b border-cyber-border p-4 space-y-2 z-30"
            >
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                      isActive 
                        ? 'bg-slate-900 border-l-4 border-cyber-neonPurple text-white' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                    }`}>
                      <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-cyber-border mt-4 flex items-center justify-between">
                <div className="text-xs text-cyber-textMuted">
                  User: <span className="text-slate-200 font-bold">{user?.username}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Primary Dashboard Canvas scroll area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
