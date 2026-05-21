import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyber-neonCyan animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyber-neonPurple animate-spin duration-1000"></div>
          <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-cyber-neonCyan font-bold tracking-widest uppercase">
            AI
          </div>
        </div>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
