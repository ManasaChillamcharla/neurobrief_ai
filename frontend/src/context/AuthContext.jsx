import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set default authorization header on boot
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/api/auth/profile');
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (error) {
        console.error('[AuthContext] Profile load failed:', error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.success) {
        const userToken = response.data.token;
        localStorage.setItem('token', userToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        setToken(userToken);
        setUser(response.data.user);
        toast.success(response.data.message || 'Access granted. Welcome back.');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Access denied. Please check credentials.';
      console.error('[AuthContext] Login failed:', error.response?.data || error.message);
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', { username, email, password });
      if (response.data.success) {
        const userToken = response.data.token;
        localStorage.setItem('token', userToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        setToken(userToken);
        setUser(response.data.user);
        toast.success('Registration successful. Welcome to NeuroBrief AI!');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Try again.';
      console.error('[AuthContext] Registration failed:', error.response?.data || error.message);
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
    toast.success('Terminated secure session successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
