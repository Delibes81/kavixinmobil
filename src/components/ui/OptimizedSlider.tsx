import React, { useState, useCallback, useMemo } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LazyImage from './LazyImage';

interface OptimizedSliderProps {
  images: string[];
  title: string;
  className?: string;
  showThumbnails?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
}

const OptimizedSlider: React.FC<OptimizedSliderProps> = ({
  images,
  title,
  className = '',
  showThumbnails = true,
  autoplay = false,
  autoplaySpeed = 5000
}) => {
  const [mainSlider, setMainSlider] = useState<Slider | null>(null);
  const [thumbnailSlider, setThumbnailSlider] = useState<Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSettings = useMemo(() => ({
    dots: false,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    adaptiveHeight: false,
    autoplay: autoplay && images.length > 1,
    autoplaySpeed,
    pauseOnHover: true,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    lazyLoad: 'ondemand' as const,
  }), [images.length, autoplay, autoplaySpeed]);

  const thumbnailSettings = useMemo(() => ({
    dots: false,
    infinite: images.length > 5,
    speed: 500,
    slidesToShow: Math.min(5, images.length),
    slidesToScroll: 1,
    swipeToSlide: true,
    focusOnSelect: true,
    arrows: false,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(4, images.length),
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, images.length),
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(2, images.length),
        }
      }
    ]
  }), [images.length]);

  const handlePrevious = useCallback(() => {
    mainSlider?.slickPrev();
  }, [mainSlider]);

  const handleNext = useCallback(() => {
    mainSlider?.slickNext();
  }, [mainSlider]);

  const handleThumbnailPrev = useCallback(() => {
    thumbnailSlider?.slickPrev();
  }, [thumbnailSlider]);

  const handleThumbnailNext = useCallback(() => {
    thumbnailSlider?.slickNext();
  }, [thumbnailSlider]);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-neutral-200 rounded-lg h-[500px] flex items-center justify-center ${className}`}>
        <p className="text-neutral-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main Gallery */}
      <div className="relative rounded-lg overflow-hidden mb-3">
        <div className="aspect-[16/9] bg-neutral-100">
          <Slider 
            ref={setMainSlider}
            {...mainSettings}
            asNavFor={thumbnailSlider || undefined}
            className="h-full"
          >
            {images.map((image, index) => (
              <div key={index} className="outline-none h-full">
                <div className="h-[500px] w-full">
                  <LazyImage
                    src={image}
                    alt={`${title} - Imagen ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
        
        {/* Navigation arrows - only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors duration-200 focus:outline-none"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors duration-200 focus:outline-none"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
          {currentSlide + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails - only show if more than 1 image and showThumbnails is true */}
      {images.length > 1 && showThumbnails && (
        <div className="relative">
          <div className="px-10">
            <Slider
              ref={setThumbnailSlider}
              {...thumbnailSettings}
              asNavFor={mainSlider || undefined}
              className="thumbnail-slider"
            >
              {images.map((image, index) => (
                <div key={index} className="px-1 outline-none">
                  <div 
                    className={`gallery-thumbnail h-20 cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 ${
                      currentSlide === index 
                        ? 'border-primary-500 opacity-100' 
                        : 'border-transparent opacity-70 hover:opacity-90'
                    }`}
                  >
                    <LazyImage
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          
          {/* Thumbnail navigation arrows - only show if more thumbnails than visible */}
          {images.length > 5 && (
            <>
              <button
                onClick={handleThumbnailPrev}
                className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-neutral-100 focus:outline-none"
                aria-label="Miniaturas anteriores"
              >
                <ChevronLeft className="h-5 w-5 text-primary-600" />
              </button>
              <button
                onClick={handleThumbnailNext}
                className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-neutral-100 focus:outline-none"
                aria-label="Siguientes miniaturas"
              >
                <ChevronRight className="h-5 w-5 text-primary-600" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OptimizedSlider;