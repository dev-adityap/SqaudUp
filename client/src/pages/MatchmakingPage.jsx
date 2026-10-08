import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Crosshair, ShieldAlert } from 'lucide-react';
import SwipeCards from '../components/matchmaking/SwipeCards';
import LiveRadar from '../components/ui/LiveRadar';
import { useGames } from '../context/GamesContext';

export default function MatchmakingPage() {
  const { games, loading, error, joinGame, refresh } = useGames();
  const [isScanning, setIsScanning] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsScanning(true);
  }, []);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      
      {/* Sleeker Header */}
      <div className="mb-12 border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-display font-black text-white tracking-tight mb-2">SPEED DRILL.</h1>
          <p className="text-neutral-400">Rapid-fire local matchmaking. Swipe to secure your spot.</p>
        </div>
      </div>

      {/* NEW: 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: The Deck (Takes up 8 of 12 columns) */}
        <div className="lg:col-span-8 relative">
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#ff5500] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
          
          {loading || isScanning ? (
            <div className="h-[600px] flex items-center justify-center">
              <LiveRadar onComplete={() => setIsScanning(false)} />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mt-20 font-bold">{error}</div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-500">
              <SwipeCards games={games} onJoin={joinGame} onRefresh={refresh} />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: The Command Center (Takes up 4 of 12 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Panel */}
          <div className="bg-[#0f0f13] border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-white font-bold mb-6 flex items-center gap-3 text-sm uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
              Live Scanner
            </h3>
            
            {/* The Fixed Search Again Button */}
            <button 
              onClick={() => navigate('/explore')}
              className="w-full flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-white rounded-xl transition-all group mb-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                <div className="text-left">
                  <p className="font-bold text-sm">Change Filters</p>
                  <p className="text-xs text-neutral-500">Search for a different sport</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center group-hover:bg-[#ff5500] transition-colors">
                <span className="text-lg leading-none transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </button>
          </div>

          {/* Pro Tips Panel */}
          <div className="bg-black border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-neutral-500 font-bold mb-5 text-xs uppercase tracking-widest">Scouting Rules</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-neutral-300">
                <Zap className="w-5 h-5 text-[#ff5500] flex-shrink-0" />
                <span><strong className="text-white">Swipe Right</strong> to immediately send a join request to the host.</span>
              </li>
              <li className="flex gap-3 text-sm text-neutral-300">
                <Crosshair className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                <span><strong className="text-white">Swipe Left</strong> to pass. The algorithm will learn your preferences over time.</span>
              </li>
              <li className="flex gap-3 text-sm text-neutral-300">
                <ShieldAlert className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>All matches shown are verified and within a 25km radius of your location.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}