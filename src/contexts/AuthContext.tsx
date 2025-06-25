import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('nova_hestia_admin');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Validate the saved user data
          if (userData && userData.username && userData.role) {
            setUser(userData);
          } else {
            // Invalid data, remove it
            localStorage.removeItem('nova_hestia_admin');
          }
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('nova_hestia_admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Hardcoded credentials for now
      if (username === 'administrador' && password === 'cY~1NV663}2_') {
        const userData: User = {
          username: 'administrador',
          role: 'admin'
        };
        
        setUser(userData);
        localStorage.setItem('nova_hestia_admin', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nova_hestia_admin');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};