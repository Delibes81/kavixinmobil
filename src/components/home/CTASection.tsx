import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary-800/90"></div>
        <img
          src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
          alt="Modern Building"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-white mb-4">¿Listo para encontrar tu propiedad ideal?</h2>
          <p className="text-white/90 text-lg mb-8">
            Nuestros asesores inmobiliarios están listos para ayudarte a encontrar el hogar de tus sueños o la mejor inversión.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://wa.me/5215512345678" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Contáctanos ahora
            </a>
            <Link to="/propiedades" className="btn btn-outline bg-transparent text-white border-white hover:bg-white/10">
              Ver propiedades
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;