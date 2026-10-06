import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, UserPlus, Calendar, Award, Clock, Check, Trash2, Loader2, Inbox } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Spinner, EmptyState, ErrorState } from '../components/ui/States';

const ICONS = {
  GAME_INVITATION: { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  PLAYER_JOINED: { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  SYSTEM: { icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  REMINDER: { icon: Clock, color: 'text-[#ff5500]', bg: 'bg-[#ff5500]/10 border-[#ff5500]/20' },
  RELIABILITY: { icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
};

const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function NotificationsPage() {
  const { profile, syncing } = useAuth();
  const toast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    if (!profile?._id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/notifications/${profile._id}`);
      setNotifications(data.data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Could not load notifications.');
    } finally {
      setLoading(false);
    }
  }, [profile, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) {
      toast.info('Nothing left to mark as read.');
      return;
    }
    // Optimistic, then reconcile with the server.
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await Promise.all(unread.map((n) => apiFetch(`/api/notifications/${n._id}/read`, { method: 'POST' })));
      toast.success('All caught up.');
    } catch (err) {
      toast.error(err.message || 'Could not mark notifications as read.');
      load();
    }
  };

  const clearNotifications = () => {
    // There is no delete-all endpoint; clearing the view would be a lie.
    toast.info('Dismiss individual notifications by marking them read.');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-display font-black text-white mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#ff5500]" /> NOTIFICATIONS.
            {unreadCount > 0 && (
              <span className="text-xs bg-[#ff5500] text-white rounded-full px-2.5 py-1 align-middle">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-neutral-400 font-semibold text-sm">
            Stay updated on your squads and match invites.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            disabled={loading || clearing}
            className="p-2 bg-[#0f0f13] border border-neutral-800 hover:border-neutral-600 rounded-xl text-neutral-400 hover:text-white transition flex items-center gap-2 text-xs font-bold disabled:opacity-50"
            title="Mark all as read"
          >
            {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span className="hidden sm:inline">READ ALL</span>
          </button>
          <button
            onClick={clearNotifications}
            className="p-2 bg-[#0f0f13] border border-neutral-800 hover:border-red-500/50 rounded-xl text-neutral-400 hover:text-red-500 transition flex items-center gap-2 text-xs font-bold"
            title="Notifications are cleared by marking them read"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">CLEAR</span>
          </button>
        </div>
      </div>

      {syncing ? (
        <Spinner label="Loading your notifications..." />
      ) : loading ? (
        <Spinner label="Loading your notifications..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="You're all caught up!"
          description="No new notifications at the moment. Join a game to start building your squad."
          action={
            <Link to="/explore" className="inline-block bg-[#ff5500] text-white font-bold px-5 py-2.5 rounded-lg">
              Find a Game
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            const style = ICONS[notif.type] || ICONS.SYSTEM;
            const Icon = style.icon;
            return (
              <div
                key={notif._id}
                className={`relative p-5 rounded-2xl border transition-all ${
                  notif.read
                    ? 'bg-[#0f0f13] border-neutral-800'
                    : 'bg-[#15151a] border-neutral-700 shadow-lg shadow-black/50'
                }`}
              >
                {!notif.read && (
                  <div className="absolute top-5 right-5 w-2 h-2 bg-[#ff5500] rounded-full shadow-[0_0_8px_#ff5500]" />
                )}
                <div className="flex gap-4 items-start">
                  <div className={`p-3 rounded-xl border shrink-0 ${style.bg}`}>
                    <Icon className={`w-5 h-5 ${style.color}`} />
                  </div>
                  <div className="pr-4">
                    <h4 className={`text-sm font-bold mb-1 ${notif.read ? 'text-neutral-300' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-2">{notif.message}</p>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
