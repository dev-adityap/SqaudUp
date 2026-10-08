import React from 'react';
import AthleteProfile from './pages/AthleteProfile';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GamesProvider } from './context/GamesContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute, { GuestOnlyRoute } from './components/layout/ProtectedRoute';
import { EmptyState } from './components/ui/States';
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
import Leaderboard from './pages/Leaderboard';
import SportPage from './pages/SportPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';

const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

function NotFound() {
  return (
    <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center">
      <p className="text-7xl font-display font-black text-[#ff5500] mb-4">404</p>
      <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
      <p className="text-neutral-400 mb-8">That route does not exist.</p>
      <Link
        to="/explore"
        className="inline-block bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold px-6 py-3 rounded-lg transition"
      >
        Back to Explore
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <GamesProvider>
          <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col justify-between">
            <Navbar />
            <main className="grow">
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/games" element={<LiveGamesPage />} />
                <Route path="/games/:id" element={<GameDetailsPage />} />
                <Route path="/players" element={<Leaderboard />} />
                <Route path="/sports/:sport" element={<SportPage />} />
                <Route
                  path="/login"
                  element={<GuestOnlyRoute><AuthPage mode="login" /></GuestOnlyRoute>}
                />
                <Route
                  path="/register"
                  element={<GuestOnlyRoute><AuthPage mode="register" /></GuestOnlyRoute>}
                />
                <Route path="/auth" element={<GuestOnlyRoute><AuthPage /></GuestOnlyRoute>} />

                {/* PROTECTED ROUTES */}
                <Route path="/matchmaking" element={protect(<MatchmakingPage />)} />
                <Route path="/create-game" element={protect(<CreateGamePage />)} />
                <Route path="/space/:id" element={protect(<GameSpacePage />)} />
                <Route path="/spaces" element={protect(<SpacesPage />)} />
                <Route path="/notifications" element={protect(<NotificationsPage />)} />
                <Route path="/profile" element={protect(<ProfilePage />)} />
                <Route path="/settings" element={protect(<SettingsPage />)} />
                <Route path="/profile/:id" element={<AthleteProfile />} />

                {/* CATCH-ALL so a bad URL never renders a blank page */}
                <Route
                  path="*"
                  element={
                    <EmptyState
                      icon={null}
                      title="Page not found"
                      description="That route does not exist."
                      action={
                        <Link to="/explore" className="inline-block bg-[#ff5500] text-white font-bold px-5 py-2.5 rounded-lg">
                          Back to Explore
                        </Link>
                      }
                    />
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </GamesProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
