import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data?.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      if (!err.response) {
        return {
          success: false,
          message: 'Unable to connect to backend server. Please make sure the Flask backend is running on http://127.0.0.1:5000.',
          network_error: true
        };
      }
      return {
        success: false,
        message: err.response.data?.message || 'Invalid email or password.',
        status: err.response.status
      };
    }
  };

  const register = async (name, email, password, headline = '') => {
    try {
      const res = await authService.register({ name, email, password, headline });
      if (res.data?.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      if (!err.response) {
        return {
          success: false,
          message: 'Unable to connect to backend server. Please make sure the Flask backend is running on http://127.0.0.1:5000.',
          network_error: true
        };
      }
      const data = err.response.data || {};
      const status = err.response.status;
      return {
        success: false,
        message: data.message || (status === 409 ? 'You already have an account with this email. Please sign in instead.' : 'Registration failed. Please try again.'),
        already_exists: status === 409 || data.already_exists,
        status: status
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
