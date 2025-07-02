import React from 'react';
import OptimizedSlider from '../ui/OptimizedSlider';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  return (
    <div className="mb-8">
      <OptimizedSlider
        images={images}
        title={title}
        showThumbnails={true}
        autoplay={false}
      />
    </div>
  );
};

export default PropertyGallery;