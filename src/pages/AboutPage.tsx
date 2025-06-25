import React, { useEffect } from 'react';
import { Users, Award, Target, MapPin, Phone, Mail } from 'lucide-react';

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Nosotros | Nova Hestia';
  }, []);

  return (
    <div className="pt-20">
      {/* Page Header */}
      <div className="bg-primary-800 text-white py-12">
        <div className="container-custom">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-secondary-400 mr-3" />
            <h1 className="text-white">Nosotros</h1>
          </div>
          <p className="text-white/80 max-w-3xl">
            Conoce más sobre Nova Hestia, nuestra misión, visión y valores que nos distinguen en el mercado inmobiliario.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="mb-6">Nuestra Historia</h2>
            <p className="text-neutral-700 mb-4">
              Nova Hestia nació en 2010 con la visión de transformar la experiencia de comprar, vender y rentar propiedades en México. 
              Fundada por un grupo de profesionales apasionados por el sector inmobiliario, la empresa comenzó como una pequeña oficina 
              en la colonia Roma y ha crecido hasta convertirse en una de las inmobiliarias más reconocidas en la Ciudad de México.
            </p>
            <p className="text-neutral-700 mb-4">
              A lo largo de estos años, hemos ayudado a cientos de familias a encontrar el hogar de sus sueños y a 
              inversionistas a desarrollar proyectos exitosos. Nuestro conocimiento del mercado local, combinado con 
              un enfoque centrado en el cliente, nos ha permitido construir relaciones duraderas basadas en la confianza 
              y los resultados.
            </p>
            <p className="text-neutral-700">
              Hoy en día, Nova Hestia cuenta con un equipo de más de 50 profesionales altamente capacitados y una cartera diversa 
              de propiedades que abarca desde departamentos en zonas exclusivas hasta desarrollos comerciales y terrenos con 
              gran potencial.
            </p>
          </div>
          <div>
            <img 
              src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg" 
              alt="Equipo Nova Hestia" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>

        {/* Mission, Vision & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
              <Target className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Misión</h3>
            <p className="text-neutral-700">
              Brindar asesoría inmobiliaria integral y personalizada, conectando a las personas con 
              propiedades que satisfagan sus necesidades, a través de un servicio profesional, 
              transparente y de calidad que exceda las expectativas de nuestros clientes.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
              <Award className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Visión</h3>
            <p className="text-neutral-700">
              Ser la empresa inmobiliaria líder en México, reconocida por la excelencia en nuestros 
              servicios, la innovación en nuestros procesos y el compromiso con nuestros clientes, 
              colaboradores y la comunidad, generando relaciones de confianza a largo plazo.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Valores</h3>
            <ul className="text-neutral-700 space-y-2">
              <li>• Integridad y ética profesional</li>
              <li>• Excelencia en el servicio</li>
              <li>• Compromiso con el cliente</li>
              <li>• Transparencia en cada operación</li>
              <li>• Innovación constante</li>
              <li>• Trabajo en equipo</li>
            </ul>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="mb-4">Nuestro Equipo</h2>
            <p className="text-neutral-700 max-w-3xl mx-auto">
              Contamos con un equipo de profesionales altamente capacitados y con amplia experiencia 
              en el sector inmobiliario, comprometidos con brindarte el mejor servicio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg" 
                alt="Carlos Rodríguez" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h4 className="text-lg font-semibold mb-1">Carlos Rodríguez</h4>
                <p className="text-neutral-600 mb-3">Director General</p>
                <p className="text-neutral-700 text-sm">
                  Con más de 20 años de experiencia en el sector inmobiliario y financiero.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg" 
                alt="Ana García" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h4 className="text-lg font-semibold mb-1">Ana García</h4>
                <p className="text-neutral-600 mb-3">Directora Comercial</p>
                <p className="text-neutral-700 text-sm">
                  Especialista en marketing inmobiliario con enfoque en propiedades de lujo.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg" 
                alt="Roberto Méndez" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h4 className="text-lg font-semibold mb-1">Roberto Méndez</h4>
                <p className="text-neutral-600 mb-3">Asesor Senior</p>
                <p className="text-neutral-700 text-sm">
                  Experto en inversiones inmobiliarias y desarrollo de proyectos.
                </p>
              </div>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg" 
                alt="Laura Sánchez" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h4 className="text-lg font-semibold mb-1">Laura Sánchez</h4>
                <p className="text-neutral-600 mb-3">Asesora Legal</p>
                <p className="text-neutral-700 text-sm">
                  Abogada especializada en derecho inmobiliario y contratos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="mb-4">Nuestros Servicios</h2>
            <p className="text-neutral-700 max-w-3xl mx-auto">
              En Nova Hestia ofrecemos una amplia gama de servicios inmobiliarios diseñados para satisfacer 
              todas tus necesidades, ya sea que busques comprar, vender o rentar una propiedad.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Compra de Propiedades</h3>
              <p className="text-neutral-700 mb-4">
                Te acompañamos en todo el proceso de compra, desde la búsqueda de la propiedad ideal hasta 
                el cierre de la operación. Nuestros asesores te guiarán en cada paso, asegurando que tomes 
                la mejor decisión para tus necesidades y presupuesto.
              </p>
              <ul className="text-neutral-700 space-y-1">
                <li>• Búsqueda personalizada</li>
                <li>• Visitas a propiedades</li>
                <li>• Asesoría en negociación</li>
                <li>• Acompañamiento legal</li>
              </ul>
            </div>
            
            {/* Service 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Venta de Propiedades</h3>
              <p className="text-neutral-700 mb-4">
                Maximizamos el valor de tu propiedad a través de estrategias de marketing efectivas y una 
                red amplia de compradores potenciales. Nos encargamos de todos los detalles para que el 
                proceso de venta sea rápido, seguro y al mejor precio posible.
              </p>
              <ul className="text-neutral-700 space-y-1">
                <li>• Valuación profesional</li>
                <li>• Fotografía y marketing digital</li>
                <li>• Gestión de visitas</li>
                <li>• Negociación y cierre</li>
              </ul>
            </div>
            
            {/* Service 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Renta de Propiedades</h3>
              <p className="text-neutral-700 mb-4">
                Facilitamos el proceso de renta tanto para propietarios como para inquilinos. Nuestro servicio 
                integral incluye desde la promoción de la propiedad hasta la gestión del contrato, asegurando 
                una experiencia sin complicaciones para ambas partes.
              </p>
              <ul className="text-neutral-700 space-y-1">
                <li>• Estudio de inquilinos</li>
                <li>• Contratos seguros</li>
                <li>• Administración de propiedades</li>
                <li>• Gestión de mantenimiento</li>
              </ul>
            </div>
            
            {/* Service 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Asesoría Legal</h3>
              <p className="text-neutral-700 mb-4">
                Nuestro equipo legal especializado te brinda la tranquilidad que necesitas en todas tus 
                operaciones inmobiliarias. Nos encargamos de revisar y gestionar toda la documentación 
                legal, garantizando que cada transacción se realice conforme a la ley.
              </p>
              <ul className="text-neutral-700 space-y-1">
                <li>• Revisión de escrituras</li>
                <li>• Elaboración de contratos</li>
                <li>• Trámites notariales</li>
                <li>• Asesoría fiscal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="mb-4">Contáctanos</h2>
            <p className="text-neutral-700 max-w-3xl mx-auto">
              ¿Tienes preguntas o necesitas más información sobre nuestros servicios? 
              Nuestro equipo está listo para atenderte.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
                <MapPin className="h-7 w-7" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Dirección</h4>
              <p className="text-neutral-700">
                José Azueta 29<br />
                Colonia Avante<br />
                Alcaldía Coyoacán, 04460<br />
                Ciudad de México, CDMX
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
                <Phone className="h-7 w-7" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Teléfono</h4>
              <p className="text-neutral-700">
                <a href="tel:+525544488414" className="hover:text-primary-600 transition-colors">
                  +52 55 4448 8414
                </a>
                <br />
                <a href="https://wa.me/525544488414" className="hover:text-primary-600 transition-colors">
                  WhatsApp: +52 55 4448 8414
                </a>
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
                <Mail className="h-7 w-7" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Correo Electrónico</h4>
              <p className="text-neutral-700">
                <a href="mailto:info@novahestia.com" className="hover:text-primary-600 transition-colors">
                  info@novahestia.com
                </a>
                <br />
                <a href="mailto:ventas@novahestia.com" className="hover:text-primary-600 transition-colors">
                  ventas@novahestia.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;