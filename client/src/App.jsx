import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SpacesPage from './pages/SpacesPage';
import GameSpacePage from './pages/GameSpacePage';
import LiveGamesPage from './pages/LiveGamesPage';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import GameDetailsPage from './pages/GameDetailsPage';
import CreateGamePage from './pages/CreateGamePage';
import MatchmakingPage from './pages/MatchmakingPage';
import PlayersPage from './pages/PlayersPage';
import SportPage from './pages/SportPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col justify-between">
        <Navbar />
        <main className="grow">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/games" element={<LiveGamesPage />} />
            <Route path="/games/:id" element={<GameDetailsPage />} />
            <Route path="/matchmaking" element={<MatchmakingPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/sports/:sport" element={<SportPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* PROTECTED ROUTES */}
            <Route 
              path="/create-game" 
              element={
                <ProtectedRoute>
                  <CreateGamePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/space/:id" 
              element={
                <ProtectedRoute>
                  <GameSpacePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/spaces" 
              element={
                <ProtectedRoute>
                  <SpacesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}