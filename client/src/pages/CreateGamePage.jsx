import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateGamePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: 'Weekend 7v7 Match',
    sport: 'Football',
    totalSlots: 10,
    location: 'Turf Pitch 1',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Match created in mock state!');
    navigate('/explore');
  };

  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-4">
      <h1 className="text-4xl font-display font-black text-white mb-6">CREATE A GAME</h1>
      <form onSubmit={handleSubmit} className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Game Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Sport</label>
          <select
            value={formData.sport}
            onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white"
          >
            <option>Football</option>
            <option>Cricket</option>
            <option>Basketball</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Venue</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white"
          />
        </div>
        <button type="submit" className="w-full bg-[#ff5500] text-white font-display py-3 rounded font-bold uppercase">
          Publish Game
        </button>
      </form>
    </div>
  );
}