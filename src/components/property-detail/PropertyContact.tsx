import React from 'react';
import { Phone, Share2 } from 'lucide-react';

interface PropertyContactProps {
  propertyTitle: string;
  propertyId: string;
}

const PropertyContact: React.FC<PropertyContactProps> = ({ propertyTitle, propertyId }) => {
  const handleContactClick = () => {
    const message = encodeURIComponent(
      `Hola, estoy interesado en la propiedad "${propertyTitle}" (ID: ${propertyId}). ¿Podría obtener más información?`
    );
    window.open(`https://wa.me/5215512345678?text=${message}`, '_blank');
  };

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/propiedades/${propertyId}`;
    const shareMessage = encodeURIComponent(
      `¡Mira esta propiedad! "${propertyTitle}": ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${shareMessage}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">¿Te interesa esta propiedad?</h3>
      <p className="text-neutral-600 mb-6">
        Nuestros asesores inmobiliarios están listos para atenderte y resolver todas tus dudas sobre esta propiedad.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleContactClick}
          className="btn btn-primary flex-1"
        >
          <Phone className="h-5 w-5 mr-2" />
          Contactar por WhatsApp
        </button>
        
        <button 
          onClick={handleShareClick}
          className="btn btn-outline flex-1"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Compartir propiedad
        </button>
      </div>
    </div>
  );
};

export default PropertyContact;