import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/States';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Without this, a signed-out visitor hitting /spaces sees a blank frame for
  // the moment Firebase takes to resolve, then bounces to /auth.
  if (loading) {
    return <Spinner label="Checking your session..." />;
  }

  if (!currentUser) {
    // Remember where they were headed so sign-in can return them there.
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export function GuestOnlyRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Loading..." />;
  // Already signed in: skip the login screen and honour the saved destination.
  if (currentUser) {
    return <Navigate to={location.state?.from || '/explore'} replace />;
  }
  return children;
}
