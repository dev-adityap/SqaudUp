import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar } from 'lucide-react';
import GameCard from '../components/game/GameCard';

export default function ExplorePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [query, setQuery] = useState('');

  const sportsFilter = ['All', 'Football', 'Cricket', 'Basketball', 'Badminton', 'Tennis', 'Volleyball'];

  // Dynamically generate a fresh set of dates starting from "Today"
  const upcomingDates = useMemo(() => {
    const dates = [{ label: 'All Dates', value: 'All' }];
    const today = new Date();
    
    // Generate the next 14 days
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      
      // Format to match MongoDB string (YYYY-MM-DD)
      const value = nextDate.toISOString().split('T')[0];
      
      let label = '';
      if (i === 0) label = 'Today';
      else if (i === 1) label = 'Tomorrow';
      else {
        // Formats as "Sun, Sep 27"
        label = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      }
      
      dates.push({ label, value });
    }
    return dates;
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
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
    
    fetchGames();
  }, []);

  // Filter by Sport, Search Query, AND the newly selected Date
  const filtered = games.filter((g) => {
    const matchSport = selectedSport === 'All' || g.sport?.toLowerCase() === selectedSport.toLowerCase();
    const matchQuery = g.title?.toLowerCase().includes(query.toLowerCase()) || 
                       g.venue?.toLowerCase().includes(query.toLowerCase());
    
    // Extract just the YYYY-MM-DD part from the database date string safely
    const dbDate = g.date?.substring(0, 10);
    const matchDate = selectedDate === 'All' || dbDate === selectedDate;
    
    return matchSport && matchQuery && matchDate;
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-display font-black text-white mb-6">FIND YOUR NEXT GAME.</h1>
      
      {/* Top Row: Search & Sport Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
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
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {sportsFilter.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSport(s)}
              className={`flex-shrink-0 px-4 py-3 md:py-2 rounded-xl text-xs font-bold uppercase transition ${
                selectedSport === s ? 'bg-white text-black' : 'bg-[#0f0f13] text-neutral-400 border border-neutral-800 hover:border-neutral-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* New Row: Dynamic Date Selection Carousel */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <Calendar className="w-5 h-5 text-neutral-500 flex-shrink-0 mr-1" />
        {upcomingDates.map((d) => (
          <button
            key={d.value}
            onClick={() => setSelectedDate(d.value)}
            className={`flex-shrink-0 px-5 py-2 rounded-xl text-xs font-bold transition border ${
              selectedDate === d.value 
                ? 'bg-[#ff5500] text-white border-[#ff5500]' 
                : 'bg-[#0f0f13] text-neutral-400 border-neutral-800 hover:border-neutral-600'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Game Feed Grid */}
      {loading ? (
         <div className="text-[#ff5500] text-center mt-10 font-bold">Fetching live games...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
          
          {/* Empty State if no games exist for that specific date/sport combo */}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-neutral-800 rounded-2xl bg-[#0f0f13]/50">
              <p className="text-neutral-400 font-semibold mb-2">No spaces available for this date.</p>
              <p className="text-sm text-neutral-500">Try selecting a different date or be the first to host a match!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}