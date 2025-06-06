import React, { useState } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [mainSlider, setMainSlider] = useState<Slider | null>(null);
  const [thumbnailSlider, setThumbnailSlider] = useState<Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

  const thumbnailSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    focusOnSelect: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  };

  return (
    <div className="mb-8">
      {/* Main Gallery */}
      <div className="relative rounded-lg overflow-hidden mb-3 aspect-[16/9]">
        <Slider 
          ref={(slider) => setMainSlider(slider)}
          {...mainSettings}
          asNavFor={thumbnailSlider || undefined}
        >
          {images.map((image, index) => (
            <div key={index} className="outline-none">
              <img 
                src={image} 
                alt={`${title} - Imagen ${index + 1}`} 
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </div>
          ))}
        </Slider>
        
        {/* Navigation arrows */}
        <button
          onClick={() => mainSlider?.slickPrev()}
          className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors duration-200 focus:outline-none"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => mainSlider?.slickNext()}
          className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors duration-200 focus:outline-none"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
          {currentSlide + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="px-10 relative">
        <Slider
          ref={(slider) => setThumbnailSlider(slider)}
          {...thumbnailSettings}
          asNavFor={mainSlider || undefined}
        >
          {images.map((image, index) => (
            <div key={index} className="px-1 outline-none">
              <div 
                className={`gallery-thumbnail h-20 ${currentSlide === index ? 'active' : ''}`}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover rounded-md cursor-pointer"
                />
              </div>
            </div>
          ))}
        </Slider>
        
        <button
          onClick={() => thumbnailSlider?.slickPrev()}
          className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-neutral-100 focus:outline-none"
          aria-label="Previous thumbnails"
        >
          <ChevronLeft className="h-5 w-5 text-primary-600" />
        </button>
        <button
          onClick={() => thumbnailSlider?.slickNext()}
          className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-neutral-100 focus:outline-none"
          aria-label="Next thumbnails"
        >
          <ChevronRight className="h-5 w-5 text-primary-600" />
        </button>
      </div>
    </div>
  );
};

export default PropertyGallery;