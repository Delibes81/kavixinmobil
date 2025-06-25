import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, User, DollarSign, Clock, Eye, PenSquare } from 'lucide-react';
import { PropertyService } from '../../services/propertyService';
import { Property } from '../../types';

const AdminDashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Panel de Administración | Nova Hestia';
    
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await PropertyService.getProperties();
        setProperties(data);
      } catch (error: any) {
        console.error('Error fetching properties:', error);
        setError(error.message || 'Error al cargar las propiedades');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Calculate stats from actual data
  const stats = {
    totalProperties: properties.length,
    activeListings: properties.length,
    pendingReviews: 0, // This would come from a contacts/reviews table
    totalUsers: 5, // This would come from user profiles table
    propertySales: {
      venta: properties.filter(p => p.operation === 'venta').length,
      renta: properties.filter(p => p.operation === 'renta').length,
    },
    propertyTypes: {
      casa: properties.filter(p => p.type === 'casa').length,
      departamento: properties.filter(p => p.type === 'departamento').length,
      local: properties.filter(p => p.type === 'local').length,
      terreno: properties.filter(p => p.type === 'terreno').length,
    },
  };

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-800 mb-2">Panel de Administración</h1>
        <p className="text-neutral-600">
          Bienvenido al sistema de gestión de Nova Hestia. Aquí puedes administrar propiedades y más.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-4">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-neutral-600 text-sm">Total de Propiedades</p>
              <h3 className="text-2xl font-semibold">{stats.totalProperties}</h3>
            </div>
          </div>
          <div className="text-sm text-neutral-600">
            <span className="text-green-600 font-medium">Activas</span> en el sistema
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-neutral-600 text-sm">Propiedades Activas</p>
              <h3 className="text-2xl font-semibold">{stats.activeListings}</h3>
            </div>
          </div>
          <div className="text-sm text-neutral-600">
            <span className="text-green-600 font-medium">Disponibles</span> para mostrar
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-neutral-600 text-sm">En Venta</p>
              <h3 className="text-2xl font-semibold">{stats.propertySales.venta}</h3>
            </div>
          </div>
          <div className="text-sm text-neutral-600">
            <span className="text-blue-600 font-medium">Propiedades</span> en venta
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-4">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-neutral-600 text-sm">En Renta</p>
              <h3 className="text-2xl font-semibold">{stats.propertySales.renta}</h3>
            </div>
          </div>
          <div className="text-sm text-neutral-600">
            <span className="text-purple-600 font-medium">Propiedades</span> en renta
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Distribution Charts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">Distribución de Propiedades</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Operation Distribution */}
              <div>
                <h4 className="text-lg font-medium mb-4">Por Operación</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-neutral-700">Venta</span>
                      <span className="text-neutral-700">{stats.propertySales.venta}</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-600 rounded-full" 
                        style={{ width: `${stats.totalProperties > 0 ? (stats.propertySales.venta / stats.totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-neutral-700">Renta</span>
                      <span className="text-neutral-700">{stats.propertySales.renta}</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary-500 rounded-full" 
                        style={{ width: `${stats.totalProperties > 0 ? (stats.propertySales.renta / stats.totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Type Distribution */}
              <div>
                <h4 className="text-lg font-medium mb-4">Por Tipo</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-neutral-700">Casa</span>
                      <span className="text-neutral-700">{stats.propertyTypes.casa}</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${stats.totalProperties > 0 ? (stats.propertyTypes.casa / stats.totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-neutral-700">Departamento</span>
                      <span className="text-neutral-700">{stats.propertyTypes.departamento}</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${stats.totalProperties > 0 ? (stats.propertyTypes.departamento / stats.totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-neutral-700">Local</span>
                      <span className="text-neutral-700">{stats.propertyTypes.local}</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${stats.totalProperties > 0 ? (stats.propertyTypes.local / stats.totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-neutral-700">Terreno</span>
                      <span className="text-neutral-700">{stats.propertyTypes.terreno}</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${stats.totalProperties > 0 ? (stats.propertyTypes.terreno / stats.totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Properties */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Propiedades Recientes</h3>
              <Link to="/admin/propiedades" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Ver todas
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : properties.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Propiedad
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Operación
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {properties.slice(0, 5).map((property) => (
                      <tr key={property.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'} 
                                alt={property.title} 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900 line-clamp-1">{property.title}</div>
                              <div className="text-xs text-neutral-500">{property.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">
                            {new Intl.NumberFormat('es-MX', {
                              style: 'currency',
                              currency: 'MXN',
                              maximumFractionDigits: 0,
                            }).format(property.price)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            property.operation === 'venta' 
                              ? 'bg-primary-100 text-primary-800' 
                              : 'bg-secondary-100 text-secondary-800'
                          }`}>
                            {property.operation === 'venta' ? 'Venta' : 'Renta'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {property.created_at ? new Date(property.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link to={`/propiedades/${property.id}`} className="text-primary-600 hover:text-primary-900">
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link to={`/admin/propiedades/${property.id}`} className="text-neutral-600 hover:text-neutral-900">
                              <PenSquare className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600">No hay propiedades disponibles</p>
                <Link to="/admin/propiedades/nueva" className="btn btn-primary mt-4">
                  Agregar primera propiedad
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">Acciones Rápidas</h3>
            
            <div className="space-y-4">
              <Link 
                to="/admin/propiedades/nueva" 
                className="btn btn-primary w-full justify-center"
              >
                Agregar nueva propiedad
              </Link>
              
              <Link 
                to="/admin/propiedades" 
                className="btn btn-outline w-full justify-center"
              >
                Gestionar propiedades
              </Link>
            </div>
          </div>
          
          {/* Activity Log */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6">Actividad Reciente</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Sistema</p>
                  <p className="text-xs text-neutral-500">Conexión a Supabase establecida</p>
                  <p className="text-xs text-neutral-400 mt-1">Hace 1 hora</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
                  <PenSquare className="h-5 w-5 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Administrador</p>
                  <p className="text-xs text-neutral-500">Configuración actualizada</p>
                  <p className="text-xs text-neutral-400 mt-1">Hace 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Sistema</p>
                  <p className="text-xs text-neutral-500">Base de datos sincronizada</p>
                  <p className="text-xs text-neutral-400 mt-1">Hace 3 horas</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Administrador</p>
                  <p className="text-xs text-neutral-500">Panel de administración iniciado</p>
                  <p className="text-xs text-neutral-400 mt-1">Hace 4 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;