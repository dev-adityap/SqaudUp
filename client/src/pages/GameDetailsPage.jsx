import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { gamesData } from '../data/games';

export default function GameDetailsPage() {
  const { id } = useParams();
  const game = gamesData.find((g) => g.id === id) || gamesData[0];

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4">
      <img src={game.image} alt={game.title} className="w-full h-64 object-cover rounded-2xl mb-6" />
      <h1 className="text-4xl font-display font-black text-white">{game.title}</h1>
      <p className="text-neutral-400 text-sm mt-2">{game.location} • {game.date} at {game.time}</p>
      <div className="mt-6 p-4 bg-[#0f0f13] border border-neutral-800 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-400">Slots</p>
          <p className="text-xl font-display text-white">{game.filledSlots} / {game.totalSlots} Filled</p>
        </div>
        <button className="bg-[#ff5500] text-white px-6 py-2.5 rounded text-xs font-bold uppercase">
          Join Squad
        </button>
      </div>
    </div>
  );
}