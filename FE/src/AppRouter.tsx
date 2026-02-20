import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BrandDashboard from './BrandDashboard';
import CreatorDashboard from './CreatorDashboard';
import ProtectedRoute from './ProtectedRoute';
import { useUserRole } from './useUserRole';
import { useAuth } from './auth';

const AppRouter: React.FC = () => {
  const { user } = useAuth();
  const { role, loading } = useUserRole();

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/brand"
          element={
            <ProtectedRoute allowedRoles={["brand"]} userRole={role}>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator"
          element={
            <ProtectedRoute allowedRoles={["creator"]} userRole={role}>
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            user ? (
              role === 'brand' ? <Navigate to="/brand" replace /> :
              role === 'creator' ? <Navigate to="/creator" replace /> :
              <div>Unknown role.</div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
