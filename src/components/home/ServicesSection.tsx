import React from 'react';
import { Home, Bookmark, Building, Lock, Search, MessageSquare } from 'lucide-react';

interface ServiceProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceProps> = ({ icon, title, description }) => {
  return (
    <div className="card p-6 hover:translate-y-[-5px] transition-all duration-300">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <Home className="h-7 w-7" />,
      title: 'Compra de propiedades',
      description: 'Te ayudamos a encontrar la propiedad perfecta que se ajuste a tus necesidades y presupuesto.'
    },
    {
      icon: <Building className="h-7 w-7" />,
      title: 'Venta de propiedades',
      description: 'Maximizamos el valor de tu propiedad con estrategias de marketing efectivas y asesoría profesional.'
    },
    {
      icon: <Bookmark className="h-7 w-7" />,
      title: 'Renta de propiedades',
      description: 'Gestionamos el proceso completo de renta para propietarios e inquilinos con total transparencia.'
    },
    {
      icon: <Lock className="h-7 w-7" />,
      title: 'Asesoría legal',
      description: 'Ofrecemos orientación legal en todas las etapas de la transacción inmobiliaria para tu tranquilidad.'
    },
    {
      icon: <Search className="h-7 w-7" />,
      title: 'Avalúos profesionales',
      description: 'Determinamos el valor real de mercado de tu propiedad con métodos profesionales y precisos.'
    },
    {
      icon: <MessageSquare className="h-7 w-7" />,
      title: 'Atención personalizada',
      description: 'Nuestro equipo de expertos te acompaña en cada paso para asegurar una experiencia sin complicaciones.'
    }
  ];

  return (
    <section className="section bg-neutral-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="mb-4">Nuestros servicios</h2>
          <p className="text-neutral-600">
            En PropMax ofrecemos soluciones inmobiliarias integrales para satisfacer todas tus necesidades.
            Contamos con un equipo de profesionales altamente capacitados para brindarte el mejor servicio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;