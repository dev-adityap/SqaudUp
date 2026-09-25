import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const initialFilled = game.players?.length || 1;
  const maxPlayers = game.maxPlayers || 10;
  
  const storageKey = currentUser ? `joined_${currentUser.uid}` : 'joined_guest';

  const [isJoined, setIsJoined] = useState(() => {
    const joinedGames = JSON.parse(localStorage.getItem('joinedGames') || '[]');
    return joinedGames.includes(game._id);
  });
  
  const [filled, setFilled] = useState(isJoined ? initialFilled + 1 : initialFilled);
  const spotsOpen = maxPlayers - filled;
  const progressPercent = Math.round((filled / maxPlayers) * 100);

  const toggleJoin = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    const joinedGames = JSON.parse(localStorage.getItem('joinedGames') || '[]');

    if (!isJoined && spotsOpen > 0) {
      setFilled((prev) => prev + 1);
      setIsJoined(true);
      
      if (!joinedGames.includes(game._id)) {
        localStorage.setItem('joinedGames', JSON.stringify([...joinedGames, game._id]));
      }
      navigate(`/space/${game._id}`);
    } else {
      navigate(`/space/${game._id}`);
    }
  };

  // Dynamically map sports to attractive, optimized Unsplash URLs
  const getSportImage = (sport) => {
    const sportLower = sport?.toLowerCase() || '';
    switch (sportLower) {
      case 'football': 
        return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1293&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      case 'cricket': 
        return 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop';
      case 'basketball': 
        return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop';
      case 'badminton': 
        return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop';
      case 'tennis': 
        return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop';
      case 'volleyball': 
        return 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600&auto=format&fit=crop';
      default: 
        return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop'; // Generic athletic fallback
    }
  };

  const displayImage = getSportImage(game.sport);

  return (
    <div className="bg-[#0f0f13] rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between h-full">
      <div className="relative h-44 w-full overflow-hidden bg-neutral-900 shrink-0">
        <img src={displayImage} alt={game.sport || 'Game'} className="w-full h-full object-cover" />
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
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-neutral-400">
              <span className="text-emerald-400 font-semibold">{game.organizer?.reliability || '95'}%</span> Reliability
            </div>
            <button
              onClick={toggleJoin}
              className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition ${
                isJoined
                  ? 'bg-neutral-800 text-neutral-300'
                  : 'bg-[#ff5500] text-white hover:bg-[#ff6611]'
              }`}
            >
              {isJoined ? 'Joined ✓' : 'Join Game'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}