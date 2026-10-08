import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Activity } from 'lucide-react';
import { API_BASE } from '../utils/api';

export default function Leaderboard() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/leaderboard`);
        const json = await res.json();
        if (json.success) setAthletes(json.data);
      } catch (error) {
        console.error('Failed to load leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full font-black text-sm"><Trophy className="w-4 h-4"/> 1ST</div>;
    if (index === 1) return <div className="flex items-center gap-1 text-gray-300 bg-gray-300/10 px-3 py-1 rounded-full font-black text-sm"><Medal className="w-4 h-4"/> 2ND</div>;
    if (index === 2) return <div className="flex items-center gap-1 text-amber-600 bg-amber-600/10 px-3 py-1 rounded-full font-black text-sm"><Medal className="w-4 h-4"/> 3RD</div>;
    return <span className="text-neutral-600 font-black text-xl w-12 text-center">#{index + 1}</span>;
  };

  if (loading) return <div className="pt-32 text-center font-bold text-neutral-500 animate-pulse">Ranking Athletes...</div>;

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-white uppercase tracking-tight mb-4">City Rankings</h1>
        <p className="text-neutral-400 max-w-lg mx-auto">The most active and reliable athletes on SquadUp. Show up, play hard, and climb the board.</p>
      </div>

      {/* Leaderboard List */}
      <div className="bg-[#0f0f13] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-800 bg-black text-xs font-bold text-neutral-500 uppercase tracking-widest">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-6">Athlete</div>
          <div className="col-span-2 text-center">Played</div>
          <div className="col-span-2 text-center">Reliability</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-neutral-800/50">
          {athletes.length === 0 ? (
            <div className="p-10 text-center text-neutral-500 font-bold">No ranked athletes yet. Play a game to claim #1!</div>
          ) : (
            athletes.map((user, index) => (
              <div 
                key={user._id} 
                onClick={() => navigate(`/profile/${user._id}`)}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-neutral-900 transition-colors cursor-pointer group"
              >
                {/* Rank Badge */}
                <div className="col-span-2 flex justify-center">
                  {getRankBadge(index)}
                </div>

                {/* Athlete Info */}
                <div className="col-span-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-[#ff5500] group-hover:scale-110 transition-transform">
                    {(user.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-[#ff5500] transition-colors">@{user.username || 'athlete'}</p>
                    {index < 3 && <p className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1"><Activity className="w-3 h-3"/> Top Tier</p>}
                  </div>
                </div>

                {/* Games Played */}
                <div className="col-span-2 text-center">
                  <span className="font-black text-white text-lg">{user.gamesPlayed}</span>
                </div>

                {/* Reliability Score */}
                <div className="col-span-2 flex justify-center">
                  <span className={`px-2 py-1 rounded font-bold text-xs ${
                    user.reliabilityScore >= 90 ? 'text-emerald-500 bg-emerald-500/10' : 
                    user.reliabilityScore >= 70 ? 'text-orange-500 bg-orange-500/10' : 
                    'text-red-500 bg-red-500/10'
                  }`}>
                    {user.reliabilityScore}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}