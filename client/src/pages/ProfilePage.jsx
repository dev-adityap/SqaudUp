import React from 'react';

export default function ProfilePage() {
  return (
    <div className="pt-28 pb-20 max-w-3xl mx-auto px-4">
      <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6 flex items-center gap-5">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-[#ff5500]"
        />
        <div>
          <h1 className="text-3xl font-display text-white">Rohan Sen</h1>
          <p className="text-xs text-emerald-400 font-bold">98% Reliability Rating</p>
        </div>
      </div>
    </div>
  );
}