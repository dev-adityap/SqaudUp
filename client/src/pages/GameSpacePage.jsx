import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import WeatherBadge from '../components/WeatherBadge';
import {
  Shield, MessageSquare, Users, ArrowLeft, MapPin, Check, X, Loader2, UserPlus,
} from 'lucide-react';
import { apiFetch, API_BASE } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useGames } from '../context/GamesContext';
import { useToast } from '../context/ToastContext';
import { Spinner, ErrorState, EmptyState } from '../components/ui/States';

const getEquipment = (sport) => {
  const s = sport?.toLowerCase() || '';
  if (s === 'football') return ['Turf Boots / Studs', 'Shin Guards', 'Water Bottle', 'Team Jersey (Dark/Light)'];
  if (s === 'cricket') return ['Cricket Bat', 'Abdo Guard (L-Guard)', 'Spiked Shoes', 'Kit Bag'];
  if (s === 'basketball') return ['Basketball Shoes', 'Water Bottle', 'Towel', 'Grip Powder'];
  if (s === 'badminton') return ['Racquet', 'Shuttlecocks', 'Non-marking Shoes', 'Water Bottle'];
  if (s === 'tennis') return ['Racquet', 'Tennis Balls', 'Court Shoes', 'Water Bottle'];
  return ['Water Bottle', 'Sportswear', 'Appropriate Footwear'];
};

