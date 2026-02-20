import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  userRole: string | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, userRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (!userRole || !allowedRoles.includes(userRole)) return <div>Access denied.</div>;
  return <>{children}</>;
};

export default ProtectedRoute;
