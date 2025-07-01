import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset visibility
    setIsVisible(false);
    
    // Trigger fade in animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`transition-all duration-500 ease-out ${
      isVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-4'
    }`}>
      {children}
    </div>
  );
};

export default PageTransition;