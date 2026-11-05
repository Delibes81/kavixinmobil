import { useState } from 'react';

const INITIAL_LOAD_KEY = 'nova_hestia_initial_load';

// Los buscadores y bots de redes sociales siempre llegan como "primera visita":
// les mostramos el contenido directamente en lugar de la animación de carga.
const isBot = () =>
  typeof navigator !== 'undefined' &&
  (navigator.webdriver ||
    /bot|crawl|spider|slurp|lighthouse|facebookexternalhit|whatsapp|twitterbot|linkedinbot|embedly|preview/i.test(
      navigator.userAgent,
    ));

const hasVisitedBefore = () => {
  try {
    return localStorage.getItem(INITIAL_LOAD_KEY) !== null;
  } catch {
    return true; // sin acceso a localStorage: no bloquear el contenido
  }
};

export const useInitialLoading = () => {
  // Se decide una sola vez al montar: primera visita de una persona => animación de carga
  const [firstVisit] = useState(() => !isBot() && !hasVisitedBefore());
  const [showInitialLoading, setShowInitialLoading] = useState(firstVisit);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(!firstVisit);

  const completeInitialLoading = () => {
    // Mark as visited
    try {
      localStorage.setItem(INITIAL_LOAD_KEY, 'true');
    } catch {
      // ignorar (modo privado / almacenamiento bloqueado)
    }
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