import React, { useState } from 'react';
import Slider from 'react-slick';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  rating: number;
  image: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, position, rating, image }) => {
  return (
    <div className="px-4 py-8">
      <div className="card p-8 h-full flex flex-col">
        <div className="flex-1">
          {/* Rating */}
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < rating ? 'text-secondary-500 fill-secondary-500' : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
          
          {/* Quote */}
          <blockquote className="text-lg text-neutral-700 italic mb-6">
            "{quote}"
          </blockquote>
        </div>
        
        {/* Author */}
        <div className="flex items-center mt-4">
          <img
            src={image}
            alt={author}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <p className="font-medium text-primary-800">{author}</p>
            <p className="text-sm text-neutral-600">{position}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [sliderRef, setSliderRef] = useState<Slider | null>(null);

  const testimonials = [
    {
      quote: "El equipo de PropMax fue excepcional en todo momento. Encontraron exactamente lo que buscábamos y nos guiaron en cada paso del proceso de compra. Totalmente recomendables.",
      author: "Carlos Méndez",
      position: "Comprador",
      rating: 5,
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
    },
    {
      quote: "Vendí mi departamento en tiempo récord y al precio que esperaba gracias a la estrategia de marketing que implementaron. Su profesionalismo y conocimiento del mercado hicieron toda la diferencia.",
      author: "Ana García",
      position: "Vendedora",
      rating: 5,
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
    },
    {
      quote: "Llevan administrando mi propiedad en renta por más de 3 años y nunca he tenido problemas. Se encargan de todo y me mantienen informado constantemente.",
      author: "Roberto Juárez",
      position: "Propietario",
      rating: 4,
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
    },
    {
      quote: "Como inversionista inmobiliario, valoro mucho la transparencia y eficiencia de PropMax. Su asesoría me ha permitido expandir mi portafolio de propiedades con excelentes resultados.",
      author: "Laura Sánchez",
      position: "Inversionista",
      rating: 5,
      image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-neutral-600">
            Nuestro mayor orgullo es la satisfacción de nuestros clientes. Conoce sus experiencias con PropMax.
          </p>
        </div>

        <div className="relative">
          <Slider ref={setSliderRef} {...settings}>
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </Slider>
          
          {/* Custom navigation buttons */}
          <button
            onClick={() => sliderRef?.slickPrev()}
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-5 z-10 bg-white rounded-full p-2 shadow-md hover:bg-neutral-100 focus:outline-none hidden md:block"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-primary-600" />
          </button>
          <button
            onClick={() => sliderRef?.slickNext()}
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-5 z-10 bg-white rounded-full p-2 shadow-md hover:bg-neutral-100 focus:outline-none hidden md:block"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-primary-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;