import React from 'react';
import { playersData } from '../data/players';

export default function PlayersPage() {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-display font-black text-white mb-6">ATHLETE DIRECTORY</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {playersData.map((p) => (
          <div key={p.id} className="bg-[#0f0f13] border border-neutral-800 rounded-xl p-5">
            <img src={p.avatar} alt={p.name} className="w-14 h-14 rounded-full object-cover mb-3" />
            <h3 className="font-display text-xl text-white">{p.name}</h3>
            <p className="text-xs text-emerald-400 font-bold">{p.reliability}% Attendance Rate</p>
            <p className="text-xs text-neutral-400 mt-1">{p.gamesPlayed} games played</p>
          </div>
        ))}
      </div>
    </div>
  );
}