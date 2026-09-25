import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GameCard from '../components/game/GameCard';

export default function SportPage() {
  const { sport } = useParams(); // Grabs 'tennis', 'football', etc. from the URL
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSportGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games');
        const data = await response.json();
        const allGames = data.data || data || [];
        
        // Filter live games from Atlas by the specific sport in the URL
        const filtered = allGames.filter(g => g.sport?.toLowerCase() === sport?.toLowerCase());
        setGames(filtered);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSportGames();
  }, [sport]);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 w-fit transition">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      
      <h1 className="text-5xl font-display font-black text-white uppercase mb-2">{sport} GAMES</h1>
      <p className="text-neutral-400 mb-10 font-semibold">Join live {sport} matches happening near you.</p>

      {loading ? (
        <div className="text-[#ff5500] font-bold">Loading {sport} games...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <GameCard key={game._id} game={game} />
          ))}
          
          {games.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
              No live {sport} games found right now. Be the first to host one!
            </div>
          )}
        </div>
      )}
    </div>
  );
}