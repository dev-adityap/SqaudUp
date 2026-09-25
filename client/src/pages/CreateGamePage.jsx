import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateGamePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Weekend 7v7 Match',
    sport: 'Football',
    totalSlots: 10,
    location: 'Turf Pitch 1',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Format the data exactly how Mongoose expects it
    const payload = {
      // Hardcoding your Postman hostId until we connect real user authentication
      hostId: "6ab58ca68499bc90e34bf5c6", 
      title: formData.title,
      sport: formData.sport,
      venue: formData.location, // Mapping form 'location' to DB 'venue'
      maxPlayers: formData.totalSlots, // Mapping form 'totalSlots' to DB 'maxPlayers'
      
      // Default background data to pass database validation
      location: { type: "Point", coordinates: [88.4, 22.5] }, // Default Kolkata coordinates
      date: new Date().toISOString().split('T')[0], // Today's date
      startTime: "18:00",
      endTime: "19:00",
      skillLevel: "Casual"
    };

    try {
      // 2. Send the POST request to your live backend
      const response = await fetch('http://localhost:5000/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      // 3. Redirect to the Live Games dashboard to see your new match!
      navigate('/games');
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Failed to create game. Check console for details.");
    } finally {
      setLoading(false);
    }
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
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#ff5500]"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Sport</label>
          <select
            value={formData.sport}
            onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#ff5500]"
          >
            <option>Football</option>
            <option>Cricket</option>
            <option>Basketball</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Total Slots</label>
          <input
            type="number"
            min="2"
            max="30"
            value={formData.totalSlots}
            onChange={(e) => setFormData({ ...formData, totalSlots: parseInt(e.target.value) })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#ff5500]"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Venue</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#ff5500]"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full text-white font-display py-3 rounded font-bold uppercase transition ${loading ? 'bg-neutral-600' : 'bg-[#ff5500] hover:bg-[#ff6611]'}`}
        >
          {loading ? 'Publishing...' : 'Publish Game'}
        </button>
      </form>
    </div>
  );
}