export default function GameSpacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { meId } = useGames();
  const { currentUser } = useAuth();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [savingPlayerId, setSavingPlayerId] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'SquadUp AI', text: 'Welcome to the match space! I am your AI coordinator. Ask me about weather, tactics, or match rules.', isAi: true },
  ]);

  // Attendance is stored on the game document; key it by playerId for O(1) lookup.
  const loadSpace = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`${API_BASE}/api/games/${id}`);
      if (!res.ok) throw new Error(res.status === 404 ? 'This space no longer exists.' : `Server responded ${res.status}`);
      const data = await res.json();
      setDetail(data.data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiTyping) return;

    const userText = chatInput;
    setChatInput('');
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'You', text: userText, isAi: false }]);
    setIsAiTyping(true);

    try {
      const data = await apiFetch('/api/ai/chat', { method: 'POST', body: JSON.stringify({ prompt: userText }) });
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'SquadUp AI', text: data.text, isAi: true }]);
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'SquadUp AI', text: err.message, isAi: true }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleAttendance = async (playerId, status) => {
    const previous = detail.attendance?.find((a) => a.playerId === playerId)?.status || 'pending';

    // Optimistic: recolour immediately.
    setDetail((prev) => ({
      ...prev,
      attendance: [
        ...(prev.attendance || []).filter((a) => a.playerId !== playerId),
        { playerId, status, markedAt: new Date().toISOString() },
      ],
    }));
    setSavingPlayerId(playerId);

    try {
      const res = await apiFetch(`/api/games/${id}/attendance`, {
        method: 'PUT',
        body: JSON.stringify({ playerId, status }),
      });
      const delta = res.data?.scoreChange ?? 0;
      toast.success(
        `${status === 'present' ? 'Present' : 'Flaked'} recorded. Reliability ${delta >= 0 ? '+' : ''}${delta}.`
      );
    } catch (err) {
      // Revert the optimistic update.
      setDetail((prev) => ({
        ...prev,
        attendance: (prev.attendance || []).filter((a) => a.playerId !== playerId),
      }));
      if (previous !== 'pending') {
        setDetail((prev) => ({
          ...prev,
          attendance: [...(prev.attendance || []), { playerId, status: previous, markedAt: new Date().toISOString() }],
        }));
      }
      toast.error(err.message || 'Failed to save attendance.');
    } finally {
      setSavingPlayerId(null);
    }
  };

  if (loading) return <Spinner label="Loading space..." />;
  if (loadError) {
    return (
      <div className="pt-28 max-w-3xl mx-auto px-4">
        <ErrorState message={loadError} onRetry={loadSpace} />
        <p className="text-center -mt-6">
          <Link to="/explore" className="text-[#ff5500] font-bold text-sm hover:underline">Back to Explore</Link>
        </p>
      </div>
    );
  }
  if (!detail) return null;

  const attendanceMap = new Map((detail.attendance || []).map((a) => [String(a.playerId), a.status]));
  const roster = detail.players || [];
  // Only a squad member may mark attendance, and never themselves.
  const canMark = roster.some((p) => String(p._id) === String(meId));

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 w-fit transition">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-display font-black text-white uppercase">{detail.title} - SQUAD SPACE</h1>
          <div className="flex items-center gap-2 mt-1">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((detail.venue || 'Kolkata') + ' Kolkata')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff5500] font-bold text-sm flex items-center gap-1 hover:underline hover:text-white transition"
            >
              <MapPin className="w-4 h-4" /> {detail.venue}
            </a>
            <span className="text-neutral-500 font-bold text-sm">• {detail.startTime}</span>
          </div>
          <div className="mt-3">
            <span className="bg-neutral-800 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-700">
              {detail.sport}
            </span>
          </div>
        </div>
        <WeatherBadge location="Kolkata" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#ff5500]" /> Required Gear
            </h3>
            <ul className="space-y-2">
              {getEquipment(detail.sport).map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-neutral-300 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/50">
                  <input type="checkbox" className="accent-[#ff5500] w-4 h-4 rounded border-neutral-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#ff5500]" /> Squad ({roster.length}/{detail.maxPlayers})
            </h3>

            {roster.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-6">
                No players in this space yet.
              </p>
            ) : (
              <div className="space-y-3">
                {roster.map((player) => {
                  const status = attendanceMap.get(String(player._id)) || 'pending';
                  const isMe = String(player._id) === String(meId);
                  const markable = canMark && !isMe && status === 'pending';

                  return (
                    <div key={player._id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                      <div className="flex items-center gap-3 min-w-0">
                        {player.avatar ? (
                          <img src={player.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-[#ff5500] shrink-0">
                            {(player.username || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm text-white font-semibold truncate">
                            @{player.username}{isMe && <span className="text-[#ff5500] text-xs"> (you)</span>}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {player.reliabilityScore}% reliability
                            {status !== 'pending' && (
                              <span className={`ml-2 font-bold uppercase ${status === 'present' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {status}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {isMe ? (
                        <span className="text-[10px] text-neutral-600 font-bold uppercase">You</span>
                      ) : (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleAttendance(player._id, 'present')}
                            disabled={!markable || savingPlayerId === player._id}
                            title={markable ? 'Mark present' : undefined}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition ${
                              status === 'present'
                                ? 'bg-emerald-500 text-black border-emerald-500'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-emerald-500 hover:text-emerald-400'
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            {savingPlayerId === player._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendance(player._id, 'flaked')}
                            disabled={!markable || savingPlayerId === player._id}
                            title={markable ? 'Mark flaked' : undefined}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition ${
                              status === 'flaked'
                                ? 'bg-red-500 text-white border-red-500'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-red-500 hover:text-red-400'
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!canMark && roster.length > 0 && (
              <p className="text-[11px] text-neutral-500 mt-4 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Join this squad to mark attendance.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#0f0f13] border border-neutral-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#ff5500]" />
            <h3 className="text-white font-bold">Space Chat</h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${msg.isAi ? 'bg-neutral-800 text-neutral-200 rounded-tl-none' : 'bg-[#ff5500] text-white rounded-tr-none'}`}>
                  <div className="text-[10px] font-bold uppercase mb-1 opacity-50">{msg.sender}</div>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {isAiTyping && (
            <div className="px-4 pb-2 text-xs text-[#ff5500] font-bold italic opacity-75">
              SquadUp AI is typing...
            </div>
          )}

          <form className="p-4 border-t border-neutral-800 bg-neutral-900/50" onSubmit={handleSendMessage}>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message the squad or ask the AI..."
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff5500]"
                disabled={isAiTyping}
              />
              <button
                type="submit"
                disabled={isAiTyping || !chatInput.trim()}
                className="bg-[#ff5500] text-white px-6 font-bold rounded-xl hover:bg-[#ff6611] transition disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
