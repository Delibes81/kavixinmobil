import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Building2, Users, Phone, Menu, X, Lock } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determinar si el navbar debe cambiar de estilo (transparente a blanco)
      setIsScrolled(currentScrollY > 10);
      
      // Determinar si el navbar debe ser visible
      if (currentScrollY < 10) {
        // Siempre mostrar en la parte superior
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - ocultar navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - mostrar navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    closeMenu();
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isHomePage = location.pathname === '/';

  const linkClass = `relative flex items-center px-4 py-2 text-base font-medium transition-colors duration-200 ${
    isScrolled || !isHomePage ? 'text-primary-800 hover:text-primary-600' : 'text-white hover:text-secondary-300'
  }`;
  
  const activeLinkClass = `after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary-500 ${
    isScrolled || !isHomePage ? 'text-primary-600' : 'text-secondary-400'
  }`;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled || !isHomePage
          ? 'bg-white shadow-md py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center z-60">
            <Building2 className={`h-8 w-8 transition-colors duration-300 ${isScrolled || !isHomePage ? 'text-primary-600' : 'text-white'}`} />
            <span className={`ml-2 text-xl font-heading font-bold transition-colors duration-300 ${isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'}`}>
              Nova Hestia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
              <Home className="w-4 h-4 mr-1" />
              Inicio
            </NavLink>
            <NavLink to="/propiedades" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
              <Building2 className="w-4 h-4 mr-1" />
              Propiedades
            </NavLink>
            <NavLink to="/nosotros" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
              <Users className="w-4 h-4 mr-1" />
              Nosotros
            </NavLink>
            <NavLink to="/contacto" className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
              <Phone className="w-4 h-4 mr-1" />
              Contacto
            </NavLink>
            <Link to="/login" className={`${linkClass} border border-current rounded-md ml-2`}>
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
              className={`btn transition-all duration-300 ${isScrolled || !isHomePage ? 'btn-primary' : 'btn-white'}`}
            >
              Contáctanos
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md focus:outline-none transition-colors duration-300 z-60 relative"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-primary-800" />
            ) : (
              <Menu className={`h-6 w-6 transition-colors duration-300 ${isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'}`} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMenu}
          />
          
          {/* Menu panel */}
          <div className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-heading font-bold text-primary-800">
                  Nova Hestia
                </span>
              </div>
              <button 
                onClick={closeMenu}
                className="p-2 rounded-md text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 focus:outline-none transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Navigation links */}
            <nav className="flex flex-col py-6">
              <NavLink 
                to="/" 
                onClick={closeMenu}
                className={({isActive}) => `flex items-center px-6 py-4 text-lg font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-600' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Inicio
              </NavLink>
              
              <NavLink 
                to="/propiedades" 
                onClick={closeMenu}
                className={({isActive}) => `flex items-center px-6 py-4 text-lg font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-600' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                <Building2 className="w-5 h-5 mr-3" />
                Propiedades
              </NavLink>
              
              <NavLink 
                to="/nosotros" 
                onClick={closeMenu}
                className={({isActive}) => `flex items-center px-6 py-4 text-lg font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-600' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Nosotros
              </NavLink>
              
              <NavLink 
                to="/contacto" 
                onClick={closeMenu}
                className={({isActive}) => `flex items-center px-6 py-4 text-lg font-medium transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-600' 
                    : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                <Phone className="w-5 h-5 mr-3" />
                Contacto
              </NavLink>
              
              <div className="px-6 py-4">
                <Link 
                  to="/login" 
                  onClick={closeMenu}
                  className="flex items-center justify-center w-full py-3 px-4 text-lg font-medium text-primary-600 border-2 border-primary-600 rounded-md hover:bg-primary-600 hover:text-white transition-colors duration-200"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Admin
                </Link>
              </div>
            </nav>
            
            {/* Contact button at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-200 bg-neutral-50">
              <a 
                href="https://wa.me/525544488414" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="btn btn-primary w-full justify-center"
              >
                Contáctanos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;