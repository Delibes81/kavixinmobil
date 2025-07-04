import { useState, useEffect } from 'react';

export const usePageLoader = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('nova-hestia-visited');
    
    if (hasVisited) {
      // Usuario ya visitó antes, no mostrar loader
      setIsFirstVisit(false);
      setShowLoader(false);
    } else {
      // Primera visita, mostrar loader solo una vez
      localStorage.setItem('nova-hestia-visited', 'true');
      setIsFirstVisit(true);
      setShowLoader(true);
    }
  }, []); // Solo ejecutar una vez al montar el componente

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  return {
    isFirstVisit,
    showLoader,
    handleLoadingComplete
  };
};