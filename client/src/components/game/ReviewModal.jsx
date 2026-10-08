import React, { useState } from 'react';
import { Check, X, Loader2, UserCheck, UserX } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function ReviewModal({ game, token, onComplete, onClose }) {
  const [attendance, setAttendance] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const players = game?.players || [];

  const handleAttendanceChange = (userId, attended) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: attended,
    }));
  };

  const getAttendanceValue = (userId) => {
    if (attendance.hasOwnProperty(userId)) {
      return attendance[userId];
    }
    return true; // default to attended
  };

  const handleSubmit = async () => {
    if (!game?._id) return;
    setSubmitting(true);
    setError(null);

    try {
      const attendanceArray = players.map((p) => ({
        userId: p._id,
        attended: getAttendanceValue(p._id),
      }));

      await apiFetch(`/api/games/${game._id}/review`, {
        method: 'POST',
        body: JSON.stringify({ attendance: attendanceArray }),
        token,
      });

      onComplete();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!game) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div
        className="w-full max-w-2xl bg-[#0f0f13] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 id="review-modal-title" className="text-2xl font-display font-black text-white uppercase tracking-tight">
            Complete & Review Match
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition disabled:opacity-50"
            aria-label="Close review modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <p className="text-neutral-400 text-sm">
            Mark attendance for each player. This will update their Reliability Score and mark the match as completed.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {players.map((player) => {
              const userId = player._id;
              const attended = getAttendanceValue(userId);
              return (
                <div
                  key={userId}
                  className="flex items-center justify-between p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold text-[#ff5500]">
                        {(player.username || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">@{player.username}</p>
                      <p className="text-xs text-neutral-500">
                        {player.reliabilityScore}% reliability{player.gamesPlayed ? ` • ${player.gamesPlayed} games` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAttendanceChange(userId, true)}
                      disabled={submitting}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                        attended
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700 hover:bg-neutral-700 hover:text-neutral-300'
                      } disabled:opacity-50`}
                      aria-pressed={attended}
                    >
                      <UserCheck className="w-4 h-4" />
                      Showed Up
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendanceChange(userId, false)}
                      disabled={submitting}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                        !attended
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700 hover:bg-neutral-700 hover:text-neutral-300'
                      } disabled:opacity-50`}
                      aria-pressed={!attended}
                    >
                      <UserX className="w-4 h-4" />
                      No Show
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {players.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              No players in this squad to review.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-neutral-800 bg-neutral-900/50">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all flex justify-center items-center gap-2
              bg-[#ff5500] text-white hover:bg-[#ff6611] hover:shadow-lg hover:shadow-[#ff5500]/30 hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {submitting ? 'Submitting...' : 'Submit Stats'}
          </button>
        </div>
      </div>
    </div>
  );
}