import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Bell, Menu } from 'lucide-react';
import MobileNav from './MobileNav';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'Live Games', path: '/games' },
    { label: 'Matchmaking', path: '/matchmaking' },
    { label: 'Players', path: '/players' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#08080a]/90 backdrop-blur-md border-b border-neutral-800/80 py-3 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff5500] rounded flex items-center justify-center font-display font-black text-white text-lg">
              S
            </div>
            <span className="font-display font-black text-2xl tracking-wider text-white">
              SQAUD<span className="text-[#ff5500]">UP</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-[#0f0f13]/80 p-1.5 rounded-full border border-neutral-800">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    active
                      ? 'bg-white text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/notifications"
              className="p-2 rounded-full border border-neutral-800 text-neutral-300 hover:text-white"
            >
              <Bell className="w-4 h-4" />
            </Link>
            <Link
              to="/create-game"
              className="flex items-center gap-2 bg-[#ff5500] hover:bg-[#ff6611] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded shadow-lg shadow-[#ff5500]/25 transition-all"
            >
              <Plus className="w-4 h-4" /> Create Game
            </Link>
            <Link to="/profile" className="pl-2 border-l border-neutral-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                alt="Profile"
                className="w-8 h-8 rounded-full border border-neutral-700 object-cover"
              />
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link to="/create-game" className="bg-[#ff5500] text-white p-2 rounded">
              <Plus className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-neutral-200 border border-neutral-800 rounded bg-neutral-900"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </>
  );
}   