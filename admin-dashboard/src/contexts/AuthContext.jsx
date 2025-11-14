import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = apiService.getToken();
    
    if (token) {
      try {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          // Only remove token if explicitly unauthorized (401)
          console.warn('Auth check failed - invalid response');
          apiService.removeToken();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Only remove token if it's a 401 Unauthorized error
        // Keep token for network errors or server issues
        if (error.message && error.message.includes('401')) {
          console.log('Token expired or invalid - removing');
          apiService.removeToken();
        } else {
          console.log('Auth check failed but keeping token (network or server issue)');
        }
      }
    }
    
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await apiService.login(credentials);
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        
        // Check if user is admin
        if (response.data.user.role !== 'ADMIN') {
          await logout();
          throw new Error('Access denied. Admin privileges required.');
        }
        
        return { success: true, user: response.data.user };
      }
      
      throw new Error('Login failed');
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await apiService.register(userData);
      
      if (response.success) {
        return { success: true };
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiService.removeToken();
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
