import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseConfig } from '../lib/supabase';
import { secureStorage, loginRateLimiter, sanitizeInput } from '../utils/security';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  user: AdminUser | null;
  loading: boolean;
  remainingAttempts: number;
  timeUntilReset: number;
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
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [timeUntilReset, setTimeUntilReset] = useState(0);

  // Update rate limiting info
  const updateRateLimitInfo = (identifier: string) => {
    setRemainingAttempts(loginRateLimiter.getRemainingAttempts(identifier));
    setTimeUntilReset(loginRateLimiter.getTimeUntilReset(identifier));
  };

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = secureStorage.getItem('admin_user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        secureStorage.removeItem('admin_user');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Sanitize inputs
      const cleanUsername = sanitizeInput(username);
      const identifier = `login_${cleanUsername}`;

      // Check rate limiting
      if (loginRateLimiter.isBlocked(identifier)) {
        updateRateLimitInfo(identifier);
        const timeLeft = Math.ceil(loginRateLimiter.getTimeUntilReset(identifier) / 1000 / 60);
        return {
          success: false,
          error: `Demasiados intentos fallidos. Intenta de nuevo en ${timeLeft} minutos.`
        };
      }

      // Basic validation
      if (!cleanUsername.trim() || !password.trim()) {
        return {
          success: false,
          error: 'Por favor, completa todos los campos'
        };
      }

      // Check if Supabase is configured
      if (!supabaseConfig.hasUrl || !supabaseConfig.hasKey) {
        console.warn('Supabase not configured, using demo authentication');
        
        // Demo authentication for when Supabase is not configured
        const demoUsers = [
          { username: 'admin', password: 'admin123', name: 'Administrador Principal', role: 'super_admin' },
          { username: 'usuario1', password: 'password123', name: 'Usuario de Prueba', role: 'admin' }
        ];
        
        const demoUser = demoUsers.find(u => u.username === cleanUsername && u.password === password);
        
        if (demoUser) {
          const userData: AdminUser = {
            id: 'demo-' + demoUser.username,
            username: demoUser.username,
            name: demoUser.name,
            role: demoUser.role,
          };

          setIsAuthenticated(true);
          setUser(userData);

          // Store session securely
          secureStorage.setItem('admin_user', JSON.stringify(userData), 8);

          return { success: true };
        } else {
          // Record failed attempt
          loginRateLimiter.recordAttempt(identifier);
          updateRateLimitInfo(identifier);
          
          return {
            success: false,
            error: `Credenciales incorrectas. Intentos restantes: ${loginRateLimiter.getRemainingAttempts(identifier)}`
          };
        }
      }

      // Call the verify_admin_login function
      const { data, error } = await supabase.rpc('verify_admin_login', {
        p_username: cleanUsername,
        p_password: password
      });

      if (error) {
        console.error('Login error:', error);
        loginRateLimiter.recordAttempt(identifier);
        updateRateLimitInfo(identifier);
        return {
          success: false,
          error: 'Error del sistema. Por favor, intenta más tarde.'
        };
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

        // Store session securely
        secureStorage.setItem('admin_user', JSON.stringify(userData), 8);

        return { success: true };
      } else {
        // Record failed attempt
        loginRateLimiter.recordAttempt(identifier);
        updateRateLimitInfo(identifier);
        
        return {
          success: false,
          error: `Credenciales incorrectas. Intentos restantes: ${loginRateLimiter.getRemainingAttempts(identifier)}`
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Error del sistema. Por favor, intenta más tarde.'
      };
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      secureStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      user, 
      loading,
      remainingAttempts,
      timeUntilReset
    }}>
      {children}
    </AuthContext.Provider>
  );
};