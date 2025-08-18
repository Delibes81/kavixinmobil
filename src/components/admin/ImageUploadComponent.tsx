import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Loader, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
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

  // Image reordering functions
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleImageDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleImageDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    // Reorder images
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged image from its original position
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    const adjustedDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(adjustedDropIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(null);
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    onImagesChange(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    onImagesChange(newImages);
  };

  const moveToFirst = (index: number) => {
    if (index === 0) return;
    
    const newImages = [...images];
    const imageToMove = newImages.splice(index, 1)[0];
    newImages.unshift(imageToMove);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Current Images with Reordering */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-neutral-700">
              Imágenes actuales ({images.length}/{maxImages})
            </p>
            <div className="text-xs text-neutral-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              💡 Arrastra las imágenes para reordenarlas
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={`${image}-${index}`}
                className={`relative group bg-white rounded-lg border-2 transition-all duration-200 ${
                  dragOverIndex === index 
                    ? 'border-primary-500 bg-primary-50 scale-105' 
                    : 'border-neutral-200 hover:border-neutral-300'
                } ${
                  draggedIndex === index ? 'opacity-50 scale-95' : ''
                }`}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragEnd={handleImageDragEnd}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragLeave={handleImageDragLeave}
                onDrop={(e) => handleImageDrop(e, index)}
              >
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  
                  {/* Primary Image Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                      Principal
                    </div>
                  )}
                  
                  {/* Image Number */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                    title="Eliminar imagen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Controls */}
                <div className="p-3 bg-neutral-50 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    {/* Drag Handle */}
                    <div className="flex items-center text-neutral-500 cursor-move">
                      <GripVertical className="h-4 w-4 mr-1" />
                      <span className="text-xs">Arrastra para reordenar</span>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex items-center space-x-1">
                      {/* Move to First */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveToFirst(index)}
                          className="p-1 text-neutral-500 hover:text-primary-600 transition-colors"
                          title="Mover al inicio (imagen principal)"
                        >
                          <span className="text-xs font-bold">1°</span>
                        </button>
                      )}
                      
                      {/* Move Up */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImageUp(index)}
                          className="p-1 text-neutral-500 hover:text-primary-600 transition-colors"
                          title="Mover hacia arriba"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                      )}
                      
                      {/* Move Down */}
                      {index < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImageDown(index)}
                          className="p-1 text-neutral-500 hover:text-primary-600 transition-colors"
                          title="Mover hacia abajo"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Reordering Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Cómo reordenar las imágenes:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>Arrastra y suelta:</strong> Mantén presionado y arrastra una imagen a su nueva posición</li>
                  <li><strong>Botones de control:</strong> Usa las flechas para mover una posición arriba/abajo</li>
                  <li><strong>Imagen principal:</strong> Usa el botón "1°" para mover cualquier imagen al inicio</li>
                  <li><strong>Orden importante:</strong> La primera imagen será la imagen principal de la propiedad</li>
                </ul>
              </div>
            </div>
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
              <li><strong>La primera imagen será la imagen principal</strong> de la propiedad</li>
              <li>Incluye fotos del exterior, interior y amenidades</li>
              <li>Evita imágenes borrosas o con poca iluminación</li>
              <li>Puedes reordenar las imágenes arrastrándolas o usando los botones de control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadComponent;