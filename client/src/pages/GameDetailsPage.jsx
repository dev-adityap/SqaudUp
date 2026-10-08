import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Info, Activity, ArrowLeft, Loader2, LogOut, Users } from 'lucide-react';
import WeatherBadge from '../components/WeatherBadge';
import { useAuth } from '../context/AuthContext';
import { useGames } from '../context/GamesContext';
import { Spinner, ErrorState } from '../components/ui/States';
import SquadBoard from '../components/squad/SquadBoard';
import ReviewModal from '../components/game/ReviewModal';
import { API_BASE } from '../utils/api';

const sportImages = {
  football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
  cricket: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop',
  badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop',
  tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop',
  volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop',
};

const getDisplayImage = (game) =>
  game.image || sportImages[game.sport?.toLowerCase()] || sportImages.football;

export default function GameDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile, syncing } = useAuth();
  const { games, loading, error, refresh, isJoined, isHost, joinGame, leaveGame, isPending } = useGames();

  const game = games.find((g) => g._id === id) || null;
  const [fullGame, setFullGame] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // The list endpoint returns bare ObjectIds; the detail endpoint populates the
  // sanitised public roster (username/avatar/reliability only).
  useEffect(() => {
    let cancelled = false;
    const loadDetail = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/games/${id}`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (!cancelled) setFullGame(data.data);
      } catch {
        // Non-fatal: the page still renders from list data.
      }
    };
    if (id) loadDetail();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (fullGame && games.length) {
      // Keep local list in step with detail data.
      const exists = games.some((g) => g._id === fullGame._id);
      if (!exists) refresh({ silent: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullGame]);

  if (loading) return <Spinner label="Loading match details..." />;
  if (error) return <div className="pt-28 max-w-3xl mx-auto"><ErrorState message={error} onRetry={refresh} /></div>;
  if (!game) {
    return (
      <div className="pt-28 max-w-3xl mx-auto px-4">
        <ErrorState message="This match no longer exists or has been removed." onRetry={refresh} />
        <div className="text-center -mt-8">
          <Link to="/explore" className="text-[#ff5500] font-bold text-sm hover:underline">Back to Explore</Link>
        </div>
      </div>
    );
  }

  const joined = isJoined(game);
  const hosting = isHost(game);
  const pending = isPending(game._id);

  // Real roster counts, never a random number.
  const maxSlots = game.maxPlayers || 10;
  const filled = Math.max(1, game.players?.length || 0);
  const spotsOpen = Math.max(0, maxSlots - filled);
  const fillPercentage = Math.min(100, (filled / maxSlots) * 100);

  const requireAuthThen = () => {
    if (!currentUser) {
      navigate('/auth', { state: { from: `/games/${id}` } });
      return false;
    }
    return true;
  };

  const handleReviewClick = () => {
    if (!requireAuthThen()) return;
    if (fullGame && fullGame.players && fullGame.players.length > 0) {
      setShowReviewModal(true);
    }
  };

  const handleReviewComplete = () => {
    refresh();
    navigate('/explore');
  };

  const handlePrimaryAction = async () => {
    if (!requireAuthThen()) return;
    if (hosting && (game.reviewStatus !== 'completed' && game.status !== 'COMPLETED')) {
      handleReviewClick();
      return;
    }
    if (joined && !hosting) {
      await leaveGame(game._id);
      return;
    }
    if (!joined) {
      await joinGame(game._id);
    }
  };

  const buttonLabel = hosting
    ? (game.reviewStatus === 'completed' || game.status === 'COMPLETED'
        ? 'MATCH REVIEWED'
        : 'COMPLETE & REVIEW MATCH')
    : joined
      ? 'LEAVE SQUAD'
      : spotsOpen === 0
        ? 'GAME IS FULL'
        : 'JOIN SQUAD';

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 w-fit transition">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="w-full h-72 md:h-[450px] rounded-3xl overflow-hidden mb-8 shadow-2xl border border-neutral-800">
        <img
          src={getDisplayImage(game)}
          alt={game.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">{game.title}</h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="bg-neutral-800 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-700 text-[#ff5500]">
                  {game.sport}
                </span>
                <span className="bg-neutral-800 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-700 text-neutral-300 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> {game.skillLevel || 'Casual'}
                </span>
              </div>
            </div>
            <WeatherBadge location="Kolkata" />
          </div>

          <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="text-white font-bold flex items-center gap-2 text-lg">
              <Info className="w-5 h-5 text-[#ff5500]" /> About This Match
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {game.description ||
                `Join us for an epic game of ${game.sport}! Bring adequate hydration and arrive 15 minutes early to warm up.`}
            </p>
          </div>

         <SquadBoard sport={game.sport} />

          {fullGame?.players?.length > 0 && (
            <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-white font-bold flex items-center gap-2 text-lg mb-5">
                <Users className="w-5 h-5 text-[#ff5500]" /> Squad ({fullGame.players.length}/{maxSlots})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fullGame.players.map((p) => (
                  <div key={p._id} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    {p.avatar ? (
                      <img src={p.avatar} alt="" className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold text-[#ff5500]">
                        {(p.username || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-white font-semibold truncate">@{p.username}</p>
                      <p className="text-xs text-neutral-500">
                        {p.reliabilityScore}% reliability{p.gamesPlayed ? ` • ${p.gamesPlayed} games` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f0f13] border border-neutral-800 rounded-3xl p-6 sticky top-28 shadow-2xl">
            <div className="space-y-5 mb-8">
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800"><Calendar className="w-5 h-5 text-[#ff5500]" /></div>
                <span className="text-sm font-semibold">{game.date}</span>
              </div>
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800"><Clock className="w-5 h-5 text-[#ff5500]" /></div>
                <span className="text-sm font-semibold">{game.startTime || 'TBA'}</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((game.venue || 'Kolkata') + ' Kolkata')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-neutral-300 hover:text-white transition group cursor-pointer"
              >
                <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800 group-hover:border-[#ff5500] transition-colors"><MapPin className="w-5 h-5 text-[#ff5500]" /></div>
                <span className="text-sm font-semibold hover:underline">{game.venue || 'Venue TBA'}</span>
              </a>
            </div>

            <div className="border-t border-neutral-800 pt-6 mb-6">
              <p className="text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wider">Squad Fill</p>
              <div className="flex justify-between items-end mb-3">
                <span className="text-4xl font-display font-black text-white leading-none">{filled}</span>
                <span className="text-sm font-bold text-neutral-500 mb-1">/ {maxSlots}</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff5500] to-orange-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${fillPercentage}%` }} />
              </div>
            </div>

            {syncing && (
              <p className="text-xs text-neutral-500 mb-3">Syncing your profile...</p>
            )}

            <button
              onClick={handlePrimaryAction}
              disabled={pending || (hosting && (game.reviewStatus === 'completed' || game.status === 'COMPLETED')) || (!hosting && spotsOpen === 0)}
              className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all flex justify-center items-center gap-2
                ${hosting && (game.reviewStatus !== 'completed' && game.status !== 'COMPLETED')
                  ? 'bg-[#ff5500] text-white hover:bg-[#ff6611] hover:shadow-lg hover:shadow-[#ff5500]/30 hover:scale-[1.02] active:scale-[0.98]'
                  : hosting
                  ? 'bg-neutral-900 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                  : joined && !hosting
                  ? 'bg-neutral-900 text-neutral-300 border border-neutral-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40'
                  : 'bg-[#ff5500] text-white hover:bg-[#ff6611] hover:shadow-lg hover:shadow-[#ff5500]/30 hover:scale-[1.02] active:scale-[0.98]'}
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              `}
            >
              {pending && <Loader2 className="w-5 h-5 animate-spin" />}
              {buttonLabel}
            </button>

            {(joined || hosting) && (
              <button
                onClick={() => navigate(`/space/${game._id}`)}
                className="mt-3 w-full py-3 rounded-xl bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition inline-flex items-center justify-center gap-2"
              >
                Open Squad Space
              </button>
            )}

            {showReviewModal && (
              <ReviewModal
                game={fullGame || game}
                token={currentUser?.stsTokenManager?.accessToken}
                onComplete={handleReviewComplete}
                onClose={() => setShowReviewModal(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
