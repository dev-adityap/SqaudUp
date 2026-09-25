import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';

export default function GameCard({ game }) {
  const [filled, setFilled] = useState(game.filledSlots);
  const [isJoined, setIsJoined] = useState(false);

  const spotsOpen = game.totalSlots - filled;
  const progressPercent = Math.round((filled / game.totalSlots) * 100);

  const toggleJoin = (e) => {
    e.preventDefault();
    if (isJoined) {
      setFilled((prev) => prev - 1);
      setIsJoined(false);
    } else if (spotsOpen > 0) {
      setFilled((prev) => prev + 1);
      setIsJoined(true);
    }
  };

  return (
    <div className="bg-[#0f0f13] rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between">
      <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
        <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-black/50" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-black/70 text-white border border-white/10">
            {game.sport}
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-black/70 text-neutral-300">
            {game.skillLevel}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="bg-[#08080a]/90 px-2.5 py-1 rounded border border-neutral-700 text-white font-bold">
            {spotsOpen} spots open
          </span>
          <span className="text-neutral-400">{filled} / {game.totalSlots} IN</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#ff5500]" />
            <span>{game.date} • {game.time}</span>
          </div>
          <Link to={`/games/${game.id}`}>
            <h3 className="font-display text-lg text-white hover:text-[#ff5500] transition line-clamp-1">
              {game.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="truncate">{game.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800">
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden mb-4">
            <div className="bg-[#ff5500] h-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-neutral-400">
              <span className="text-emerald-400 font-semibold">{game.organizer.reliability}%</span> Reliability
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