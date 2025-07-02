import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import ServicesSection from '../components/home/ServicesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Nova Hestia | Encuentra tu hogar ideal';
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* HomePage no necesita pt-20 porque HeroSection maneja su propio spacing */}
      <HeroSection />
      <FeaturedProperties />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default HomePage;