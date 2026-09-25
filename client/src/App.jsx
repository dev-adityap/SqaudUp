import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

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
    <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/games" element={<ExplorePage />} />
          <Route path="/games/:id" element={<GameDetailsPage />} />
          <Route path="/create-game" element={<CreateGamePage />} />
          <Route path="/matchmaking" element={<MatchmakingPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/sports/:sport" element={<SportPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}