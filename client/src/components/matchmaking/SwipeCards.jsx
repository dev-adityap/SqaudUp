import React, { useState, useEffect, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { Check, X, MapPin, Calendar, RotateCcw, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sportImages = {
  football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  cricket: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
  badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
  tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80'
};

export default function SwipeCards({ games, onJoin, onRefresh }) {
  const [stack, setStack] = useState(games || []);
  const navigate = useNavigate();
  const cardRefs = useRef(new Map());

  useEffect(() => {
    setStack(games || []);
  }, [games]);

  const handleSwipe = async (direction, gameId) => {
    if (direction === 'right' && onJoin) {
      try {
        await onJoin(gameId); 
      } catch (error) {
        console.error("Failed to join via swipe", error);
      }
    }
  };

  const handleCardLeftScreen = (gameId) => {
    setStack((prev) => prev.filter((game) => game._id !== gameId));
  };

  const handleResetDeck = () => {
    if (onRefresh) onRefresh();
    setStack(games || []);
  };

  const triggerButtonSwipe = (dir, gameId) => {
    const cardRef = cardRefs.current.get(gameId);
    if (cardRef) cardRef.swipe(dir);
  };

  if (stack.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-in fade-in duration-500">
        <h2 className="text-4xl font-black text-white mb-4">CAUGHT UP!</h2>
        <p className="text-neutral-400 mb-8 max-w-sm">
          You've swiped through all open matches.
        </p>
        <button 
          onClick={handleResetDeck}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold rounded-xl transition shadow-[0_0_20px_rgba(255,85,0,0.3)] cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" /> Reload Deck
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[550px] mt-4 flex justify-center">
      {stack.map((game) => {
        const sportKey = game.sport?.toLowerCase();
        const bgImage = game.image || sportImages[sportKey] || sportImages.default;

        return (
          <TinderCard
            key={game._id}
            ref={(el) => cardRefs.current.set(game._id, el)}
            className="absolute w-full h-full" 
            onSwipe={(dir) => handleSwipe(dir, game._id)}
            onCardLeftScreen={() => handleCardLeftScreen(game._id)}
            preventSwipe={['up', 'down']}
          >
            {/* Added ambient glow shadow to the card itself */}
            <div className="bg-[#0f0f13] w-full h-full rounded-3xl border border-neutral-800 flex flex-col overflow-hidden relative cursor-grab active:cursor-grabbing shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8),0_0_30px_rgba(255,85,0,0.05)]">
              
              <div className="h-[45%] relative bg-black">
                <img 
                  src={bgImage} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none" 
                  alt={game.sport || 'Sport'}
                  onError={(e) => { e.target.src = sportImages.default; }}
                />
                <div className="absolute top-5 left-5 bg-[#ff5500] px-3 py-1 text-xs font-black text-white uppercase tracking-wider rounded-full shadow-lg z-10">
                  {game.sport}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0f0f13] to-transparent z-10" />
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between relative z-20">
                <div>
                  <h2 className="text-2xl font-black text-white leading-tight mb-4">{game.title}</h2>
                  <p className="text-neutral-400 text-sm flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-[#ff5500]"/> 
                    {game.venue?.name || 'Local Venue'}
                  </p>
                  <p className="text-neutral-400 text-sm flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#ff5500]"/> 
                    {game.date?.substring(0, 10) || 'Date TBA'} • {game.time || 'Time TBA'}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); triggerButtonSwipe('left', game._id); }}
                    className="w-14 h-14 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer group"
                  >
                    <X className="text-neutral-500 w-6 h-6 group-hover:text-red-400 transition-colors"/>
                  </button>
                  
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest pointer-events-none">
                    Swipe L/R
                  </span>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); triggerButtonSwipe('right', game._id); }}
                    className="w-14 h-14 rounded-full bg-[#ff5500]/10 border-2 border-[#ff5500] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer group"
                  >
                    <Check className="text-[#ff5500] w-6 h-6 group-hover:scale-110 transition-transform"/>
                  </button>
                </div>
              </div>
            </div>
          </TinderCard>
        );
      })}
    </div>
  );
}