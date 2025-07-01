import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

interface PageLoaderProps {
  onLoadingComplete: () => void;
}

const PageLoader: React.FC<PageLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Iniciando Nova Hestia...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Cargando propiedades...' },
      { progress: 40, text: 'Configurando interfaz...' },
      { progress: 60, text: 'Conectando servicios...' },
      { progress: 80, text: 'Preparando experiencia...' },
      { progress: 100, text: '¡Listo para explorar!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <div className="mb-8 animate-pulse">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Building2 className="h-16 w-16 text-white animate-bounce" />
              <div className="absolute inset-0 h-16 w-16 border-2 border-white/30 rounded-full animate-ping" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">Nova Hestia</h1>
          <p className="text-white/80 text-lg animate-fade-in-delay">Tu hogar ideal te espera</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-secondary-400 to-secondary-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 text-white/90 text-sm font-medium animate-pulse">
            {loadingText}
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;