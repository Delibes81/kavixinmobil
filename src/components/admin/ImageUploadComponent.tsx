import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useImageUpload, UploadProgress } from '../../hooks/useImageUpload';

interface ImageUploadComponentProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  propertyId?: string;
  maxImages?: number;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  images,
  onImagesChange,
  propertyId,
  maxImages = 10
}) => {
  const { uploadImages, deleteImage, uploading, uploadProgress, clearProgress } = useImageUpload();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (images.length + fileArray.length > maxImages) {
      setError(`Solo puedes subir un máximo de ${maxImages} imágenes. Actualmente tienes ${images.length}.`);
      return;
    }

    setError(null);
    clearProgress();

    try {
      const uploadedUrls = await uploadImages(fileArray, propertyId);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir las imágenes');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Try to delete from storage (don't block if it fails)
    await deleteImage(imageUrl);
    
    // Remove from local state
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Current Images */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-3">
            Imágenes actuales ({images.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md border border-neutral-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Eliminar imagen"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-700">Progreso de subida:</p>
          {uploadProgress.map((progress, index) => (
            <div key={index} className="bg-neutral-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-700 truncate">{progress.fileName}</span>
                <div className="flex items-center">
                  {progress.status === 'uploading' && (
                    <Loader className="h-4 w-4 text-primary-600 animate-spin mr-2" />
                  )}
                  {progress.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  )}
                  {progress.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  )}
                  <span className="text-xs text-neutral-600">{progress.progress}%</span>
                </div>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress.status === 'error' ? 'bg-red-500' :
                    progress.status === 'completed' ? 'bg-green-500' : 'bg-primary-600'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>
              {progress.error && (
                <p className="text-xs text-red-600 mt-1">{progress.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-2">
            Subir nuevas imágenes {images.length > 0 && `(${maxImages - images.length} restantes)`}
          </p>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              disabled={uploading}
            />
            
            <div className="flex flex-col items-center">
              <Upload className={`h-10 w-10 mb-2 ${dragActive ? 'text-primary-600' : 'text-neutral-400'}`} />
              <p className="text-neutral-600 mb-1">
                {dragActive
                  ? 'Suelta las imágenes aquí'
                  : 'Arrastra y suelta las imágenes aquí o haz clic para buscar'
                }
              </p>
              <p className="text-xs text-neutral-500">
                PNG, JPG, WEBP hasta 5MB cada una
              </p>
              {uploading && (
                <p className="text-xs text-primary-600 mt-2">Subiendo imágenes...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Consejos para mejores resultados:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Usa imágenes de alta calidad (mínimo 1200x800 píxeles)</li>
              <li>La primera imagen será la imagen principal de la propiedad</li>
              <li>Incluye fotos del exterior, interior y amenidades</li>
              <li>Evita imágenes borrosas o con poca iluminación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadComponent;