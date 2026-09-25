import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-20 max-w-md mx-auto px-4">
      <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-8">
        <h2 className="text-3xl font-display font-black text-white mb-4">
          {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </h2>
        <button
          onClick={() => navigate('/explore')}
          className="w-full bg-[#ff5500] text-white font-display py-3 rounded uppercase font-bold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}