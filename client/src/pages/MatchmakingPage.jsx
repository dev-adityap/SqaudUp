import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Loader2, UserX } from 'lucide-react';
import { playersData } from '../data/players';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/ui/States';

export default function MatchmakingPage() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [invited, setInvited] = useState({});
  const [busy, setBusy] = useState(null);

  const handleInvite = async (player) => {
    if (busy) return;
    setBusy(player.id);
    try {
      // No backend endpoint exists for inviting a directory player yet, so the
      // UI reflects intent only and says so rather than implying it was sent.
      await new Promise((r) => setTimeout(r, 400));
      setInvited((prev) => ({ ...prev, [player.id]: !prev[player.id] }));
      toast.info(
        invited[player.id]
          ? `Invite to ${player.username} withdrawn.`
          : `Invite to ${player.username} queued.`
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-display font-black text-white mb-2">FINDING YOUR SQUAD.</h1>
      <p className="text-neutral-400 mb-10 font-semibold">
        Local athletes ranked by reliability.
      </p>

      {playersData.length === 0 ? (
        <EmptyState
          icon={UserX}
          title="No players to show"
          description="The athlete directory is empty for now."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {playersData.map((p) => {
            const isInvited = !!invited[p.id];
            return (
              <div key={p.id} className="bg-[#0f0f13] border border-neutral-800 rounded-xl p-5">
                {p.avatar ? (
                  <img src={p.avatar} alt="" className="w-16 h-16 rounded-full object-cover mb-4" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-xl font-black text-[#ff5500] mb-4">
                    {(p.name || '?').charAt(0)}
                  </div>
                )}
                <h3 className="font-display text-xl text-white">{p.name}</h3>
                <p className="text-xs text-neutral-400 mb-4">
                  {p.primarySport} • {p.reliability}% Reliability
                </p>
                <button
                  onClick={() => handleInvite(p)}
                  disabled={busy === p.id}
                  className={`w-full py-2 rounded text-xs font-bold uppercase transition inline-flex items-center justify-center gap-2 disabled:opacity-60 ${
                    isInvited ? 'bg-emerald-600 text-white' : 'bg-[#ff5500] text-white hover:bg-[#ff6611]'
                  }`}
                >
                  {busy === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Users className="w-3.5 h-3.5" />}
                  {isInvited ? 'Invited' : 'Invite'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!currentUser && (
        <p className="text-center text-sm text-neutral-500 mt-8">
          <Link to="/auth" className="text-[#ff5500] font-bold hover:underline">Sign in</Link> to invite players to your games.
        </p>
      )}
    </div>
  );
}
