import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Info, Activity, ArrowLeft, Loader2 } from 'lucide-react';
import WeatherBadge from '../components/WeatherBadge';
import { useAuth } from '../context/AuthContext'; // Make sure this path matches your project!

// Your Custom Image Imports
import footballHero from '../assets/football.png';
import cricket from '../assets/cricket.png';
import basketball from '../assets/basketball.png';
import badminton from '../assets/badminton.png';
import tennis from '../assets/tennis.png'; // Fixed the double slash typo here
import volly from '../assets/volly.png';

// 1. Image Dictionary
const sportImages = {
  football: footballHero,
  cricket: cricket,
  basketball: basketball,
  badminton: badminton,
  tennis: tennis,
  volleyball: volly,
  default: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop"
};

const getDisplayImage = (game) => {
  if (game.image) return game.image;
  const sportKey = game.sport?.toLowerCase() || '';
  return sportImages[sportKey] || sportImages.default;
};

export default function GameDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomFilled, setRandomFilled] = useState(0);
  
  // States for the Join Button logic
  const [isJoined, setIsJoined] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const userId = currentUser?.uid || 'guest_user';
  const storageKey = `joined_${userId}`;

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/games');
        const data = await res.json();
        const gamesList = data.data || data || [];
        const foundGame = gamesList.find(g => g._id === id);
        
        if (foundGame) {
          setGame(foundGame);
          const maxSlots = foundGame.maxPlayers || foundGame.totalSlots || 10;
          const fakeFilled = Math.floor(Math.random() * (maxSlots - 1)) + 1; 
          setRandomFilled(fakeFilled);
        }

        // Check if user already joined this match
        const joinedGameIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (joinedGameIds.includes(id)) {
          setIsJoined(true);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id, storageKey]);

  // The Smart Join Logic
  const handleJoinClick = () => {
    if (isJoined) {
      navigate(`/space/${id}`);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        const joinedGameIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (!joinedGameIds.includes(id)) {
          joinedGameIds.push(id);
          localStorage.setItem(storageKey, JSON.stringify(joinedGameIds));
        }
        setIsJoined(true);
        setIsProcessing(false);
        navigate(`/space/${id}`);
      }, 800);
    }
  };

  if (loading) return <div className="pt-28 text-center text-[#ff5500] font-bold">Loading Match Details...</div>;
  if (!game) return <div className="pt-28 text-center text-red-500 font-bold">Game not found.</div>;

  const maxSlots = game.maxPlayers || game.totalSlots || 10;
  const fillPercentage = (randomFilled / maxSlots) * 100;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 w-fit transition">
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </button>

      {/* Massive Hero Image */}
      <div className="w-full h-72 md:h-[450px] rounded-3xl overflow-hidden mb-8 shadow-2xl border border-neutral-800">
        <img 
          src={getDisplayImage(game)} 
          alt={game.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
        />
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">{game.title}</h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="bg-neutral-800 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-700 text-[#ff5500]">
                  {game.sport}
                </span>
                <span className="bg-neutral-800 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-700 text-neutral-300 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> {game.skillLevel || 'Casual / Intermediate'}
                </span>
              </div>
            </div>
            
            {/* Live Weather Integration */}
            <WeatherBadge location="Kolkata" />
          </div>

          <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="text-white font-bold flex items-center gap-2 text-lg">
              <Info className="w-5 h-5 text-[#ff5500]" /> About This Match
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {game.description || `Join us for an epic game of ${game.sport}! Whether you're looking to sweat it out, practice your skills, or just have a good time with the squad, this match is open for you. Make sure to arrive 15 minutes early to warm up and bring adequate hydration.`}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Action Card */}
        <div className="space-y-6">
          <div className="bg-[#0f0f13] border border-neutral-800 rounded-3xl p-6 sticky top-28 shadow-2xl">
            
            <div className="space-y-5 mb-8">
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800"><Calendar className="w-5 h-5 text-[#ff5500]" /></div>
                <span className="text-sm font-semibold">{game.date}</span>
              </div>
              
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800"><Clock className="w-5 h-5 text-[#ff5500]" /></div>
                <span className="text-sm font-semibold">{game.startTime || game.time}</span>
              </div>
              
              {/* Clickable Google Maps Link */}
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((game.venue || game.location) + ' Kolkata')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-neutral-300 hover:text-white transition group cursor-pointer"
              >
                <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800 group-hover:border-[#ff5500] transition-colors"><MapPin className="w-5 h-5 text-[#ff5500]" /></div>
                <span className="text-sm font-semibold hover:underline">{game.venue || game.location}</span>
              </a>
            </div>
             
            <div className="border-t border-neutral-800 pt-6 mb-6">
              <p className="text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wider">Squad Fill</p>
              <div className="flex justify-between items-end mb-3">
                <span className="text-4xl font-display font-black text-white leading-none">{randomFilled}</span>
                <span className="text-sm font-bold text-neutral-500 mb-1">/ {maxSlots}</span>
              </div>
              {/* Visual Progress Bar */}
              <div className="w-full bg-neutral-900 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff5500] to-orange-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${fillPercentage}%` }}></div>
              </div>
            </div>

            {/* The Smart Button */}
            <button 
              onClick={handleJoinClick}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all flex justify-center items-center gap-2
                ${isJoined 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-[#ff5500] text-white hover:bg-[#ff6611] hover:shadow-lg hover:shadow-[#ff5500]/30 hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isProcessing 
                ? 'PROCESSING...' 
                : isJoined ? 'GO TO SPACE' : 'JOIN SQUAD'}
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
}