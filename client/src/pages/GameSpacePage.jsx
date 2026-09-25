import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, MessageSquare, Users, ArrowLeft } from 'lucide-react';

export default function GameSpacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');

  // We will wire this to Gemini in Phase 2
  const [messages, setMessages] = useState([
    { id: 1, sender: 'SquadUp AI', text: 'Welcome to the match space! I am your AI coordinator. Ask me about weather, tactics, or match rules.', isAi: true }
  ]);

  // Mocked joined users (we will fetch this from MongoDB later)
  const joinedPlayers = [
    { id: 1, username: 'adityap', age: 21 },
    { id: 2, username: 'tanuj_k', age: 22 },
    { id: 3, username: 'biki_99', age: 21 },
  ];

  useEffect(() => {
    const fetchGameSpace = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/games`);
        const data = await response.json();
        const gamesList = data.data || data || [];
        const foundGame = gamesList.find(g => g._id === id);
        setGame(foundGame);
      } catch (error) {
        console.error("Error fetching game space:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGameSpace();
  }, [id]);

  const getEquipment = (sport) => {
    const lowerSport = sport?.toLowerCase() || '';
    if (lowerSport === 'football') return ['Turf Boots / Studs', 'Shin Guards', 'Water Bottle', 'Team Jersey (Dark/Light)'];
    if (lowerSport === 'cricket') return ['Cricket Bat', 'Abdo Guard (L-Guard)', 'Spiked Shoes', 'Kit Bag'];
    if (lowerSport === 'basketball') return ['Basketball Shoes', 'Water Bottle', 'Towel', 'Grip Powder'];
    return ['Water Bottle', 'Sportswear', 'Appropriate Footwear'];
  };

  if (loading) return <div className="pt-28 text-center text-white font-bold">Loading Space...</div>;
  if (!game) return <div className="pt-28 text-center text-red-500 font-bold">Game not found.</div>;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
      
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 w-fit transition">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-display font-black text-white uppercase">{game.title} - SQUAD SPACE</h1>
          <p className="text-[#ff5500] font-bold text-sm mt-1">{game.venue} • {game.startTime}</p>
        </div>
        <span className="bg-neutral-800 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-700">
          {game.sport}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* LEFT COLUMN: Players & Gear */}
        <div className="space-y-6 overflow-y-auto pr-2">
          
          {/* Equipment Checklist */}
          <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#ff5500]" /> Required Gear
            </h3>
            <ul className="space-y-2">
              {getEquipment(game.sport).map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-neutral-300 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/50">
                  <input type="checkbox" className="accent-[#ff5500] w-4 h-4 rounded border-neutral-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Roster */}
          <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#ff5500]" /> Squad ({joinedPlayers.length}/{game.maxPlayers})
            </h3>
            <div className="space-y-3">
              {joinedPlayers.map(player => (
                <div key={player.id} className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                  <span className="text-sm text-white font-semibold">@{player.username}</span>
                  <span className="text-xs text-neutral-500">Age: {player.age}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Chat */}
        <div className="lg:col-span-2 bg-[#0f0f13] border border-neutral-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#ff5500]" />
            <h3 className="text-white font-bold">Space Chat</h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.isAi ? 'bg-neutral-800 text-neutral-200 rounded-tl-none' : 'bg-[#ff5500] text-white rounded-tr-none'}`}>
                  <div className="text-[10px] font-bold uppercase mb-1 opacity-50">{msg.sender}</div>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form className="p-4 border-t border-neutral-800 bg-neutral-900/50" onSubmit={(e) => e.preventDefault()}>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message the squad or ask the AI..."
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff5500]"
              />
              <button className="bg-[#ff5500] text-white px-6 font-bold rounded-xl hover:bg-[#ff6611] transition">
                Send
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}