import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAdminRoute }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'Admin';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/404-notfound" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;