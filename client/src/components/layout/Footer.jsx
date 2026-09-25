import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-800 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Column 1: Brand (Span 3) */}
          <div className="lg:col-span-3">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#ff5500] rounded flex items-center justify-center font-display font-black text-white text-lg">
                S
              </div>
              <span className="font-display font-black text-2xl tracking-wider text-white">
                SQAUD<span className="text-[#ff5500]">UP</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              "Never play short." Find verified local athletes with high reliability scores to complete your squad instantly.
            </p>
          </div>

          {/* Column 2: The Story (Span 4) */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">The Origin Story</h4>
            <p className="text-neutral-400 text-sm leading-relaxed">
              SquadUp was built out of pure frustration. I was tired of wanting to play, but having to cancel because I couldn't find enough homies to field a team. This platform bridges that gap. Join a space, squad up with locals who share your passion, and get in the game. 
            </p>
          </div>

          {/* Column 3: Navigation (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link to="/explore" className="hover:text-[#ff5500] transition">Explore Games</Link></li>
              <li><Link to="/spaces" className="hover:text-[#ff5500] transition">My Spaces</Link></li>
              <li><Link to="/matchmaking" className="hover:text-[#ff5500] transition">Matchmaking</Link></li>
              <li><Link to="/players" className="hover:text-[#ff5500] transition">Top Players</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Engine (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Connect</h4>
            <a 
              href="mailto:adityapanna009@gmail.com" 
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-[#ff5500] transition mb-8"
            >
              <Mail className="w-4 h-4 text-[#ff5500]" /> adityapanna009@gmail.com
            </a>
            
            <div className="p-4 rounded-xl bg-[#0f0f13] border border-neutral-800">
              <span className="block text-xs font-bold text-white mb-1">RELIABILITY ENGINE</span>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Every profile carries an attendance score. High reliability unlocks priority squad placements.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 SQAUDUP. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition">Terms of Service</Link>
            <span className="font-mono text-neutral-600 ml-4">PHASE 1 ENGINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}