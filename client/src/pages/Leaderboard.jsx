import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { Crown, Medal, Trophy, TrendingUp } from 'lucide-react';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await apiFetch('/api/leaderboard');
        setLeaders(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
          <Crown className="w-6 h-6 text-yellow-400" />
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-300/10 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-gray-300" />
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center">
          <Medal className="w-6 h-6 text-amber-600" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
        <span className="text-neutral-500 font-bold text-sm">{index + 1}</span>
      </div>
    );
  };

  const getReliabilityColor = (score) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getInitials = (username) => {
    if (!username) return '?';
    return username
      .split(/[_\s-]/)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-neutral-400">
          <div className="w-10 h-10 border-4 border-[#ff5500] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Loading city rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#0f0f13] border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
          <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Unable to Load Rankings</h2>
          <p className="text-neutral-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-10 bg-[#ff5500] rounded-full" />
          <h1 className="text-4xl font-display font-black text-white tracking-tight">
            CITY RANKINGS
          </h1>
        </div>
        <p className="text-neutral-500 text-sm uppercase tracking-wider">
          TOP ATHLETES
        </p>
      </header>

      <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_auto_auto_80px] gap-4 px-6 py-4 bg-neutral-900/50 border-b border-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-500">
          <span>RANK</span>
          <span>ATHLETE</span>
          <span className="text-right pr-4">GAMES PLAYED</span>
          <span className="text-right pr-4">RELIABILITY</span>
          <span className="text-center">ATTENDED</span>
        </div>

        <div className="divide-y divide-neutral-800">
          {leaders.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-neutral-700" />
              <p className="text-lg font-medium text-white mb-2">No athletes ranked yet</p>
              <p className="text-sm">Play games to appear on the leaderboard</p>
            </div>
          ) : (
            leaders.map((user, index) => (
              <div
                key={user._id || user.id || index}
                className="grid grid-cols-[60px_1fr_auto_auto_80px] gap-4 px-6 py-4 items-center transition-colors hover:bg-neutral-900/50"
              >
                <div className="flex items-center justify-center">
                  {getRankBadge(index)}
                </div>

                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-neutral-700">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {getInitials(user.username)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{user.username}</p>
                    <p className="text-xs text-neutral-500">
                      {user.gamesPlayed} games • {user.gamesAttended} attended
                    </p>
                  </div>
                </div>

                <div className="text-right w-28">
                  <p className="text-2xl font-black text-[#ff5500] tabular-nums">
                    {user.gamesPlayed}
                  </p>
                  <p className="text-xs text-neutral-500">PLAYED</p>
                </div>

                <div className="w-40">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`${getReliabilityColor(user.reliabilityScore)} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${user.reliabilityScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white tabular-nums w-10 text-right">
                      {user.reliabilityScore}%
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 text-right">RELIABILITY</p>
                </div>

                <div className="text-center text-2xl font-black text-white tabular-nums w-20">
                  {user.gamesAttended}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="mt-8 text-center text-neutral-600 text-xs">
        <p>Ranked by games played, then reliability score</p>
        <p className="mt-1">Top 50 athletes • Updated in real-time</p>
      </footer>
    </div>
  );
}