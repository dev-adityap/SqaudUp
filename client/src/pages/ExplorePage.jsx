import { useNavigate } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import { Search, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameCard from '../components/game/GameCard';
import { useGames } from '../context/GamesContext';
import { SkeletonGrid, EmptyState, ErrorState } from '../components/ui/States';
import { countBySport, matchesSport } from '../utils/sport';
import footballImg from '../assets/football.png';
import cricketImg from '../assets/cricket.png';
import basketballImg from '../assets/basketball.png';
import badmintonImg from '../assets/badminton.png';
import tennisImg from '../assets/tennis.png';

const sportCategories = [
  { name: 'Football', activeGames: 34, image: footballImg, accent: '#ff5500' },
  { name: 'Cricket', activeGames: 28, image: cricketImg, accent: '#ffffff' },
  { name: 'Basketball', activeGames: 19, image: basketballImg, accent: '#ffffff' },
  { name: 'Badminton', activeGames: 12, image: badmintonImg, accent: '#ff5500' },
  { name: 'Tennis', activeGames: 8, image: tennisImg, accent: '#ffffff' },
];

const SPORTS = ['All', ...sportCategories.map((s) => s.name)];

export default function ExplorePage() {
  const navigate = useNavigate();
  const { games, loading, error, refresh, meId } = useGames();

  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [query, setQuery] = useState('');

  const upcomingDates = useMemo(() => {
    const dates = [{ label: 'All Dates', value: 'All' }];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const value = d.toISOString().slice(0, 10);
      let label;
      if (i === 0) label = 'Today';
      else if (i === 1) label = 'Tomorrow';
      else label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dates.push({ label, value });
    }
    return dates;
  }, []);

  // The banner advertises these counts, so drive them from live data instead of
  // showing a number the database may not agree with. Case-insensitive.
  const categoryCounts = useMemo(
    () => countBySport(games, sportCategories),
    [games]
  );

  const filtered = useMemo(() => games.filter((g) => {
    const matchSport = selectedSport === 'All' || matchesSport(g, selectedSport);
    const q = query.trim().toLowerCase();
    const matchQuery = !q
      || g.title?.toLowerCase().includes(q)
      || g.venue?.toLowerCase().includes(q);
    const dbDate = g.date?.substring(0, 10);
    const matchDate = selectedDate === 'All' || dbDate === selectedDate;
    return matchSport && matchQuery && matchDate;
  }), [games, selectedSport, selectedDate, query]);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-display font-black text-white mb-6">FIND YOUR NEXT GAME.</h1>

      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sportCategories.map((sport) => {
            const count = categoryCounts[sport.name] ?? 0;
            const isActive = selectedSport === sport.name;
            return (
              <button
                key={sport.name}
                type="button"
                onClick={() => navigate(`/sports/${sport.name.toLowerCase()}`)}
                className={`group relative h-64 rounded-2xl overflow-hidden text-left border cursor-pointer transition ${
                  isActive ? 'border-[#ff5500] ring-2 ring-[#ff5500]' : 'border-neutral-800'
                } focus:outline-none focus:ring-2 focus:ring-[#ff5500]`}
              >
                <img
                  src={sport.image}
                  alt={sport.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight" style={{ color: sport.accent }}>
                      {sport.name}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {count} active game{count === 1 ? '' : 's'}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 mb-1 flex-shrink-0 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search venue or match title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#0f0f13] border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff5500]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {SPORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSport(s)}
              className={`flex-shrink-0 px-4 py-3 md:py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                selectedSport === s ? 'bg-white text-black' : 'bg-[#0f0f13] text-neutral-400 border border-neutral-800 hover:border-neutral-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <Calendar className="w-5 h-5 text-neutral-500 flex-shrink-0 mr-1" />
        {upcomingDates.map((d) => (
          <button
            key={d.value}
            onClick={() => setSelectedDate(d.value)}
            className={`flex-shrink-0 px-5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              selectedDate === d.value
                ? 'bg-[#ff5500] text-white border-[#ff5500]'
                : 'bg-[#0f0f13] text-neutral-400 border-neutral-800 hover:border-neutral-600'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((game) => <GameCard key={game._id} game={game} />)}

          {filtered.length === 0 && (
            <EmptyState
              icon={Trophy}
              title={games.length === 0 ? 'No games posted yet' : 'No games match your filters'}
              description={
                games.length === 0
                  ? 'Be the first to host a match and get the squad rolling.'
                  : 'Try a different sport, date, or clear your search.'
              }
              action={
                games.length === 0 ? (
                  <Link to="/create-game" className="inline-block bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold px-5 py-2.5 rounded-lg transition">
                    Host a Game
                  </Link>
                ) : (
                  <button
                    onClick={() => { setQuery(''); setSelectedSport('All'); setSelectedDate('All'); }}
                    className="inline-block bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-5 py-2.5 rounded-lg transition cursor-pointer"
                  >
                    Clear filters
                  </button>
                )
              }
            />
          )}
        </div>
      )}
    </div>
  );
}