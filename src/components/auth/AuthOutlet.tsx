import { Outlet } from 'react-router';
import { AuthProvider } from '../../contexts/AuthContext';

/** Proveedor de autenticación solo para /login y /admin (se carga bajo demanda). */
const AuthOutlet = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export default AuthOutlet;
