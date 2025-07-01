import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
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
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-transparent ${colorClasses[color]} border-t-transparent h-full w-full`}>
        <div className="sr-only">Cargando...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;