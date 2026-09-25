import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { sportsData } from '../data/sports';
import { gamesData } from '../data/games';
import GameCard from '../components/game/GameCard';

export default function LandingPage() {
  const [matchStep, setMatchStep] = useState(0);
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setMatchStep((prev) => (prev < 4 ? prev + 1 : 4)), 900);
    return () => clearInterval(timer);
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
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=900&auto=format&fit=crop"
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
            {sportsData.map((sport, index) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesData.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}