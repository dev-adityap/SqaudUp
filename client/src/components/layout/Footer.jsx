import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-800 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <span className="font-display font-black text-3xl tracking-wider text-white">
              SQAUD<span className="text-[#ff5500]">UP</span>
            </span>
            <p className="mt-3 text-sm text-neutral-400 max-w-sm">
              "Never play short." Find verified local players with high reliability to complete your squad instantly.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link to="/explore" className="hover:text-white transition">Explore</Link></li>
              <li><Link to="/matchmaking" className="hover:text-white transition">Matchmaking</Link></li>
              <li><Link to="/players" className="hover:text-white transition">Players</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-4">Reliability</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every profile carries an attendance score. High reliability unlocks priority squad placements.
            </p>
          </div>
        </div>
        <div className="border-t border-neutral-900 pt-6 flex justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} SQAUDUP. All rights reserved.</p>
          <p className="font-mono text-[10px]">PHASE 1 ENGINE</p>
        </div>
      </div>
    </footer>
  );
}