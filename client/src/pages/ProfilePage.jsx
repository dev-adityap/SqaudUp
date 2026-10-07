import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Award, LogOut, Settings, Loader2, User, Bell, Lock,
  Sun, CreditCard, SlidersHorizontal, HelpCircle, Flag, FileText,
  ChevronRight, ArrowLeft
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
  
  // States
  const [signingOut, setSigningOut] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');
  const [activeView, setActiveView] = useState(null); // Replaces Modal with Full Pages
  const [matchRadius, setMatchRadius] = useState(15); // Live Matchmaking state

  // Magic Theme Hack: Inverts colors globally when light mode is active
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light-hack');
    } else {
      document.body.classList.remove('theme-light-hack');
    }
    return () => document.body.classList.remove('theme-light-hack');
  }, [theme]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const ok = await signOut();
    setSigningOut(false);
    if (ok) {
      toast.success('Signed out successfully.');
      navigate('/', { replace: true });
    } else {
      toast.error('Sign out failed. Please try again.');
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    toast.success(`Switched to ${next} mode.`);
  };

  const handleFormSubmit = (e, successMessage) => {
    if (e && e.preventDefault) e.preventDefault();
    setActiveView(null);
    toast.success(successMessage);
  };

  const displayName = currentUser?.displayName || profile?.username || 'SquadUp Athlete';
  const reliability = profile?.reliabilityScore ?? 100;

  // =========================================================================
  // SUB-PAGES (INTERNAL ROUTES)
  // If activeView is set, we render a FULL PAGE instead of the profile dashboard
  // =========================================================================
  if (activeView) {
    return (
      <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen animate-in fade-in slide-in-from-right-4 duration-300">
        
        {/* Universal Back Button for Sub-pages */}
        <button 
          onClick={() => setActiveView(null)} 
          className="flex items-center text-neutral-400 hover:text-white transition font-bold mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Profile
        </button>

        <h1 className="text-3xl font-display font-black text-white uppercase mb-8 border-b border-neutral-800 pb-4">
          {activeView}
        </h1>

        {/* --- MATCHMAKING PAGE --- */}
        {activeView === 'Matchmaking Preferences' && (
          <form onSubmit={(e) => handleFormSubmit(e, 'Matchmaking preferences updated.')} className="space-y-8">
            <div className="bg-[#0f0f13] border border-neutral-800 rounded-xl p-6">
              <label className="block text-sm font-bold text-white uppercase mb-2">
                Maximum Search Radius: <span className="text-[#ff5500]">{matchRadius} km</span>
              </label>
              <p className="text-xs text-neutral-500 mb-6">Adjust the radius to find games closer to your location.</p>
              
              <input 
                type="range" min="1" max="50" 
                value={matchRadius} 
                onChange={(e) => setMatchRadius(e.target.value)} 
                className="w-full accent-[#ff5500] h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-3 font-medium">
                <span>1 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
            </div>

            <div className="bg-[#0f0f13] border border-neutral-800 rounded-xl p-6">
              <label className="block text-sm font-bold text-white uppercase mb-2">Preferred Skill Level</label>
              <p className="text-xs text-neutral-500 mb-4">You will be matched with players of similar competitive intent.</p>
              <select className="w-full bg-[#1a1a21] border border-neutral-700 text-white rounded-lg px-4 py-4 focus:outline-none focus:border-[#ff5500] appearance-none font-medium">
                <option>Beginner (Casual & Fun)</option>
                <option>Intermediate (Amateur)</option>
                <option>Advanced (Highly Competitive)</option>
                <option>Any Level</option>
              </select>
            </div>
            
            <button type="submit" className="w-full bg-[#ff5500] hover:bg-[#ff7733] text-white font-bold py-4 rounded-xl transition text-lg shadow-lg shadow-[#ff5500]/20">
              Save Matchmaking Settings
            </button>
          </form>
        )}

        {/* --- PERSONAL INFO PAGE --- */}
        {activeView === 'Personal Information' && (
          <form onSubmit={(e) => handleFormSubmit(e, 'Profile updated successfully.')} className="space-y-6">
            <div className="bg-[#0f0f13] border border-neutral-800 rounded-xl p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Display Name</label>
                <input type="text" defaultValue={displayName} className="w-full bg-[#1a1a21] border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff5500] transition" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Email (Read Only)</label>
                <input type="email" defaultValue={currentUser?.email || ''} disabled className="w-full bg-[#1a1a21] border border-neutral-700 text-neutral-500 rounded-lg px-4 py-3 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Player Bio</label>
                <textarea placeholder="Favorite positions, play style, etc..." className="w-full bg-[#1a1a21] border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff5500] min-h-[120px] resize-none transition"></textarea>
              </div>
            </div>
            <button type="submit" className="w-full bg-[#ff5500] hover:bg-[#ff7733] text-white font-bold py-4 rounded-xl transition shadow-lg shadow-[#ff5500]/20">
              Save Profile
            </button>
          </form>
        )}

        {/* --- NOTIFICATIONS PAGE --- */}
        {activeView === 'Notification Preferences' && (
          <form onSubmit={(e) => handleFormSubmit(e, 'Alert settings saved.')} className="space-y-4">
            {['Match Updates & Invites', 'Direct Messages from Teammates', 'Platform Announcements', 'Reliability Score Alerts'].map(alert => (
              <label key={alert} className="flex items-center justify-between p-5 bg-[#0f0f13] border border-neutral-800 rounded-xl cursor-pointer hover:border-neutral-700 transition">
                <span className="text-base font-semibold text-white">{alert}</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#ff5500] rounded cursor-pointer" />
              </label>
            ))}
            <button type="submit" className="w-full bg-[#ff5500] hover:bg-[#ff7733] text-white font-bold py-4 rounded-xl transition mt-4 shadow-lg shadow-[#ff5500]/20">
              Update Notifications
            </button>
          </form>
        )}

{/* --- HELP CENTER PAGE --- */}
        {activeView === 'Help Center' && (
          <div className="space-y-6">
            <input type="text" placeholder="Search FAQs..." className="w-full bg-[#0f0f13] border border-neutral-800 text-white rounded-xl px-4 py-4 focus:outline-none focus:border-[#ff5500] transition" />
            
            {/* Interactive Accordion FAQs */}
            <div className="space-y-3">
              {[
                { 
                  q: 'How is Reliability calculated?', 
                  a: 'You gain +1 point for checking into a game you joined, and lose 5-10 points if you flake without canceling prior to kickoff.' 
                },
                { 
                  q: 'How do I cancel a game?', 
                  a: 'Navigate to your Spaces dashboard, select your upcoming game, and tap "Leave Squad" at least 2 hours before the match starts.' 
                },
                { 
                  q: 'Refund policy for paid venues', 
                  a: 'Payments are fully non-refundable within 24 hours of the match start time. Weather-related cancellations are automatically refunded.' 
                },
                { 
                  q: 'How to report a flaking player', 
                  a: 'Click on the player\'s avatar in the Game Space during or after the match and select "Report Flake".' 
                }
              ].map((faq, i) => (
                <div key={i} className="bg-[#0f0f13] border border-neutral-800 rounded-xl overflow-hidden transition-all group">
                  <div 
                    onClick={(e) => {
                      const content = e.currentTarget.nextElementSibling;
                      if (content.classList.contains('hidden')) {
                        content.classList.remove('hidden');
                        e.currentTarget.querySelector('svg').classList.add('rotate-90');
                      } else {
                        content.classList.add('hidden');
                        e.currentTarget.querySelector('svg').classList.remove('rotate-90');
                      }
                    }}
                    className="p-5 hover:bg-neutral-900 cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-white">{faq.q}</span>
                    <ChevronRight className="w-5 h-5 text-neutral-600 transition-transform duration-200" />
                  </div>
                  {/* Hidden Answer Content */}
                  <div className="hidden px-5 pb-5 text-neutral-400 text-sm border-t border-neutral-800/50 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => setActiveView('Report an Issue')} className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 rounded-xl transition mt-4">
              Contact Human Support
            </button>
          </div>
        )}

        {/* --- REPORT AN ISSUE PAGE --- */}
        {activeView === 'Report an Issue' && (
          <form onSubmit={(e) => handleFormSubmit(e, 'Report submitted. Our moderation team will review it.')} className="space-y-6">
            <div className="bg-[#0f0f13] border border-neutral-800 rounded-xl p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Category</label>
                <select className="w-full bg-[#1a1a21] border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff5500] appearance-none" required defaultValue="">
                  <option value="" disabled>Select the issue type...</option>
                  <option>Report a Player Behavior</option>
                  <option>Venue Problem / Closed</option>
                  <option>App Bug / Glitch</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Description</label>
                <textarea placeholder="Please provide specific details so we can investigate..." className="w-full bg-[#1a1a21] border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff5500] min-h-[150px] resize-none transition" required></textarea>
              </div>
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-4 rounded-xl font-bold transition">
              <Flag className="w-5 h-5" /> Submit Report
            </button>
          </form>
        )}
      </div>
    );
  }

  // =========================================================================
  // MAIN PROFILE DASHBOARD (Rendered when activeView is null)
  // =========================================================================
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen relative animate-in fade-in duration-300">
      
      {/* Dynamic Style Injection for Light Mode Hack */}
      <style>{`
        body.theme-light-hack {
          filter: invert(1) hue-rotate(180deg);
          background-color: #f0f0f0 !important;
        }
        body.theme-light-hack img, 
        body.theme-light-hack video {
          filter: invert(1) hue-rotate(180deg);
        }
      `}</style>

      {/* Profile Header Card */}
      <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 mb-8">
        {currentUser?.photoURL || profile?.avatar ? (
          <img
            src={currentUser?.photoURL || profile?.avatar}
            alt="Profile"
            referrerPolicy="no-referrer"
            className="w-32 h-32 rounded-full border-4 border-neutral-800 object-cover shrink-0"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-neutral-800 bg-neutral-900 flex items-center justify-center text-4xl font-black text-[#ff5500] shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="text-center md:text-left flex-1 min-w-0">
          <h1 className="text-4xl font-display font-black text-white uppercase mb-2 wrap-break-word">
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

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          <SettingsList
            title="Account Settings"
            items={[
              { label: 'Personal Information', description: 'Name, age, photo and bio', icon: User, onClick: () => setActiveView('Personal Information') },
              { label: 'Notification Preferences', description: 'Email, push and in-app alerts', icon: Bell, onClick: () => setActiveView('Notification Preferences') },
              { label: 'Privacy & Security', description: 'Password, sessions and visibility', icon: Lock, onClick: () => toast.info('Privacy settings are locked for the demo.') },
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
              { label: 'Payment Methods', description: 'Cards, UPI and payouts', icon: CreditCard, onClick: () => toast.info('Payments locked for demo.') },
              { label: 'Matchmaking Preferences', description: 'Sports, distance and skill level', icon: SlidersHorizontal, onClick: () => setActiveView('Matchmaking Preferences') },
            ]}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SettingsList
            title="Support"
            items={[
              { label: 'Help Center', description: 'FAQs and guides', icon: HelpCircle, onClick: () => setActiveView('Help Center') },
              { label: 'Report an Issue', description: 'Flag a player, game or venue', icon: Flag, onClick: () => setActiveView('Report an Issue') },
              { label: 'Terms of Service', description: 'Community rules and policies', icon: FileText, onClick: () => toast.info('Terms of Service locked for demo.') },
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

      {/* Sign Out Button */}
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