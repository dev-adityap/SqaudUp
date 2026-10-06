import React from 'react';
import { Navigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

// The full settings menu now lives on the Profile page, so this route
// redirects instead of showing a dead "Mock State" panel.
export default function SettingsPage() {
  return <Navigate to="/profile" replace />;
}