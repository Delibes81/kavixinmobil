import { useState, useEffect } from 'react';

const INITIAL_LOAD_KEY = 'nova_hestia_initial_load';

export const useInitialLoading = () => {
  const [showInitialLoading, setShowInitialLoading] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem(INITIAL_LOAD_KEY);
    
    if (!hasVisitedBefore) {
      setShowInitialLoading(true);
    } else {
      setIsInitialLoadComplete(true);
    }
  }, []);

  const completeInitialLoading = () => {
    // Mark as visited
    localStorage.setItem(INITIAL_LOAD_KEY, 'true');
    setShowInitialLoading(false);
    setIsInitialLoadComplete(true);
  };

  const resetInitialLoading = () => {
    // For testing purposes - remove the flag
    localStorage.removeItem(INITIAL_LOAD_KEY);
    setShowInitialLoading(true);
    setIsInitialLoadComplete(false);
  };

  return {
    showInitialLoading,
    isInitialLoadComplete,
    completeInitialLoading,
    resetInitialLoading
  };
};