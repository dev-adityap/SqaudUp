import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGames } from '../../context/GamesContext';

const SPORT_IMAGES = {
  football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1293&auto=format&fit=crop',
  cricket: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop',
  badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop',
  tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop',
  volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600&auto=format&fit=crop',
};

const getSportImage = (sport) =>
  SPORT_IMAGES[sport?.toLowerCase()] || SPORT_IMAGES.football;

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { isJoined, isHost, joinGame, leaveGame, isPending } = useGames();

  const joined = isJoined(game);
  const hosting = isHost(game);
  const pending = isPending(game._id);

  // Real numbers from the server, not a client-side guess.
  const maxPlayers = game.maxPlayers || 10;
  const filled = Math.max(1, game.players?.length || 0);
  const spotsOpen = Math.max(0, maxPlayers - filled);
  const progressPercent = Math.min(100, Math.round((filled / maxPlayers) * 100));

  const requireAuthThen = () => {
    if (!currentUser) {
      navigate('/auth', { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (!requireAuthThen()) return;
    if (joined && !hosting) {
      await leaveGame(game._id);
    } else {
      await joinGame(game._id);
    }
  };

  const goToSpace = (e) => {
    e.preventDefault();
    if (!requireAuthThen()) return;
    navigate(`/space/${game._id}`);
  };

  return (
    <div className="bg-[#0f0f13] rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between h-full">
      <div className="relative h-44 w-full overflow-hidden bg-neutral-900 shrink-0">
        <img
          src={getSportImage(game.sport)}
          alt={game.sport || 'Game'}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-black/50" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-black/70 text-white border border-white/10">
            {game.sport}
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-black/70 text-neutral-300">
            {game.skillLevel || 'Casual'}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="bg-[#08080a]/90 px-2.5 py-1 rounded border border-neutral-700 text-white font-bold">
            {spotsOpen} spots open
          </span>
          <span className="text-neutral-400">{filled} / {maxPlayers} IN</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#ff5500]" />
            <span>{game.date?.substring(0, 10)} • {game.startTime || 'TBA'}</span>
          </div>
          <Link to={`/games/${game._id}`}>
            <h3 className="font-display text-lg text-white hover:text-[#ff5500] transition line-clamp-1">
              {game.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="truncate">{game.venue || 'Venue TBA'}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800">
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden mb-4">
            <div className="bg-[#ff5500] h-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={goToSpace}
              className="text-[11px] text-neutral-400 hover:text-white transition font-semibold"
            >
              View Space →
            </button>
            <button
              onClick={handleAction}
              disabled={pending || (hosting && !joined)}
              title={hosting ? 'You are hosting this game' : undefined}
              className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                hosting
                  ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  : joined
                    ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                    : 'bg-[#ff5500] text-white hover:bg-[#ff6611]'
              }`}
            >
              {pending && <Loader2 className="w-3 h-3 animate-spin" />}
              {hosting ? 'Hosting' : joined ? 'Joined ✓' : 'Join Game'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
