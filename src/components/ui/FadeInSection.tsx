import React, { useEffect, useRef, useState } from 'react';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getTransformClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    
    if (isVisible) {
      return `${baseClasses} opacity-100 translate-x-0 translate-y-0`;
    }

    switch (direction) {
      case 'up':
        return `${baseClasses} opacity-0 translate-y-8`;
      case 'down':
        return `${baseClasses} opacity-0 -translate-y-8`;
      case 'left':
        return `${baseClasses} opacity-0 translate-x-8`;
      case 'right':
        return `${baseClasses} opacity-0 -translate-x-8`;
      default:
        return `${baseClasses} opacity-0 translate-y-8`;
    }
  };

  return (
    <div ref={ref} className={`${getTransformClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default FadeInSection;