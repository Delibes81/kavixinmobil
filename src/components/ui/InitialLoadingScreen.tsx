import React, { useState, useEffect } from 'react';
import NovaHestiaLogo from './NovaHestiaLogo';

interface InitialLoadingScreenProps {
  onComplete: () => void;
}

const InitialLoadingScreen: React.FC<InitialLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const loadingSteps = [
    'Inicializando Nova Hestia...',
    'Cargando propiedades...',
    'Configurando experiencia...',
    'Preparando tu hogar ideal...'
  ];

  useEffect(() => {
    const duration = 3000; // 3 seconds total
    const stepDuration = duration / loadingSteps.length;
    const progressInterval = 50; // Update every 50ms for smooth animation

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / progressInterval));
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          // Start exit animation
          setTimeout(() => {
            setIsExiting(true);
            // Complete loading after exit animation
            setTimeout(onComplete, 800);
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, progressInterval);

    return () => clearInterval(progressTimer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-800 ${
      isExiting 
        ? 'opacity-0 scale-110 bg-gradient-to-br from-primary-900/90 to-primary-800/90' 
        : 'opacity-100 scale-100 bg-gradient-to-br from-primary-900 to-primary-800'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative text-center px-8 max-w-md w-full">
        {/* Logo Animation */}
        <div className={`mb-8 transform transition-all duration-1000 ${
          isExiting ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
        }`}>
          <div className="relative">
            {/* Animated Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-secondary-400/30 rounded-full animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-secondary-400/50 rounded-full animate-pulse"></div>
            </div>
            
            {/* Logo */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <NovaHestiaLogo className="h-16 w-16 animate-pulse" color="#e6b325" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className={`mb-8 transform transition-all duration-1000 delay-300 ${
          isExiting ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}>
          <h1 className="text-4xl font-bold text-white mb-2 font-heading">
            Nova Hestia
          </h1>
          <p className="text-white/80 text-lg">
            Encuentra tu hogar ideal
          </p>
        </div>

        {/* Loading Progress */}
        <div className={`mb-6 transform transition-all duration-1000 delay-500 ${
          isExiting ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}>
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-secondary-400 to-secondary-300 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          
          {/* Loading Text */}
          <p className="text-white/90 text-sm font-medium min-h-[20px]">
            {loadingSteps[currentStep]}
          </p>
        </div>

        {/* Percentage */}
        <div className={`transform transition-all duration-1000 delay-700 ${
          isExiting ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}>
          <div className="text-secondary-400 text-2xl font-bold font-mono">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-secondary-400/30 rounded-full animate-bounce ${
                isExiting ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom Branding */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
        isExiting ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <p className="text-white/60 text-xs">
          © 2025 Nova Hestia. Expertos inmobiliarios.
        </p>
      </div>
    </div>
  );
};

export default InitialLoadingScreen;