import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import ServicesSection from '../components/home/ServicesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'PropMax | Encuentra tu hogar ideal';
  }, []);

  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default HomePage;