import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Building2 className="h-8 w-8 text-secondary-400" />
              <span className="ml-2 text-xl font-heading font-bold">Nova Hestia</span>
            </div>
            <p className="text-neutral-300 mb-6">
              Encuentra el hogar de tus sueños con la ayuda de nuestros expertos inmobiliarios.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-secondary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-secondary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-secondary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-heading font-semibold text-lg mb-4 text-white">Enlaces Rápidos</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-secondary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/propiedades" className="text-neutral-300 hover:text-secondary-400 transition-colors">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-neutral-300 hover:text-secondary-400 transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-neutral-300 hover:text-secondary-400 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-neutral-300 hover:text-secondary-400 transition-colors">
                  Administración
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="font-heading font-semibold text-lg mb-4 text-white">Servicios</h5>
            <ul className="space-y-3">
              <li className="text-neutral-300 hover:text-secondary-400 transition-colors cursor-pointer">
                Compra de Propiedades
              </li>
              <li className="text-neutral-300 hover:text-secondary-400 transition-colors cursor-pointer">
                Venta de Propiedades
              </li>
              <li className="text-neutral-300 hover:text-secondary-400 transition-colors cursor-pointer">
                Renta de Propiedades
              </li>
              <li className="text-neutral-300 hover:text-secondary-400 transition-colors cursor-pointer">
                Asesoría Legal
              </li>
              <li className="text-neutral-300 hover:text-secondary-400 transition-colors cursor-pointer">
                Avalúos
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-heading font-semibold text-lg mb-4 text-white">Contacto</h5>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-secondary-400 mr-3 mt-0.5" />
                <span className="text-neutral-300">José Azueta 29, Colonia Avante, Alcaldía Coyoacán, 04460 Ciudad de México, CDMX</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-secondary-400 mr-3" />
                <a href="tel:5544488414" className="text-neutral-300 hover:text-secondary-400 transition-colors">
                  55 4448 8414
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-secondary-400 mr-3" />
                <a href="mailto:contacto@novahestia.com" className="text-neutral-300 hover:text-secondary-400 transition-colors">
                  contacto@novahestia.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-primary-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-neutral-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Nova Hestia. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-neutral-400 hover:text-secondary-400 transition-colors">
              Política de Privacidad
            </Link>
            <Link to="/terms" className="text-neutral-400 hover:text-secondary-400 transition-colors">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;