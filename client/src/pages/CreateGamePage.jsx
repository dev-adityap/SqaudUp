import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGames } from '../context/GamesContext';
import { useToast } from '../context/ToastContext';

const SPORTS = ['Football', 'Cricket', 'Basketball', 'Badminton', 'Tennis', 'Volleyball'];
const SKILLS = ['Casual', 'Intermediate', 'Competitive'];
const VENUE_COORDS = {
  default: [88.4000, 22.5800],
};

const inputCls =
  'w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-[#ff5500]';

export default function CreateGamePage() {
  const navigate = useNavigate();
  const { profile, syncing } = useAuth();
  const { createGame } = useGames();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Weekend 7v7 Match',
    sport: 'Football',
    venue: 'Salt Lake Turf',
    maxPlayers: 10,
    date: new Date().toISOString().slice(0, 10),
    startTime: '18:00',
    endTime: '20:00',
    skillLevel: 'Casual',
  });

  const update = (k, v) => setFormData((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // hostId is no longer sent: the backend derives it from the auth token.
      await createGame({
        title: formData.title.trim(),
        sport: formData.sport,
        venue: formData.venue.trim(),
        maxPlayers: Number(formData.maxPlayers),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        skillLevel: formData.skillLevel,
        location: { type: 'Point', coordinates: VENUE_COORDS.default },
      });
      navigate('/games');
    } catch (err) {
      // createGame already toasts; this keeps the button recoverable.
      toast.error(err.message || 'Could not publish this game.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-4">
      <h1 className="text-4xl font-display font-black text-white mb-2">CREATE A GAME</h1>
      <p className="text-neutral-400 text-sm mb-6">Post an open match and fill your squad.</p>

      {syncing ? (
        <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6 text-neutral-400 text-sm">
          Setting up your profile...
        </div>
      ) : !profile ? (
        <div className="bg-[#0f0f13] border border-red-900/50 rounded-2xl p-6 text-red-300 text-sm">
          We could not load your player profile. Refresh and try again.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div>
            <label htmlFor="title" className="text-xs text-neutral-400 block mb-1">Game Title</label>
            <input id="title" type="text" required value={formData.title}
              onChange={(e) => update('title', e.target.value)} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sport" className="text-xs text-neutral-400 block mb-1">Sport</label>
              <select id="sport" value={formData.sport}
                onChange={(e) => update('sport', e.target.value)} className={inputCls}>
                {SPORTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="skill" className="text-xs text-neutral-400 block mb-1">Skill Level</label>
              <select id="skill" value={formData.skillLevel}
                onChange={(e) => update('skillLevel', e.target.value)} className={inputCls}>
                {SKILLS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="venue" className="text-xs text-neutral-400 block mb-1">Venue</label>
            <input id="venue" type="text" required value={formData.venue}
              onChange={(e) => update('venue', e.target.value)} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="text-xs text-neutral-400 block mb-1">Date</label>
              <input id="date" type="date" required value={formData.date}
                onChange={(e) => update('date', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="slots" className="text-xs text-neutral-400 block mb-1">Total Slots</label>
              <input id="slots" type="number" min="2" max="50" required
                value={formData.maxPlayers}
                onChange={(e) => update('maxPlayers', e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="text-xs text-neutral-400 block mb-1">Start Time</label>
              <input id="start" type="time" required value={formData.startTime}
                onChange={(e) => update('startTime', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="end" className="text-xs text-neutral-400 block mb-1">End Time</label>
              <input id="end" type="time" required value={formData.endTime}
                onChange={(e) => update('endTime', e.target.value)} className={inputCls} />
            </div>
          </div>

          <p className="text-xs text-neutral-500">
            Hosting as <span className="text-white font-semibold">@{profile.username}</span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-display py-3 rounded font-bold uppercase transition disabled:cursor-not-allowed ${
              loading ? 'bg-neutral-600' : 'bg-[#ff5500] hover:bg-[#ff6611]'
            }`}
          >
            {loading ? 'Publishing...' : 'Publish Game'}
          </button>
        </form>
      )}
    </div>
  );
}
