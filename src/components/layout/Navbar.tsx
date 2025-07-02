import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Building2, Users, Phone, Menu, X, Lock } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Solo cambiar estilo del navbar (transparente a blanco)
          // REMOVED: Lógica de ocultar/mostrar navbar
          setIsScrolled(currentScrollY > 10);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Inicializar valores
    setIsScrolled(window.scrollY > 10);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  const isHomePage = location.pathname === '/';
  
  // FIXED: Navbar siempre visible - removida lógica de translate-y
  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ease-in-out ${
    isScrolled || !isHomePage
      ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
      : 'bg-transparent py-5'
  }`;

  // Clases para los enlaces
  const linkBaseClasses = 'relative flex items-center px-4 py-2 text-base font-medium transition-all duration-200 transform hover:scale-105';
  const linkColorClasses = isScrolled || !isHomePage 
    ? 'text-primary-800 hover:text-primary-600' 
    : 'text-white hover:text-secondary-300';

  const activeLinkClasses = `after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary-500 after:transform after:scale-x-100 after:transition-transform after:duration-300 ${
    isScrolled || !isHomePage ? 'text-primary-600' : 'text-secondary-400'
  }`;

  const inactiveLinkClasses = `after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary-500 after:transform after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100`;

  return (
    <header className={navbarClasses}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <Building2 className={`h-8 w-8 transition-all duration-300 group-hover:scale-110 ${
            isScrolled || !isHomePage ? 'text-primary-600' : 'text-white'
          }`} />
          <span className={`ml-2 text-xl font-heading font-bold transition-all duration-300 ${
            isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'
          }`}>
            Nova Hestia
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <NavLink 
            to="/" 
            className={({isActive}) => `${linkBaseClasses} ${linkColorClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
          >
            <Home className="w-4 h-4 mr-1" />
            Inicio
          </NavLink>
          
          <NavLink 
            to="/propiedades" 
            className={({isActive}) => `${linkBaseClasses} ${linkColorClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
          >
            <Building2 className="w-4 h-4 mr-1" />
            Propiedades
          </NavLink>
          
          <NavLink 
            to="/nosotros" 
            className={({isActive}) => `${linkBaseClasses} ${linkColorClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
          >
            <Users className="w-4 h-4 mr-1" />
            Nosotros
          </NavLink>
          
          <NavLink 
            to="/contacto" 
            className={({isActive}) => `${linkBaseClasses} ${linkColorClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
          >
            <Phone className="w-4 h-4 mr-1" />
            Contacto
          </NavLink>
          
          <Link 
            to="/login" 
            className={`${linkBaseClasses} ${linkColorClasses} border border-current rounded-md ml-2 hover:bg-current hover:bg-opacity-10`}
          >
            <Lock className="w-4 h-4 mr-1" />
            Admin
          </Link>
        </nav>

        {/* Contact Button */}
        <div className="hidden lg:block">
          <a 
            href="https://wa.me/525544488414" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`btn transition-all duration-300 transform hover:scale-105 ${
              isScrolled || !isHomePage ? 'btn-primary' : 'btn-white'
            }`}
          >
            Contáctanos
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-md focus:outline-none transition-all duration-300 transform hover:scale-110"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className={`h-6 w-6 transition-all duration-300 ${
              isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'
            }`} />
          ) : (
            <Menu className={`h-6 w-6 transition-all duration-300 ${
              isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'
            }`} />
          )}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 flex z-50 lg:hidden">
            {/* Menu Panel */}
            <div className="relative flex-1 bg-white shadow-2xl">
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={closeMenu}
                  className="p-2 rounded-md text-primary-800 hover:text-primary-600 focus:outline-none transition-all duration-200 transform hover:scale-110"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="h-full flex flex-col pt-20 pb-6 px-6 space-y-6">
                <NavLink 
                  to="/" 
                  className="flex items-center py-3 text-lg font-medium text-primary-800 hover:text-primary-600 transition-all duration-200 transform hover:translate-x-2 border-b border-neutral-200"
                >
                  <Home className="w-5 h-5 mr-3" />
                  Inicio
                </NavLink>
                
                <NavLink 
                  to="/propiedades" 
                  className="flex items-center py-3 text-lg font-medium text-primary-800 hover:text-primary-600 transition-all duration-200 transform hover:translate-x-2 border-b border-neutral-200"
                >
                  <Building2 className="w-5 h-5 mr-3" />
                  Propiedades
                </NavLink>
                
                <NavLink 
                  to="/nosotros" 
                  className="flex items-center py-3 text-lg font-medium text-primary-800 hover:text-primary-600 transition-all duration-200 transform hover:translate-x-2 border-b border-neutral-200"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Nosotros
                </NavLink>
                
                <NavLink 
                  to="/contacto" 
                  className="flex items-center py-3 text-lg font-medium text-primary-800 hover:text-primary-600 transition-all duration-200 transform hover:translate-x-2 border-b border-neutral-200"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Contacto
                </NavLink>
                
                <Link 
                  to="/login" 
                  className="flex items-center py-3 text-lg font-medium text-primary-800 hover:text-primary-600 border border-primary-800 rounded-md px-4 transition-all duration-200 transform hover:scale-105"
                >
                  <Lock className="w-5 h-5 mr-3" />
                  Admin
                </Link>
                
                <div className="mt-auto">
                  <a 
                    href="https://wa.me/525544488414" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full transform transition-all duration-200 hover:scale-105"
                  >
                    Contáctanos
                  </a>
                </div>
              </nav>
            </div>
            
            {/* Overlay */}
            <div onClick={closeMenu} className="flex-shrink-0 w-14 bg-black bg-opacity-50"></div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;