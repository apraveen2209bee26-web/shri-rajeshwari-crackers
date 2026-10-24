import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import Loader from '../ui/Loader';

const ProtectedRoute = ({ roles, redirectTo = '/login' }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loader label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate replace to={redirectTo} />;
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate replace to={user?.role === 'admin' ? '/admin' : '/'} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

