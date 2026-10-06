import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, History, Plus, CalendarX } from 'lucide-react';
import GameCard from '../components/game/GameCard';
import { useAuth } from '../context/AuthContext';
import { useGames } from '../context/GamesContext';
import { SkeletonGrid, EmptyState, ErrorState } from '../components/ui/States';

export default function LiveGamesPage() {
  const { currentUser, profile, syncing } = useAuth();
  const { loading, error, refresh, myGames, hostingGames, joinedGames, historyGames } = useGames();
  const [activeTab, setActiveTab] = useState('upcoming');

  const TABS = [
    { key: 'upcoming', label: 'Upcoming Matches', icon: Calendar },
    { key: 'joined', label: 'Joined', icon: Calendar },
    { key: 'hosting', label: 'Hosting', icon: Trophy },
    { key: 'history', label: 'History', icon: History },
  ];

  // Each tab shows a genuinely different slice, not the same list three times.
  const lists = {
    upcoming: myGames.filter((g) => g.date?.substring(0, 10) >= new Date().toISOString().slice(0, 10)),
    joined: joinedGames,
    hosting: hostingGames,
    history: historyGames,
  };
  const visible = lists[activeTab] || [];

  const emptyCopy = {
    upcoming: { title: "You haven't joined any games yet", body: 'Browse open games in Explore and join your first squad.' },
    joined: { title: 'No joined games', body: 'Games you join will show up here.' },
    hosting: { title: "You're not hosting anything", body: 'Create a game and invite your friends to fill the squad.' },
    history: { title: 'No past games', body: 'Completed and past-dated games will appear here.' },
  }[activeTab];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-5xl font-display font-black text-white">MY DASHBOARD.</h1>
        <Link
          to="/create-game"
          className="hidden sm:inline-flex items-center gap-2 bg-[#ff5500] hover:bg-[#ff6611] text-white px-5 py-2.5 rounded-lg font-bold text-xs tracking-wider transition"
        >
          <Plus className="w-4 h-4" /> HOST A GAME
        </Link>
      </div>

      <div className="flex gap-4 border-b border-neutral-800 mb-8 pb-4 overflow-x-auto scrollbar-hide">
        {TABS.map(({ key, label, icon: Icon }) => {
          const count = (lists[key] || []).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              aria-current={activeTab === key ? 'page' : undefined}
              className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition whitespace-nowrap ${
                activeTab === key ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === key ? 'bg-black/15' : 'bg-neutral-800'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {!currentUser ? (
        <EmptyState
          icon={Calendar}
          title="Sign in to see your dashboard"
          description="Your upcoming matches, hosted games and history live here once you sign in."
          action={
            <Link to="/auth" className="inline-block bg-[#ff5500] text-white font-bold px-5 py-2.5 rounded-lg">
              Sign in
            </Link>
          }
        />
      ) : syncing ? (
        <SkeletonGrid count={3} />
      ) : loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((game) => <GameCard key={game._id} game={game} />)}

          {visible.length === 0 && (
            <EmptyState
              icon={CalendarX}
              title={emptyCopy.title}
              description={emptyCopy.body}
              action={
                <Link
                  to={activeTab === 'hosting' ? '/create-game' : '/explore'}
                  className="inline-block bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold px-5 py-2.5 rounded-lg transition"
                >
                  {activeTab === 'hosting' ? 'Host a Game' : 'Find a Game'}
                </Link>
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
