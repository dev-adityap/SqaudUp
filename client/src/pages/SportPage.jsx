import React from 'react';
import { useParams } from 'react-router-dom';
import { sportsData } from '../data/sports';

export default function SportPage() {
  const { sport } = useParams();
  const data = sportsData.find((s) => s.id === sport) || sportsData[0];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-display font-black text-white uppercase">{data.name}</h1>
      <p className="text-neutral-400 mt-2">{data.description}</p>
      <div className="mt-8 rounded-2xl overflow-hidden border border-neutral-800 h-80">
        <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}