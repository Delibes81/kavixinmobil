import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Building2, BookOpen, Users, Phone, Menu, X, Lock } from 'lucide-react';
import NovaHestiaLogo from '../ui/NovaHestiaLogo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
    };

    // Initialize values
    setIsScrolled(window.scrollY > 10);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  const isHomePage = location.pathname === '/';
  
  // Navbar classes - always visible, no hiding
  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ease-in-out ${
    isScrolled || !isHomePage
      ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
      : 'bg-transparent py-5'
  }`;

  // Link classes
  const linkBaseClasses = 'relative flex items-center px-4 py-2 text-base font-medium transition-colors duration-200';
  const linkColorClasses = isScrolled || !isHomePage 
    ? 'text-primary-800 hover:text-primary-600' 
    : 'text-white hover:text-secondary-300';

  const activeLinkClasses = `after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary-500 ${
    isScrolled || !isHomePage ? 'text-primary-600' : 'text-secondary-400'
  }`;

  return (
    <>
      <header className={navbarClasses}>
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center z-10">
            <NovaHestiaLogo className={`h-8 w-8 transition-colors duration-300 ${
              isScrolled || !isHomePage ? 'text-primary-600' : 'text-white'
            }`} color={isScrolled || !isHomePage ? '#0052a3' : '#ffffff'} />
            <span className={`ml-2 text-xl font-heading font-bold transition-colors duration-300 ${
              isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'
            }`}>
              Nova Hestia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink 
              to="/" 
              className={({isActive}) => `${linkBaseClasses} ${linkColorClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <Home className="w-4 h-4 mr-1" />
              Inicio
            </NavLink>
            
            <NavLink 
              to="/propiedades" 
              className={({isActive}) => `${linkBaseClasses} ${linkColorClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <Building2 className="w-4 h-4 mr-1" />
              Propiedades
            </NavLink>
            
            <NavLink 
              to="/blog" 
              className={({isActive}) => `${linkBaseClasses} ${linkColorClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Blog
            </NavLink>
            
            <NavLink 
              to="/nosotros" 
              className={({isActive}) => `${linkBaseClasses} ${linkColorClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <Users className="w-4 h-4 mr-1" />
              Nosotros
            </NavLink>
            
            <NavLink 
              to="/contacto" 
              className={({isActive}) => `${linkBaseClasses} ${linkColorClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <Phone className="w-4 h-4 mr-1" />
              Contacto
            </NavLink>
            

          </nav>

          {/* Contact Button */}
          <div className="hidden lg:block">
            <a 
              href="https://wa.me/525544488414" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`btn transition-all duration-300 ${
                isScrolled || !isHomePage ? 'btn-primary' : 'btn-white'
              }`}
            >
              Contáctanos
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md focus:outline-none transition-colors duration-300 z-10"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`h-6 w-6 transition-colors duration-300 ${
                isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'
              }`} />
            ) : (
              <Menu className={`h-6 w-6 transition-colors duration-300 ${
                isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'
              }`} />
            )}
          </button>
        </div>
      </header>
      {/* Mobile Menu SIEMPRE fuera del header */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeMenu}></div>
          <div className="absolute top-0 left-0 w-4/5 max-w-xs h-full bg-white shadow-lg flex flex-col">
            <div className="absolute top-0 right-0 p-4">
            </div>
            <nav className="h-full flex flex-col pt-20 pb-6 px-6 space-y-6">
              <NavLink 
                to="/" 
                className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600 transition-colors duration-200"
              >
                <Home className="w-5 h-5 mr-2" />
                Inicio
              </NavLink>
              
              <NavLink 
                to="/propiedades" 
                className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600 transition-colors duration-200"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Propiedades
              </NavLink>
              
              <NavLink 
                to="/blog" 
                className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600 transition-colors duration-200"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Blog
              </NavLink>
              
              <NavLink 
                to="/nosotros" 
                className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600 transition-colors duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                Nosotros
              </NavLink>
              
              <NavLink 
                to="/contacto" 
                className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600 transition-colors duration-200"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contacto
              </NavLink>
              
              <Link 
                to="/login" 
                className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600 border border-primary-800 rounded-md px-4 transition-colors duration-200"
              >
                <Lock className="w-5 h-5 mr-2" />
                Admin
              </Link>
              
              <div className="mt-auto">
                <a 
                  href="https://wa.me/525544488414" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  Contáctanos
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;