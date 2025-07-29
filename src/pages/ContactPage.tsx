import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import FadeInSection from '../components/ui/FadeInSection';

const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Contacto | Nova Hestia';
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.subject) newErrors.subject = 'El asunto es requerido';
    if (!formData.message.trim()) newErrors.message = 'El mensaje es requerido';
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // In a real app, this would submit the form data to a server
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setErrors({});
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    
    // Reset submission status after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="pt-20">
      {/* Page Header */}
      <div className="bg-primary-800 text-white py-12">
        <div className="container-custom">
          <FadeInSection>
            <div className="flex items-center mb-4">
              <Phone className="h-8 w-8 text-secondary-400 mr-3" />
              <h1 className="text-white">Contacto</h1>
            </div>
            <p className="text-white/80 max-w-3xl">
              Estamos aquí para ayudarte. Contáctanos para obtener más información sobre nuestros servicios
              o programar una cita con uno de nuestros asesores inmobiliarios.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <FadeInSection>
            <div>
              <h2 className="text-2xl font-semibold mb-6">Información de contacto</h2>
            
              {/* Contact Details */}
              <div className="space-y-6 mb-8">
                <FadeInSection delay={100}>
                  <div className="flex items-start">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-4 flex-shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Dirección</h4>
                      <p className="text-neutral-700">
                        José Azueta 29<br />
                        Colonia Avante<br />
                        Alcaldía Coyoacán, 04460<br />
                        Ciudad de México, CDMX
                      </p>
                    </div>
                  </div>
                </FadeInSection>
                
                <FadeInSection delay={200}>
                  <div className="flex items-start">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-4 flex-shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Teléfono</h4>
                      <p className="text-neutral-700">
                        <a href="tel:5544488414" className="hover:text-primary-600 transition-colors block">
                          55 4448 8414
                        </a>
                        <a href="https://wa.me/525544488414" className="hover:text-primary-600 transition-colors block">
                          WhatsApp: 55 4448 8414
                        </a>
                      </p>
                    </div>
                  </div>
                </FadeInSection>
                
                <FadeInSection delay={300}>
                  <div className="flex items-start">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-4 flex-shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Correo Electrónico</h4>
                      <p className="text-neutral-700">
                        <a href="mailto:contacto@novahestia.com" className="hover:text-primary-600 transition-colors block">
                          contacto@novahestia.com
                        </a>
                      </p>
                    </div>
                  </div>
                </FadeInSection>
              </div>
              
              {/* Business Hours */}
              <FadeInSection delay={400}>
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-3">Horario de atención</h4>
                  <div className="space-y-2 text-neutral-700">
                    <div className="flex justify-between">
                      <span>Lunes - Viernes:</span>
                      <span>9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado:</span>
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo:</span>
                      <span>Cerrado</span>
                    </div>
                  </div>
                </div>
              </FadeInSection>
              
              {/* Social Media */}
              <FadeInSection delay={500}>
                <div>
                  <h4 className="text-lg font-medium mb-3">Síguenos</h4>
                  <div className="flex space-x-4">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </FadeInSection>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <FadeInSection delay={200}>
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-6">Envíanos un mensaje</h2>
              
                {/* Success Message */}
                {isSubmitted && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    <p>¡Gracias por contactarnos! Te responderemos a la brevedad.</p>
                  </div>
                )}
              
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Tu nombre completo"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                  
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Correo electrónico <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="ejemplo@correo.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                  
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="Tu número telefónico"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>
                  
                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                        Asunto <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`select-field ${errors.subject ? 'border-red-500' : ''}`}
                      >
                        <option value="">Seleccionar asunto</option>
                        <option value="compra">Compra de propiedad</option>
                        <option value="venta">Venta de propiedad</option>
                        <option value="renta">Renta de propiedad</option>
                        <option value="informacion">Información general</option>
                        <option value="otro">Otro</option>
                      </select>
                      {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                    </div>
                  </div>
                
                  {/* Message */}
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`input-field ${errors.message ? 'border-red-500' : ''}`}
                      placeholder="¿En qué podemos ayudarte?"
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>
                
                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary w-full md:w-auto">
                    <Send className="h-5 w-5 mr-2" />
                    Enviar mensaje
                  </button>
                </form>
              </div>
            </FadeInSection>
          </div>
        </div>
        
        {/* Map */}
        <FadeInSection delay={400}>
          <div className="mt-12 rounded-lg overflow-hidden shadow-md h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.063645175919!2d-99.13227742418955!3d19.32304434416932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce01c412a0bfcd%3A0x2b4008f1d3c6d57e!2sJos%C3%A9%20Azueta%2029%2C%20Coapa%2C%20Avante%2C%20Coyoac%C3%A1n%2C%2004460%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1753750554431!5m2!1ses!2smx"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              title="Ubicación de Nova Hestia - José Azueta 29, Avante, Coyoacán"
            ></iframe>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
};

export default ContactPage;