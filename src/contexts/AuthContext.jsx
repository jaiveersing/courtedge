import { createContext, useContext, useState, useEffect } from 'react';

// SECURITY WARNING: This is a DEMO/DEVELOPMENT authentication system
// For production, implement proper backend authentication with:
// - Server-side session management
// - httpOnly cookies for tokens
// - CSRF protection
// - Rate limiting
const IS_PRODUCTION = import.meta.env.PROD;
const AUTH_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = localStorage.getItem('courtedge_token');
    const storedUser = localStorage.getItem('courtedge_user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('courtedge_token');
        localStorage.removeItem('courtedge_user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // SECURITY: In production, use real API authentication
      if (IS_PRODUCTION && AUTH_API_URL.includes('localhost')) {
        console.warn('⚠️ Production mode detected but using localhost API. Configure VITE_API_URL!');
      }
      
      // Try real API first
      try {
        const response = await fetch(`${AUTH_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(data.tokens?.accessToken || data.token);
          localStorage.setItem('courtedge_token', data.tokens?.accessToken || data.token);
          localStorage.setItem('courtedge_user', JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
      } catch (apiError) {
        // API not available, fall through to demo mode
        console.log('API not available, using demo mode');
      }
      
      // DEMO MODE: Mock authentication (development only)
      if (IS_PRODUCTION) {
        return { success: false, error: 'Authentication service unavailable' };
      }
      
      console.warn('🔓 DEMO MODE: Using mock authentication. Not suitable for production!');
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        subscription: 'pro',
        avatar: null,
        createdAt: new Date().toISOString(),
        _isDemo: true // Flag to identify demo accounts
      };
      
      const mockToken = 'demo_token_' + Date.now();
      
      setUser(mockUser);
      setToken(mockToken);
      
      localStorage.setItem('courtedge_token', mockToken);
      localStorage.setItem('courtedge_user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      // SECURITY: In production, use real API authentication
      if (IS_PRODUCTION && AUTH_API_URL.includes('localhost')) {
        console.warn('⚠️ Production mode detected but using localhost API. Configure VITE_API_URL!');
      }
      
      // Try real API first
      try {
        const response = await fetch(`${AUTH_API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username: name })
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(data.tokens?.accessToken || data.token);
          localStorage.setItem('courtedge_token', data.tokens?.accessToken || data.token);
          localStorage.setItem('courtedge_user', JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }
      
      // DEMO MODE: Mock signup (development only)
      if (IS_PRODUCTION) {
        return { success: false, error: 'Registration service unavailable' };
      }
      
      console.warn('🔓 DEMO MODE: Using mock signup. Not suitable for production!');
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        name: name,
        subscription: 'free',
        avatar: null,
        createdAt: new Date().toISOString()
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      setUser(mockUser);
      setToken(mockToken);
      
      localStorage.setItem('courtedge_token', mockToken);
      localStorage.setItem('courtedge_user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('courtedge_token');
    localStorage.removeItem('courtedge_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('courtedge_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
