import React, { useState, useEffect } from 'react';
import { Bell, UserPlus, Calendar, Award, Clock, Check, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  // Generate a fresh set of random notifications every time the component loads
  useEffect(() => {
    const names = ['Rohan', 'Kabir', 'Priya', 'Amit', 'Neha', 'Vikram', 'Ananya', 'Aditi'];
    const sports = ['Football', 'Cricket', 'Basketball', 'Badminton', 'Tennis', 'Volleyball'];
    const venues = ['Eco Park Arena', 'Salt Lake Stadium', 'Netaji Indoor', 'Maidan Grounds', 'South Club'];
    
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    // Generate a random future date within the next 7 days
    const getFutureDate = () => {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 6) + 1);
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const freshNotifications = [
      {
        id: 1,
        type: 'join',
        title: 'New Squad Member',
        message: `${getRandom(names)} (96% Reliability) just joined your ${getRandom(sports)} space at ${getRandom(venues)}.`,
        time: 'Just now',
        read: false,
        icon: UserPlus,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10 border-blue-500/20'
      },
      {
        id: 2,
        type: 'system',
        title: 'Prime Time Available',
        message: `Your schedule looks clear on ${getFutureDate()}. It's a perfect day to host a ${getRandom(sports)} match!`,
        time: '2 hours ago',
        read: false,
        icon: Calendar,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10 border-emerald-500/20'
      },
      {
        id: 3,
        type: 'reminder',
        title: 'Game Starting Soon',
        message: `Don't forget your ${getRandom(sports)} game starts at 6:00 PM today. Don't play short!`,
        time: '5 hours ago',
        read: true,
        icon: Clock,
        color: 'text-[#ff5500]',
        bg: 'bg-[#ff5500]/10 border-[#ff5500]/20'
      },
      {
        id: 4,
        type: 'reliability',
        title: 'Reliability Boost',
        message: `You successfully attended your last 3 matches! Your Reliability Score is holding strong at 98%.`,
        time: '1 day ago',
        read: true,
        icon: Award,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10 border-purple-500/20'
      }
    ];

    setNotifications(freshNotifications);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-white mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#ff5500]" /> NOTIFICATIONS.
          </h1>
          <p className="text-neutral-400 font-semibold text-sm">Stay updated on your squads and match invites.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={markAllAsRead}
            className="p-2 bg-[#0f0f13] border border-neutral-800 hover:border-neutral-600 rounded-xl text-neutral-400 hover:text-white transition group flex items-center gap-2 text-xs font-bold"
            title="Mark all as read"
          >
            <Check className="w-4 h-4" /> <span className="hidden sm:inline">READ ALL</span>
          </button>
          <button 
            onClick={clearNotifications}
            className="p-2 bg-[#0f0f13] border border-neutral-800 hover:border-red-500/50 rounded-xl text-neutral-400 hover:text-red-500 transition group flex items-center gap-2 text-xs font-bold"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">CLEAR</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-neutral-800 rounded-2xl bg-[#0f0f13]/50">
            <Bell className="w-8 h-8 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 font-bold mb-1">You're all caught up!</p>
            <p className="text-xs text-neutral-500">No new notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div 
                key={notif.id} 
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
                  <div className={`p-3 rounded-xl border shrink-0 ${notif.bg}`}>
                    <Icon className={`w-5 h-5 ${notif.color}`} />
                  </div>
                  
                  <div className="pr-4">
                    <h4 className={`text-sm font-bold mb-1 ${notif.read ? 'text-neutral-300' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      {notif.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}