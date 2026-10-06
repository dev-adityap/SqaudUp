import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../Logo';

export default function Navbar() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'EXPLORE', path: '/explore' },
    { name: 'LIVE GAMES', path: '/games' },
    { name: 'SPACES', path: '/spaces' },
    { name: 'MATCHMAKING', path: '/matchmaking' },
    { name: 'PLAYERS', path: '/players' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        
        {/* Logo */}
        <Logo size="md" />

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 bg-[#0f0f13] border border-neutral-800 p-1 rounded-full">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider transition ${
                location.pathname.includes(link.path)
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

     {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="text-neutral-400 hover:text-white transition relative">
            <Bell className="w-5 h-5" />
            {/* Optional: Adds a cool little orange unread dot if a user is logged in! */}
            {currentUser && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff5500] rounded-full border-2 border-black"></span>
            )}
          </Link>
          
          <Link to="/create-game" className="hidden sm:flex items-center gap-2 bg-[#ff5500] hover:bg-[#ff6611] text-white px-4 py-2 rounded font-bold text-xs tracking-wider transition">
            <Plus className="w-4 h-4" /> CREATE GAME
          </Link>

          {/* Dynamic Avatar Link to Profile Page */}
          {currentUser ? (
            <Link to="/profile" className="w-10 h-10 rounded-full border border-neutral-700 overflow-hidden hover:border-[#ff5500] transition shrink-0 ml-2">
              <img 
                src={currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </Link>
          ) : (
            <Link to="/auth" className="text-xs font-bold text-neutral-400 hover:text-white ml-2">SIGN IN</Link>
          )}
        </div>
      </div>
    </nav>
  );
}