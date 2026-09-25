import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import GameCard from '../components/game/GameCard';

// Hardcoded beautiful sports categories for the landing page grid
const liveSportsData = [
  { id: 'football', name: 'Football', activeGames: 34, image: 'https://images.unsplash.com/photo-1653332369957-bec2dd263112?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'cricket', name: 'Cricket', activeGames: 28, image: 'https://plus.unsplash.com/premium_photo-1721963696751-0e8c3ac42f9d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'basketball', name: 'Basketball', activeGames: 19, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop' },
  { id: 'badminton', name: 'Badminton', activeGames: 12, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200&auto=format&fit=crop' },
  { id: 'tennis', name: 'Tennis', activeGames: 8, image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1200&auto=format&fit=crop' },
];

export default function LandingPage() {
  const [matchStep, setMatchStep] = useState(0);
  const [liveGames, setLiveGames] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setMatchStep((prev) => (prev < 4 ? prev + 1 : 4)), 900);
    return () => clearInterval(timer);
  }, []);

  // Fetch the newly seeded games from MongoDB for the bottom section!
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games');
        const data = await response.json();
        const games = data.data || data || [];
        // Only show the first 3 games on the landing page to keep it clean
        setLiveGames(games.slice(0, 3)); 
      } catch (error) {
        console.error("Error fetching live games:", error);
      }
    };
    fetchGames();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 bg-gradient-to-b from-black via-[#08080a] to-[#0f0f13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold uppercase tracking-widest text-[#ff5500] mb-6">
                Matchmaking Platform
              </div>
              <h1 className="text-6xl sm:text-7xl xl:text-9xl font-display font-black leading-[0.88] text-white mb-6">
                NEVER<br />
                <span className="text-neutral-400">PLAY</span><br />
                <span className="text-[#ff5500]">SHORT.</span>
              </h1>
              <p className="text-lg text-neutral-300 max-w-lg mb-8">
                Your game is ready. You're just missing 1 or 2 players. Find verified local athletes based on reliability, distance, and skill level.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/explore" className="bg-[#ff5500] hover:bg-[#ff6611] text-white font-display text-lg tracking-wider px-8 py-4 rounded flex items-center gap-3">
                  Find A Game <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/create-game" className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-display text-lg tracking-wider px-8 py-4 rounded">
                  Host Squad
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-neutral-800 aspect-[4/5] bg-neutral-900 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1778608705821-0a699c0cfe48?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Sports action"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="py-20 bg-[#08080a] border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-6xl font-display font-black text-white mb-10">PLAY YOUR SPORT.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveSportsData.map((sport, index) => (
              <Link
                to={`/sports/${sport.id}`}
                key={sport.id}
                className={`relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 group ${
                  index === 0 || index === 3 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-square'
                }`}
              >
                <img src={sport.image} alt={sport.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-3xl font-bold text-white group-hover:text-[#ff5500] transition">{sport.name}</h3>
                    <p className="text-xs text-neutral-400">{sport.activeGames} active games</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-black border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-7xl font-display font-black text-white mb-8">
            10 PLAYERS.<br />8 CONFIRMED.<br /><span className="text-[#ff5500]">2 MISSING.</span>
          </h2>
          <div className="grid grid-cols-5 gap-3 max-w-xl mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="text-[10px] text-neutral-300">Slot {i + 1}</span>
              </div>
            ))}
            <div className="p-3 rounded bg-[#ff5500]/20 border border-[#ff5500] flex flex-col items-center animate-pulse">
              <span className="text-xs font-bold text-[#ff5500]">?</span>
              <span className="text-[10px] text-[#ff5500]">Open</span>
            </div>
            <div className="p-3 rounded bg-[#ff5500]/20 border border-[#ff5500] flex flex-col items-center animate-pulse">
              <span className="text-xs font-bold text-[#ff5500]">?</span>
              <span className="text-[10px] text-[#ff5500]">Open</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Games Near You */}
      <section className="py-20 bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-6xl font-display font-black text-white mb-10">GAMES NEAR YOU.</h2>
          
          {liveGames.length === 0 ? (
            <div className="text-neutral-500 font-bold">Loading live games...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveGames.map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}