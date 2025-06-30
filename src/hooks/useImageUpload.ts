import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  const uploadImages = async (files: File[], propertyId?: string): Promise<string[]> => {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    setUploading(true);
    const uploadedUrls: string[] = [];
    const progressArray: UploadProgress[] = files.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    
    setUploadProgress(progressArray);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`El archivo ${file.name} no es una imagen válida`);
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error(`El archivo ${file.name} es demasiado grande. Máximo 5MB permitido.`);
        }

        // Generate unique file name
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `${timestamp}_${randomString}.${fileExt}`;
        
        // Create file path
        const filePath = propertyId 
          ? `properties/${propertyId}/${fileName}`
          : `properties/temp/${fileName}`;

        // Update progress
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { ...item, progress: 10 } : item
        ));

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          throw new Error(`Error uploading ${file.name}: ${error.message}`);
        }

        // Update progress
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { ...item, progress: 80 } : item
        ));

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
          throw new Error(`Error getting public URL for ${file.name}`);
        }

        uploadedUrls.push(urlData.publicUrl);

        // Update progress to completed
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { 
            ...item, 
            progress: 100, 
            status: 'completed' as const,
            url: urlData.publicUrl 
          } : item
        ));
      }

      return uploadedUrls;
    } catch (error) {
      // Update progress for failed uploads
      setUploadProgress(prev => prev.map(item => 
        item.status === 'uploading' ? {
          ...item,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Error desconocido'
        } : item
      ));
      
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'property-images');
      
      if (bucketIndex === -1) {
        throw new Error('Invalid image URL');
      }
      
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      
      const { error } = await supabase.storage
        .from('property-images')
        .remove([filePath]);

      if (error) {
        throw new Error(`Error deleting image: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  };

  const clearProgress = () => {
    setUploadProgress([]);
  };

  return {
    uploadImages,
    deleteImage,
    uploading,
    uploadProgress,
    clearProgress,
  };
};