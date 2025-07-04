import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Transición muy sutil - solo un pequeño fade
    setIsVisible(false);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 25); // Extremadamente rápido

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`transition-opacity duration-75 ease-out ${
      isVisible ? 'opacity-100' : 'opacity-98'
    }`}>
      {children}
    </div>
  );
};

export default PageTransition;