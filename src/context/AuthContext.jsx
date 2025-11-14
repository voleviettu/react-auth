import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient, { setAccessToken, setRefreshToken, clearTokens, getRefreshToken } from '../lib/apiClient';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedRefreshToken = getRefreshToken();
      
      if (storedRefreshToken) {
        try {
          // Try to refresh and get user data
          const response = await apiClient.post('/auth/refresh', {
            refreshToken: storedRefreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          setAccessToken(accessToken);
          setRefreshToken(newRefreshToken);
          
          // Fetch user data
          const userResponse = await apiClient.get('/user/me');
          setUser(userResponse.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to restore session:', error);
          clearTokens();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Listen for logout events from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });

      const { accessToken, refreshToken, user: userData } = response.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const storedRefreshToken = getRefreshToken();
      
      if (storedRefreshToken) {
        await apiClient.post('/auth/logout', {
          refreshToken: storedRefreshToken
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
