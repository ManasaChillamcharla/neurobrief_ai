import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SummaryProvider } from './context/SummaryContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages lazy loads
import Login from './pages/Login';
import Studio from './pages/Studio';
import Vault from './pages/Vault';
import SemanticSearch from './pages/Search';
import AnalyticsBoard from './pages/Analytics';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SummaryProvider>
          {/* Futuristic glowing toast setup */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(17, 24, 39, 0.9)',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                fontFamily: 'Outfit, Inter, sans-serif',
                fontSize: '14px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              },
              success: {
                iconTheme: {
                  primary: '#06b6d4',
                  secondary: '#111827'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#111827'
                }
              }
            }}
          />

          <Routes>
            {/* Public Access Portal */}
            <Route path="/login" element={<Login />} />

            {/* Locked Dashboard Core */}
            <Route element={<ProtectedRoute />}>
              <Route 
                path="/dashboard" 
                element={<Navigate to="/dashboard/studio" replace />} 
              />
              
              <Route 
                path="/dashboard/studio" 
                element={
                  <DashboardLayout>
                    <Studio />
                  </DashboardLayout>
                } 
              />
              
              <Route 
                path="/dashboard/vault" 
                element={
                  <DashboardLayout>
                    <Vault />
                  </DashboardLayout>
                } 
              />
              
              <Route 
                path="/dashboard/semantic" 
                element={
                  <DashboardLayout>
                    <SemanticSearch />
                  </DashboardLayout>
                } 
              />
              
              <Route 
                path="/dashboard/analytics" 
                element={
                  <DashboardLayout>
                    <AnalyticsBoard />
                  </DashboardLayout>
                } 
              />
            </Route>

            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

        </SummaryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
