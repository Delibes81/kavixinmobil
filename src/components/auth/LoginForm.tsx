import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, Shield, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { sanitizeInput } from '../../utils/security';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, remainingAttempts, timeUntilReset } = useAuth();
  const navigate = useNavigate();

  // Update countdown timer
  useEffect(() => {
    if (timeUntilReset > 0) {
      const timer = setInterval(() => {
        // This will trigger a re-render and update the timeUntilReset from context
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeUntilReset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Sanitize inputs
    const cleanUsername = sanitizeInput(username);
    const cleanPassword = password; // Don't sanitize password as it might contain special chars

    // Basic validation
    if (!cleanUsername.trim() || !cleanPassword.trim()) {
      setError('Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(cleanUsername, cleanPassword);
      
      if (result.success) {
        // Clear any previous errors and redirect
        setError('');
        navigate('/admin');
      } else {
        setError(result.error || 'Error de autenticación');
        // Clear password field for security
        setPassword('');
      }
    } catch (err) {
      setError('Error del sistema. Por favor, intenta más tarde.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const isBlocked = remainingAttempts <= 0 && timeUntilReset > 0;
  const timeLeftMinutes = Math.ceil(timeUntilReset / 1000 / 60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Home Button - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <Link 
          to="/" 
          className="flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-primary-700 hover:text-primary-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-primary-200"
          title="Ir al sitio web"
        >
          <Home className="h-5 w-5 mr-2" />
          <span className="font-medium">Sitio Web</span>
        </Link>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-600">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-6 text-center text-3xl font-bold text-primary-800">
            Acceso Administrativo
          </h1>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Ingresa tus credenciales para acceder al panel de administración
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Ingresa tu usuario"
                  disabled={isBlocked || isLoading}
                  autoComplete="username"
                  maxLength={50}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Ingresa tu contraseña"
                  disabled={isBlocked || isLoading}
                  autoComplete="current-password"
                  maxLength={100}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked || isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Rate limiting info */}
          {!isBlocked && remainingAttempts < 5 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Intentos restantes: {remainingAttempts}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || isBlocked}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verificando credenciales...
                </div>
              ) : isBlocked ? (
                `Bloqueado por ${timeLeftMinutes} minuto${timeLeftMinutes !== 1 ? 's' : ''}`
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-4 w-4 text-green-600 mr-1" />
              <p className="text-xs text-neutral-500">
                Conexión segura y encriptada
              </p>
            </div>
            <div className="mt-2 text-xs text-neutral-400">
              <p>Usuarios de prueba:</p>
              <p>admin / admin123 (Super Admin)</p>
              <p>usuario1 / password123 (Admin)</p>
            </div>
          </div>
        </form>

        {/* Additional Home Button at Bottom */}
        <div className="text-center pt-4 border-t border-neutral-200">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200"
          >
            <Home className="h-4 w-4 mr-1" />
            Volver al sitio web
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;