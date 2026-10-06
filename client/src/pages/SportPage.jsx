import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import GameCard from '../components/game/GameCard';
import { useGames } from '../context/GamesContext';
import { SkeletonGrid, EmptyState, ErrorState } from '../components/ui/States';
import { matchesSport, titleCaseSport } from '../utils/sport';

export default function SportPage() {
  const { sport } = useParams();
  const { games, loading, error, refresh } = useGames();

  // Case-insensitive: "badminton" in the URL must match "Badminton" in the DB.
  const filtered = useMemo(() => games.filter((g) => matchesSport(g, sport)), [games, sport]);
  const label = titleCaseSport(sport);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 w-fit transition">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="text-5xl font-display font-black text-white uppercase mb-2">{label} GAMES</h1>
      <p className="text-neutral-400 mb-10 font-semibold">
        {loading ? 'Finding matches...' : `${filtered.length} open ${label} ${filtered.length === 1 ? 'match' : 'matches'} near you.`}
      </p>

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
              title={`No live ${label} games right now`}
              description={`Be the first to host a ${label.toLowerCase()} match.`}
              action={
                <Link to="/create-game" className="inline-block bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold px-5 py-2.5 rounded-lg transition">
                  Host a {label} Game
                </Link>
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
