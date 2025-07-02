import { useEffect, useState } from 'react';

interface UseImagePreloaderOptions {
  images: string[];
  priority?: boolean;
}

export const useImagePreloader = ({ images, priority = false }: UseImagePreloaderOptions) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!images.length) {
      setIsLoading(false);
      return;
    }

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    const preloadImages = async () => {
      try {
        if (priority) {
          // Load first image immediately, then others
          if (images[0]) {
            await preloadImage(images[0]);
          }
          
          // Load remaining images in background
          const remainingImages = images.slice(1);
          Promise.allSettled(remainingImages.map(preloadImage));
        } else {
          // Load all images
          await Promise.allSettled(images.map(preloadImage));
        }
      } catch (error) {
        console.warn('Error preloading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [images, priority]);

  return {
    loadedImages,
    isLoading,
    isImageLoaded: (src: string) => loadedImages.has(src)
  };
};