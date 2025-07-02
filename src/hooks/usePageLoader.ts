import { useState, useEffect } from 'react';

export const usePageLoader = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showLoader, setShowLoader] = useState(false); // FIXED: Cambiar a false por defecto

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('nova-hestia-visited');
    
    if (hasVisited) {
      setIsFirstVisit(false);
      setShowLoader(false);
    } else {
      // Mark as visited and show loader only on first visit
      localStorage.setItem('nova-hestia-visited', 'true');
      setShowLoader(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  return {
    isFirstVisit,
    showLoader,
    handleLoadingComplete
  };
};