import { useState } from 'react';
import { apiFetch } from '../utils/api';

export default function SpaceChat() {
  const [prompt, setPrompt] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: 'Yo! I am the SquadUp AI. What do you need?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || isLoading) return;

    setChatLog((prev) => [...prev, { sender: 'user', text }]);
    setPrompt('');
    setIsLoading(true);

    try {
      const data = await apiFetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: text }),
      });
      setChatLog((prev) => [...prev, { sender: 'ai', text: data.text }]);
    } catch (error) {
      // Surface the reason rather than failing silently.
      setChatLog((prev) => [...prev, { sender: 'ai', text: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-96 bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-[#ff5500] text-white'
                  : 'bg-neutral-800 text-neutral-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the AI..."
          disabled={isLoading}
          className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff5500] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="bg-[#ff5500] text-white px-4 rounded-xl font-bold text-sm hover:bg-[#ff6611] transition disabled:opacity-50"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
