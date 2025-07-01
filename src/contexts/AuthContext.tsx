import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseConfig } from '../lib/supabase';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  user: AdminUser | null;
  loading: boolean;
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
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('admin_user');
        const sessionExpiry = localStorage.getItem('session_expiry');
        
        if (storedUser && sessionExpiry) {
          const now = new Date().getTime();
          const expiry = parseInt(sessionExpiry);
          
          if (now < expiry) {
            const userData = JSON.parse(storedUser);
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            // Session expired
            localStorage.removeItem('admin_user');
            localStorage.removeItem('session_expiry');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('session_expiry');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check if Supabase is configured
      if (!supabaseConfig.hasUrl || !supabaseConfig.hasKey) {
        console.warn('Supabase not configured, using demo authentication');
        
        // Demo authentication for when Supabase is not configured
        const demoUsers = [
          { username: 'admin', password: 'admin123', name: 'Administrador Principal', role: 'super_admin' },
          { username: 'usuario1', password: 'password123', name: 'Usuario de Prueba', role: 'admin' }
        ];
        
        const demoUser = demoUsers.find(u => u.username === username && u.password === password);
        
        if (demoUser) {
          const userData: AdminUser = {
            id: 'demo-' + demoUser.username,
            username: demoUser.username,
            name: demoUser.name,
            role: demoUser.role,
          };

          setIsAuthenticated(true);
          setUser(userData);

          // Store session in localStorage (expires in 8 hours)
          const expiryTime = new Date().getTime() + (8 * 60 * 60 * 1000);
          localStorage.setItem('admin_user', JSON.stringify(userData));
          localStorage.setItem('session_expiry', expiryTime.toString());

          return true;
        }
        
        return false;
      }

      // Call the verify_admin_login function
      const { data, error } = await supabase.rpc('verify_admin_login', {
        p_username: username,
        p_password: password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      // Check if login was successful
      if (data && data.length > 0 && data[0].success) {
        const userData: AdminUser = {
          id: data[0].user_id,
          username: data[0].username,
          name: data[0].name,
          role: data[0].role,
        };

        setIsAuthenticated(true);
        setUser(userData);

        // Store session in localStorage (expires in 8 hours)
        const expiryTime = new Date().getTime() + (8 * 60 * 60 * 1000);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        localStorage.setItem('session_expiry', expiryTime.toString());

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('admin_user');
      localStorage.removeItem('session_expiry');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};