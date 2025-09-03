// src/components/PublicRoute.tsx
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';

function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/mentor/dashboard" state={{ from: location }} replace />;
  }

  return children;
}

export default PublicRoute;