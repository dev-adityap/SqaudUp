import React, { useState, useEffect } from 'react';
import GameCard from '../components/game/GameCard';
import { Calendar, Trophy, History } from 'lucide-react';

export default function LiveGamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Fetching from the same database, but in the future we will filter this 
    // to only show games YOU joined or created!
    const fetchMyGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games');
        const data = await response.json();
        setGames(data.data || data || []);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyGames();
  }, []);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-display font-black text-white">MY DASHBOARD.</h1>
      </div>

      {/* Custom Tabs for the Live Games Interface */}
      <div className="flex gap-4 border-b border-neutral-800 mb-8 pb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition whitespace-nowrap ${activeTab === 'upcoming' ? 'bg-[#ff5500] text-white' : 'text-neutral-500 hover:text-white'}`}
        >
          <Calendar className="w-4 h-4" /> Upcoming Matches
        </button>
        <button 
          onClick={() => setActiveTab('hosting')}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition whitespace-nowrap ${activeTab === 'hosting' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
        >
          <Trophy className="w-4 h-4" /> Games I'm Hosting
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition whitespace-nowrap ${activeTab === 'history' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
        >
          <History className="w-4 h-4" /> History
        </button>
      </div>

      {loading ? (
        <div className="text-neutral-400 font-bold">Loading your schedule...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* For now, it maps the fetched games. Later we add filtering logic per tab! */}
          {games.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
          
          {games.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
              You haven't joined any games yet. Go to Explore to find a match!
            </div>
          )}
        </div>
      )}
    </div>
  );
}