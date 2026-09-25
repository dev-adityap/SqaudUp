import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SpacesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); // Pulls your active Google account

  useEffect(() => {
    const fetchSpaces = async () => {
      // If no one is logged in, don't try to fetch user-specific spaces
      if (!currentUser) return; 

      try {
        const response = await fetch('http://localhost:5000/api/games');
        const data = await response.json();
        const allGames = data.data || data || [];

        // 1. Look up games joined strictly by THIS Google user's unique ID
        const storageKey = `joined_${currentUser.uid}`;
        const joinedGameIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // 2. Filter! Keep games if this user joined them OR if their Google ID matches the host ID
        const mySpaces = allGames.filter(g => 
          joinedGameIds.includes(g._id) || g.hostId === currentUser.uid
        );

        setGames(mySpaces);
      } catch (error) {
        console.error("Error fetching spaces:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpaces();
  }, [currentUser]);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-5xl font-display font-black text-white mb-2">MY SPACES.</h1>
      <p className="text-neutral-400 mb-8 font-semibold">Access your active match rosters and AI chat hubs.</p>
      
      {loading ? (
        <div className="text-[#ff5500] font-bold text-center mt-10">Loading your active spaces...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <Link 
              key={game._id} 
              to={`/space/${game._id}`} 
              className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6 hover:border-[#ff5500] hover:shadow-lg hover:shadow-[#ff5500]/10 transition-all group block"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-neutral-800 text-[#ff5500] mb-3 inline-block">
                    {game.sport}
                  </span>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-[#ff5500] transition line-clamp-1">
                    {game.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {game.venue || 'Venue TBA'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-800 flex gap-4 text-xs font-bold text-neutral-400">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-500"/> Squad Roster</span>
                <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-blue-500"/> AI Space Chat</span>
              </div>
            </Link>
          ))}
          
          {games.length === 0 && (
             <div className="col-span-full py-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
               You haven't joined any games yet. Head to Explore to find a match!
             </div>
          )}
        </div>
      )}
    </div>
  );
}