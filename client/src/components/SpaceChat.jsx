import { useState } from 'react';

export default function SpaceChat() {
  const [prompt, setPrompt] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: 'Yo! I am the SquadUp AI. What do you need?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message to UI immediately
    const userMsg = { sender: 'user', text: prompt };
    setChatLog((prev) => [...prev, userMsg]);
    setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.text }),
      });

      const data = await res.json();
      
      if (data.success) {
        setChatLog((prev) => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setChatLog((prev) => [...prev, { sender: 'ai', text: 'Error connecting to Gemini.' }]);
      }
    } catch (error) {
      setChatLog((prev) => [...prev, { sender: 'ai', text: 'Server error. Is the backend running?' }]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-96 bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.sender === 'user' 
                ? 'bg-[#ff5722] text-white' 
                : 'bg-gray-800 text-gray-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-500 text-sm italic">Gemini is thinking...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type anything..." 
          className="flex-1 bg-black border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#ff5722]"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#ff5722] text-white px-5 py-2 rounded-lg font-bold transition hover:bg-orange-600 disabled:opacity-50"
        >
          SEND
        </button>
      </form>
    </div>
  );
}