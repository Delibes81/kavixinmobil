import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, Filter, Plus, Eye, PenSquare, Trash2, MoreHorizontal } from 'lucide-react';
import { properties } from '../../data/properties';
import { Property } from '../../types';

const AdminProperties: React.FC = () => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [searchTerm, setSearchTerm] = useState('');
  const [operationFilter, setOperationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Gestionar Propiedades | Nova Hestia';
  }, []);

  useEffect(() => {
    let result = [...properties];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(property => 
        property.title.toLowerCase().includes(term) ||
        property.description.toLowerCase().includes(term) ||
        property.location.calle.toLowerCase().includes(term) ||
        property.location.colonia.toLowerCase().includes(term) ||
        property.location.alcaldia.toLowerCase().includes(term)
      );
    }
    
    // Apply operation filter
    if (operationFilter) {
      result = result.filter(property => property.operation === operationFilter);
    }
    
    // Apply type filter
    if (typeFilter) {
      result = result.filter(property => property.type === typeFilter);
    }
    
    setFilteredProperties(result);
  }, [searchTerm, operationFilter, typeFilter]);

  // Format price to Mexican Pesos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format address for display
  const formatAddress = (location: Property['location']) => {
    const parts = [];
    if (location.calle) parts.push(location.calle);
    if (location.numero) parts.push(location.numero);
    if (location.colonia) parts.push(location.colonia);
    
    return parts.join(', ');
  };

  const handleDeleteProperty = (id: string) => {
    // In a real app, this would delete the property from the database
    // For this demo, we'll just filter it out from the UI
    setFilteredProperties(filteredProperties.filter(property => property.id !== id));
    setSelectedProperty(null);
  };

  const toggleDropdown = (id: string) => {
    setSelectedProperty(selectedProperty === id ? null : id);
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-primary-800 text-white py-8">
        <div className="container-custom">
          <div className="flex items-center mb-4">
            <Building2 className="h-8 w-8 text-secondary-400 mr-3" />
            <h1 className="text-white">Gestionar Propiedades</h1>
          </div>
          <p className="text-white/80">
            Administra todas las propiedades de tu inventario en un solo lugar.
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="w-full md:w-auto">
            <Link 
              to="/admin/propiedades/nueva" 
              className="btn btn-primary w-full md:w-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva propiedad
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar propiedades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={operationFilter}
                onChange={(e) => setOperationFilter(e.target.value)}
                className="select-field w-full md:w-auto"
              >
                <option value="">Todas las operaciones</option>
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="select-field w-full md:w-auto"
              >
                <option value="">Todos los tipos</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="local">Local</option>
                <option value="terreno">Terreno</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Operación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img className="h-12 w-12 rounded-md object-cover" src={property.images[0]} alt={property.title} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900 line-clamp-1">{property.title}</div>
                            <div className="text-xs text-neutral-500">ID: {property.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900 line-clamp-1">{formatAddress(property.location)}</div>
                        <div className="text-xs text-neutral-500">{property.location.alcaldia}, {property.location.estado}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          {formatPrice(property.price)}
                          {property.operation === 'renta' && <span className="text-xs font-normal text-neutral-600">/mes</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          property.operation === 'venta' 
                            ? 'bg-primary-100 text-primary-800' 
                            : 'bg-secondary-100 text-secondary-800'
                        }`}>
                          {property.operation === 'venta' ? 'Venta' : 'Renta'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-neutral-900">
                          {property.type === 'casa' ? 'Casa' : 
                           property.type === 'departamento' ? 'Departamento' : 
                           property.type === 'local' ? 'Local' : 'Terreno'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <Link 
                            to={`/propiedades/${property.id}`} 
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                            title="Ver propiedad"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link 
                            to={`/admin/propiedades/${property.id}`} 
                            className="text-neutral-600 hover:text-neutral-900 transition-colors"
                            title="Editar propiedad"
                          >
                            <PenSquare className="h-5 w-5" />
                          </Link>
                          <div className="relative">
                            <button 
                              onClick={() => toggleDropdown(property.id)}
                              className="text-neutral-500 hover:text-neutral-700 transition-colors"
                              title="Más opciones"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                            
                            {selectedProperty === property.id && (
                              <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleDeleteProperty(property.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 flex items-center"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar propiedad
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                      <Filter className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600 font-medium">No se encontraron propiedades</p>
                      <p className="text-neutral-500 text-sm mt-1">Intenta con otros filtros o añade una nueva propiedad</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredProperties.length > 0 && (
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <div className="text-sm text-neutral-700">
                Mostrando <span className="font-medium">{filteredProperties.length}</span> propiedades
              </div>
              
              <div className="flex space-x-1">
                <button className="px-3 py-1 rounded-md border border-neutral-300 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Anterior
                </button>
                <button className="px-3 py-1 rounded-md bg-primary-600 text-white">
                  1
                </button>
                <button className="px-3 py-1 rounded-md border border-neutral-300 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProperties;