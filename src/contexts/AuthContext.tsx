import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: { username: string; name: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const savedAuth = localStorage.getItem('nova_hestia_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        // Check if the session is still valid (24 hours)
        const sessionAge = Date.now() - authData.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (sessionAge < maxAge) {
          setIsAuthenticated(true);
          setUser(authData.user);
        } else {
          // Session expired, clear it
          localStorage.removeItem('nova_hestia_auth');
        }
      } catch (error) {
        // Invalid session data, clear it
        localStorage.removeItem('nova_hestia_auth');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Get credentials from environment variables
    const validUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    // Validate credentials
    if (username === validUsername && password === validPassword) {
      const userData = { username: validUsername, name: 'Administrador Nova Hestia' };
      setIsAuthenticated(true);
      setUser(userData);
      
      // Save to localStorage with timestamp for session management
      localStorage.setItem('nova_hestia_auth', JSON.stringify({
        isAuthenticated: true,
        user: userData,
        timestamp: Date.now()
      }));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('nova_hestia_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};