import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Award, LogOut, Settings, ShieldCheck, Loader2, User, Bell, Lock,
  Sun, CreditCard, SlidersHorizontal, HelpCircle, Flag, FileText,
  ChevronRight, LogIn,
} from 'lucide-react';

const THEME_KEY = 'squadup_theme';

function SettingsList({ title, items }) {
  return (
    <section className="bg-[#0f0f13] border border-neutral-800 rounded-2xl overflow-hidden">
      <h3 className="text-white font-bold text-sm uppercase tracking-wider px-5 py-4 border-b border-neutral-800">
        {title}
      </h3>
      <ul className="divide-y divide-neutral-800/70">
        {items.map(({ label, description, icon: Icon, badge, onClick, danger }) => {
          const Tag = onClick ? 'button' : 'div';
          return (
            <li key={label}>
              <Tag
                type={onClick ? 'button' : undefined}
                onClick={onClick}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left transition ${
                  onClick ? 'hover:bg-neutral-900 cursor-pointer' : 'cursor-default'
                } ${danger ? 'hover:bg-red-500/5' : ''}`}
              >
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                  danger
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-neutral-900 border-neutral-800'
                }`}>
                  <Icon className={`w-4 h-4 ${danger ? 'text-red-500' : 'text-[#ff5500]'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${danger ? 'text-red-500' : 'text-white'}`}>
                    {label}
                  </p>
                  {description && (
                    <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
                  )}
                </div>
                {badge && (
                  <span className="text-xs text-neutral-400 shrink-0">{badge}</span>
                )}
                {onClick && !danger && <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />}
              </Tag>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function ProfilePage() {
  const { currentUser, profile, signOut, syncing } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');

  const handleSignOut = async () => {
    setSigningOut(true);
    const ok = await signOut();
    setSigningOut(false);
    if (ok) {
      toast.success('Signed out.');
      navigate('/', { replace: true });
    } else {
      toast.error('Sign out failed. Please try again.');
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    // Only dark is fully designed today; say so rather than half-applying.
    toast.info(
      next === 'dark'
        ? 'Dark theme enabled.'
        : 'Light theme selected. Full light styling is not built yet.'
    );
  };

  // Static placeholders: no backend endpoint exists for these yet, so each one
  // tells the user rather than silently doing nothing.
  const notBuilt = (label) => () => toast.info(`${label} is not wired up yet.`);

  const displayName = currentUser?.displayName || profile?.username || 'SquadUp Athlete';
  const reliability = profile?.reliabilityScore ?? 100;

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 mb-8">
        {currentUser?.photoURL || profile?.avatar ? (
          <img
            src={currentUser?.photoURL || profile?.avatar}
            alt=""
            referrerPolicy="no-referrer"
            className="w-32 h-32 rounded-full border-4 border-neutral-800 object-cover shrink-0"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-neutral-800 bg-neutral-900 flex items-center justify-center text-4xl font-black text-[#ff5500] shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="text-center md:text-left flex-1 min-w-0">
          <h1 className="text-4xl font-display font-black text-white uppercase mb-2 break-words">
            {displayName}
          </h1>
          <p className="text-[#ff5500] font-bold flex items-center justify-center md:justify-start gap-2 mb-2">
            <Award className="w-5 h-5" />
            {syncing ? 'Syncing...' : `${reliability}% Reliability`}
          </p>
          {currentUser?.email && (
            <p className="text-neutral-400 text-sm truncate">{currentUser.email}</p>
          )}
          {profile && (
            <p className="text-neutral-500 text-xs mt-2">
              {profile.gamesPlayed ?? 0} games played
              {profile.sports?.length ? ` • ${profile.sports.join(', ')}` : ''}
            </p>
          )}
        </div>
      </div>

      <h2 className="text-white font-display font-bold text-lg mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-[#ff5500]" /> Settings Menu
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SettingsList
            title="Account Settings"
            items={[
              { label: 'Personal Information', description: 'Name, age, photo and bio', icon: User, onClick: notBuilt('Personal Information') },
              { label: 'Notification Preferences', description: 'Email, push and in-app alerts', icon: Bell, onClick: notBuilt('Notification Preferences') },
              { label: 'Privacy & Security', description: 'Password, sessions and visibility', icon: Lock, onClick: notBuilt('Privacy & Security') },
            ]}
          />

          <SettingsList
            title="App Settings"
            items={[
              {
                label: 'Theme',
                description: 'Switch between dark and light',
                icon: Sun,
                badge: theme === 'dark' ? 'Dark' : 'Light',
                onClick: toggleTheme,
              },
              { label: 'Payment Methods', description: 'Cards, UPI and payouts', icon: CreditCard, onClick: notBuilt('Payment Methods') },
              { label: 'Matchmaking Preferences', description: 'Sports, distance and skill level', icon: SlidersHorizontal, onClick: notBuilt('Matchmaking Preferences') },
            ]}
          />
        </div>

        <div className="space-y-6">
          <SettingsList
            title="Support"
            items={[
              { label: 'Help Center', description: 'FAQs and guides', icon: HelpCircle, onClick: notBuilt('Help Center') },
              { label: 'Report an Issue', description: 'Flag a player, game or venue', icon: Flag, onClick: notBuilt('Report an Issue') },
              { label: 'Terms of Service', description: 'Community rules and policies', icon: FileText, onClick: notBuilt('Terms of Service') },
            ]}
          />

          <section className="bg-[#0f0f13] border border-neutral-800 rounded-2xl overflow-hidden">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider px-5 py-4 border-b border-neutral-800">
              How reliability works
            </h3>
            <ul className="p-5 text-sm text-neutral-400 space-y-2 list-disc pl-9">
              <li>Marked <span className="text-emerald-400 font-semibold">Present</span>: +1 point</li>
              <li>Marked <span className="text-red-400 font-semibold">Flaked</span>: &minus;5 to &minus;10 points</li>
              <li>Score is clamped between 0 and 100</li>
              <li>High reliability unlocks priority placements</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Sign out sits last, visually distinct from the settings rows above. */}
      <div className="mt-8 pt-6 border-t border-neutral-800">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3.5 px-8 rounded-xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {signingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
          Sign Out
        </button>
      </div>
    </div>
  );
}