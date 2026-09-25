import React, { useState } from 'react';
import { playersData } from '../data/players';

export default function MatchmakingPage() {
  const [invited, setInvited] = useState({});

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-display font-black text-white mb-6">FINDING YOUR SQUAD.</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {playersData.map((p) => (
          <div key={p.id} className="bg-[#0f0f13] border border-neutral-800 rounded-xl p-5">
            <img src={p.avatar} alt={p.name} className="w-16 h-16 rounded-full object-cover mb-4" />
            <h3 className="font-display text-xl text-white">{p.name}</h3>
            <p className="text-xs text-neutral-400 mb-4">{p.primarySport} • {p.reliability}% Reliability</p>
            <button
              onClick={() => setInvited({ ...invited, [p.id]: !invited[p.id] })}
              className={`w-full py-2 rounded text-xs font-bold uppercase ${
                invited[p.id] ? 'bg-emerald-600 text-white' : 'bg-[#ff5500] text-white'
              }`}
            >
              {invited[p.id] ? 'Invited ✓' : 'Invite'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}