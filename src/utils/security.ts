/**
 * Security utilities for Nova Hestia
 */

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Phone validation (Mexican format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+52|52)?[\s\-]?(\d{2})[\s\-]?(\d{4})[\s\-]?(\d{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting for login attempts
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  isBlocked(identifier: string): boolean {
    const record = this.attempts.get(identifier);
    if (!record) return false;

    const now = Date.now();
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier);
      return false;
    }

    return record.count >= this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
    } else {
      record.count++;
      record.lastAttempt = now;
    }
  }

  getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return this.maxAttempts;

    const now = Date.now();
    if (now - record.lastAttempt > this.windowMs) {
      return this.maxAttempts;
    }

    return Math.max(0, this.maxAttempts - record.count);
  }

  getTimeUntilReset(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;

    const now = Date.now();
    const timeLeft = this.windowMs - (now - record.lastAttempt);
    return Math.max(0, timeLeft);
  }
}

export const loginRateLimiter = new RateLimiter();

// CSRF protection
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Secure session storage
export const secureStorage = {
  setItem: (key: string, value: string, expirationHours: number = 8): void => {
    const expirationTime = new Date().getTime() + (expirationHours * 60 * 60 * 1000);
    const item = {
      value,
      expiration: expirationTime
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  getItem: (key: string): string | null => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();

      if (now > item.expiration) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};

// Environment variable validation
export const validateEnvironment = (): boolean => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }

  return true;
};

// Content validation for admin forms
export const validatePropertyData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!data.titulo?.trim()) errors.push('El título es requerido');
  if (!data.precio || data.precio <= 0) errors.push('El precio debe ser mayor a cero');
  if (!data.direccion?.trim()) errors.push('La dirección es requerida');
  if (!data.colonia?.trim()) errors.push('La colonia es requerida');

  // Validate numeric fields
  if (data.recamaras < 0) errors.push('El número de recámaras no puede ser negativo');
  if (data.banos < 0) errors.push('El número de baños no puede ser negativo');
  if (data.estacionamientos < 0) errors.push('El número de estacionamientos no puede ser negativo');

  // Validate coordinates if provided
  // Allow any coordinate values - validation removed to allow manual input
  return {
    isValid: errors.length === 0,
    errors
  };
};