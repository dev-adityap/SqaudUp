import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, MapPin, LogOut, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGames } from '../context/GamesContext';
import { useToast } from '../context/ToastContext';
import { SkeletonGrid, EmptyState, ErrorState } from '../components/ui/States';

export default function SpacesPage() {
  const { currentUser, profile, syncing } = useAuth();
  const { myGames, loading, error, refresh, isPending, leaveGame, meId } = useGames();
  const toast = useToast();

  const handleLeave = async (e, game) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await leaveGame(game._id);
    if (ok) toast.info(`You left ${game.title}.`);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-5xl font-display font-black text-white mb-2">MY SPACES.</h1>
      <p className="text-neutral-400 mb-8 font-semibold">Access your active match rosters and AI chat hubs.</p>

      {syncing ? (
        <SkeletonGrid count={3} />
      ) : loading ? (
        <SkeletonGrid count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGames.map((game) => {
            const pending = isPending(game._id);
            return (
              <div
                key={game._id}
                className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6 hover:border-[#ff5500] hover:shadow-lg hover:shadow-[#ff5500]/10 transition-all group"
              >
                <Link to={`/space/${game._id}`} className="block">
                  <div className="flex justify-between items-start mb-6">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-neutral-800 text-[#ff5500] mb-3 inline-block">
                        {game.sport}
                      </span>
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-[#ff5500] transition line-clamp-1">
                        {game.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{game.venue || 'Venue TBA'}</span>
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <div className="flex gap-3 text-xs font-bold text-neutral-400">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-500" /> {game.players?.length || 1}</span>
                    <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-blue-500" /> Chat</span>
                  </div>
                  <button
                    onClick={(e) => handleLeave(e, game)}
                    disabled={pending}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-neutral-700 text-neutral-400 hover:border-red-500/50 hover:text-red-400 transition disabled:opacity-50"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Leave
                  </button>
                </div>
              </div>
            );
          })}

          {myGames.length === 0 && (
            <EmptyState
              icon={Inbox}
              title="You haven't joined any games yet"
              description="Once you join a squad, its space and AI chat show up here."
              action={
                <Link to="/explore" className="inline-block bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold px-5 py-2.5 rounded-lg transition">
                  Find a Game
                </Link>
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
