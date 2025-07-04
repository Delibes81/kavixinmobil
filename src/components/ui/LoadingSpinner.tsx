import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  showText?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  showText = false,
  text = 'Cargando...'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-500',
    white: 'border-white'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <div className={`animate-spin rounded-full border-2 border-transparent ${colorClasses[color]} border-t-transparent h-full w-full`}>
          <div className="sr-only">Cargando...</div>
        </div>
      </div>
      {showText && (
        <p className="mt-3 text-sm text-neutral-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;