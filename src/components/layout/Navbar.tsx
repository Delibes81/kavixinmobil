import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Building2, Users, Phone, Menu, X, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  const isHomePage = location.pathname === '/';
  const navbarClass = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled || !isHomePage
      ? 'bg-white shadow-md py-3'
      : 'bg-transparent py-5'
  }`;

  const linkClass = `relative flex items-center px-4 py-2 text-base font-medium transition-colors duration-200 ${
    isScrolled || !isHomePage ? 'text-primary-800 hover:text-primary-600' : 'text-white hover:text-secondary-300'
  }`;
  
  const activeLinkClass = `after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary-500 ${
    isScrolled || !isHomePage ? 'text-primary-600' : 'text-secondary-400'
  }`;

  const mobileMenuClass = `fixed inset-0 flex z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`;

  return (
    <header className={navbarClass}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Building2 className={`h-8 w-8 ${isScrolled || !isHomePage ? 'text-primary-600' : 'text-white'}`} />
          <span className={`ml-2 text-xl font-heading font-bold ${isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'}`}>
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
        </nav>

        {/* Contact Button */}
        <div className="hidden lg:block">
          <a 
            href="https://wa.me/5215512345678" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`btn ${isScrolled || !isHomePage ? 'btn-primary' : 'btn-white'}`}
          >
            Contáctanos
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-md focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className={`h-6 w-6 ${isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'}`} />
          ) : (
            <Menu className={`h-6 w-6 ${isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'}`} />
          )}
        </button>

        {/* Mobile Menu */}
        <div className={mobileMenuClass}>
          <div className="relative flex-1 bg-white">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={closeMenu}
                className="p-2 rounded-md text-primary-800 hover:text-primary-600 focus:outline-none"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="h-full flex flex-col pt-20 pb-6 px-6 space-y-6">
              <NavLink to="/" className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600">
                <Home className="w-5 h-5 mr-2" />
                Inicio
              </NavLink>
              <NavLink to="/propiedades" className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600">
                <Building2 className="w-5 h-5 mr-2" />
                Propiedades
              </NavLink>
              <NavLink to="/nosotros" className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600">
                <Users className="w-5 h-5 mr-2" />
                Nosotros
              </NavLink>
              <NavLink to="/contacto" className="flex items-center py-2 text-lg font-medium text-primary-800 hover:text-primary-600">
                <Phone className="w-5 h-5 mr-2" />
                Contacto
              </NavLink>
              <div className="mt-auto">
                <a 
                  href="https://wa.me/5215512345678" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  Contáctanos
                </a>
              </div>
            </nav>
          </div>
          <div onClick={closeMenu} className="flex-shrink-0 w-14 bg-black bg-opacity-50"></div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;