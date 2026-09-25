import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { gamesData } from '../data/games';
import GameCard from '../components/game/GameCard';

export default function ExplorePage() {
  const [selectedSport, setSelectedSport] = useState('All');
  const [query, setQuery] = useState('');

  const sportsFilter = ['All', 'Football', 'Cricket', 'Basketball'];

  const filtered = gamesData.filter((g) => {
    const matchSport = selectedSport === 'All' || g.sport.toLowerCase() === selectedSport.toLowerCase();
    const matchQuery = g.title.toLowerCase().includes(query.toLowerCase()) || g.location.toLowerCase().includes(query.toLowerCase());
    return matchSport && matchQuery;
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-display font-black text-white mb-6">FIND YOUR NEXT GAME.</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search venue or neighborhood..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#0f0f13] border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff5500]"
          />
        </div>
        <div className="flex gap-2">
          {sportsFilter.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSport(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                selectedSport === s ? 'bg-white text-black' : 'bg-[#0f0f13] text-neutral-400 border border-neutral-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}