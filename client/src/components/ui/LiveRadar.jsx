import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function LiveRadar({ onComplete }) {
  const [pings, setPings] = useState([]);

  useEffect(() => {
    // Simulate "finding" players dynamically as the radar sweeps
    const timers = [
      setTimeout(() => setPings(p => [...p, { id: 1, top: '25%', left: '35%' }]), 600),
      setTimeout(() => setPings(p => [...p, { id: 2, top: '65%', left: '70%' }]), 1200),
      setTimeout(() => setPings(p => [...p, { id: 3, top: '40%', left: '80%' }]), 1800),
      // Finish the scanning animation after 2.5 seconds
      setTimeout(() => { if (onComplete) onComplete(); }, 2500) 
    ];
    
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-[55vh] animate-in fade-in duration-500">
      {/* The Radar Circle */}
      <div className="relative w-64 h-64 rounded-full border border-[#ff5500]/40 bg-[#08080a] overflow-hidden shadow-[0_0_40px_rgba(255,85,0,0.15)] flex items-center justify-center">
        
        {/* Concentric Distance Rings */}
        <div className="absolute w-48 h-48 rounded-full border border-[#ff5500]/20" />
        <div className="absolute w-32 h-32 rounded-full border border-[#ff5500]/20" />
        <div className="absolute w-16 h-16 rounded-full border border-[#ff5500]/20" />
        
        {/* You (Center Blip) */}
        <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white] z-10" />

        {/* The Sweeping Radar Cone */}
        <div 
          className="absolute inset-0 z-0 origin-center animate-[spin_2s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(255,85,0,0.7) 360deg)'
          }}
        />

        {/* The Discovered Players (Pings) */}
        {pings.map(ping => (
          <div 
            key={ping.id} 
            className="absolute w-3 h-3 z-20"
            style={{ top: ping.top, left: ping.left }}
          >
            {/* Pulsing dot effect */}
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
            <div className="relative w-full h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#34d399]" />
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h3 className="text-xl font-black text-[#ff5500] tracking-[0.2em] uppercase animate-pulse mb-2">
          Scanning Area
        </h3>
        <p className="text-neutral-500 text-sm flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" /> Locating athletes near you...
        </p>
      </div>
    </div>
  );
}