
import React from 'react';
import { notificationsData } from '../data/notifications';

export default function NotificationsPage() {
  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-4">
      <h1 className="text-4xl font-display font-black text-white mb-6">NOTIFICATIONS</h1>
      <div className="space-y-3">
        {notificationsData.map((n) => (
          <div key={n.id} className="bg-[#0f0f13] border border-neutral-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-[#ff5500] uppercase tracking-wider">{n.category}</span>
            <h4 className="text-sm font-bold text-white mt-1">{n.title}</h4>
            <p className="text-xs text-neutral-400 mt-0.5">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}