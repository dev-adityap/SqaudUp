import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, MapPin, Calendar, Activity } from 'lucide-react';
import { API_BASE } from '../utils/api';

const COLORS = ['#ff5500', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

export default function AthleteProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/${id}/profile`);
        const json = await res.json();
        if (json.success) {
          setProfileData(json.data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="pt-32 text-center font-bold text-neutral-500 animate-pulse">Loading Athlete Data...</div>;
  }

  if (!profileData || !profileData.user) {
    return <div className="pt-32 text-center text-red-500 font-bold">Athlete not found.</div>;
  }

  const { user, sportDistribution, recentGames } = profileData;
  const sports = sportDistribution || [];
  const history = recentGames || [];
  const flakes = Math.max(0, (user.gamesPlayed || 0) - (user.gamesAttended || 0));

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* HEADER SECTION */}
      <div className="bg-[#0f0f13] border border-neutral-800 rounded-3xl p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-neutral-900 border-4 border-neutral-800 flex items-center justify-center text-[#ff5500] text-5xl font-black shadow-[0_0_30px_rgba(255,85,0,0.15)]">
          {(user.username || '?').charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">@{user.username}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${
              (user.reliabilityScore || 100) >= 90 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50' : 
              (user.reliabilityScore || 100) >= 70 ? 'bg-orange-500/10 text-orange-500 border-orange-500/50' : 
              'bg-red-500/10 text-red-500 border-red-500/50'
            }`}>
              {user.reliabilityScore || 100}% Reliability
            </span>
            <span className="text-neutral-500 text-sm font-bold"><Activity className="w-4 h-4 inline mr-1" /> Active Athlete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* STATS & CHARTS COLUMN */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-5 text-center">
              <p className="text-3xl font-black text-white">{user.gamesPlayed || 0}</p>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">Played</p>
            </div>
            <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-5 text-center">
              <p className="text-3xl font-black text-white">{user.gamesAttended || 0}</p>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">Attended</p>
            </div>
            <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-5 text-center">
              <p className="text-3xl font-black text-red-500">{flakes}</p>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">Flakes</p>
            </div>
          </div>

          {/* Recharts Donut Chart */}
          <div className="bg-[#0f0f13] border border-neutral-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Sport Distribution</h3>
            {sports.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sports}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      stroke="none"
                    >
                      {sports.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f0f13', borderColor: '#262626', color: '#fff', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Legend
                      formatter={(value) => value.toUpperCase()}
                      wrapperStyle={{ color: '#a3a3a3', fontSize: 11, fontWeight: 700, paddingTop: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-neutral-600 font-bold">No data yet.</div>
            )}
          </div>
        </div>

        {/* RECENT HISTORY COLUMN */}
        <div className="lg:col-span-2">
          <div className="bg-[#0f0f13] border border-neutral-800 rounded-3xl p-6 shadow-xl h-full">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Recent Matches</h3>
            
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map(game => (
                  <div key={game.id} className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl p-5 transition-colors cursor-pointer" onClick={() => navigate(`/games/${game.id}`)}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-black text-white text-lg uppercase tracking-tight group-hover:text-[#ff5500] transition-colors">{game.sport}</h4>
                      <span className="bg-neutral-800 px-3 py-1 rounded-full text-[10px] font-bold text-[#ff5500] uppercase tracking-wider">{game.status}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-neutral-500 font-medium">
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {game.date?.substring(0, 10) || 'TBD'}</span>
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {game.venue || 'Local Venue'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-500 py-10 text-center font-bold">No recent matches found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}