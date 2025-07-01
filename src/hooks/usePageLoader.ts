import { useState, useEffect } from 'react';

export const usePageLoader = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('nova-hestia-visited');
    
    if (hasVisited) {
      setIsFirstVisit(false);
      setShowLoader(false);
    } else {
      // Mark as visited
      localStorage.setItem('nova-hestia-visited', 'true');
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