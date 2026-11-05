import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layout/AdminLayout';

/** Layout del panel protegido por sesión (se carga bajo demanda). */
const ProtectedAdminLayout = () => (
  <ProtectedRoute>
    <AdminLayout />
  </ProtectedRoute>
);

export default ProtectedAdminLayout;
