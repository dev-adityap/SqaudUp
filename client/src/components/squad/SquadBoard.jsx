import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

// 1. Dynamic Configurations for Different Sports
const FORMATION_CONFIG = {
  football: {
    bg: 'bg-emerald-900/20 border-emerald-900/50',
    positions: [
      { id: 'str', label: 'STR', top: '15%', left: '50%' },
      { id: 'mid', label: 'MID', top: '45%', left: '50%' },
      { id: 'def', label: 'DEF', top: '70%', left: '50%' },
      { id: 'gk', label: 'GK', top: '90%', left: '50%' },
    ]
  },
  tennis: {
    bg: 'bg-blue-900/20 border-blue-900/50',
    positions: [
      { id: 'p1', label: 'P1', top: '50%', left: '25%' },
      { id: 'p2', label: 'P2', top: '50%', left: '75%' },
    ]
  },
  basketball: {
    bg: 'bg-orange-900/20 border-orange-900/50',
    positions: [
      { id: 'pg', label: 'PG', top: '20%', left: '50%' },
      { id: 'sg', label: 'SG', top: '45%', left: '25%' },
      { id: 'sf', label: 'SF', top: '45%', left: '75%' },
      { id: 'pf', label: 'PF', top: '75%', left: '35%' },
      { id: 'c', label: 'C', top: '75%', left: '65%' },
    ]
  },
  default: {
    bg: 'bg-neutral-900/20 border-neutral-800',
    positions: [
      { id: 'p1', label: 'P1', top: '50%', left: '25%' },
      { id: 'p2', label: 'P2', top: '50%', left: '75%' },
    ]
  }
};

// 2. The Player (Draggable)
function PlayerToken({ id, name }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-12 h-12 bg-[#ff5500] text-white font-bold rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-2 border-white"
    >
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}

// 3. The Position on the Pitch (Droppable)
function PitchPosition({ id, label, top, left, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`absolute w-20 h-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
        isOver ? 'border-[#ff5500] bg-orange-950/30' : 'border-neutral-600 bg-neutral-900/50'
      }`}
      style={{ top, left, transform: 'translate(-50%, -50%)' }} // Perfectly centers the circle on the coordinate
    >
      {children || <span className="text-xs text-neutral-500 font-bold">{label}</span>}
    </div>
  );
}

// 4. The Main Board
export default function SquadBoard({ sport = 'football' }) {
  // Grab the correct layout based on the sport prop
  const normalizedSport = sport?.toLowerCase();
  const config = FORMATION_CONFIG[normalizedSport] || FORMATION_CONFIG.default;

  const [positions, setPositions] = useState({});
  const [bench, setBench] = useState([
    { id: 'player-1', name: 'Aditya' },
    { id: 'player-2', name: 'Tanuj' },
    { id: 'player-3', name: 'Rahul' },
  ]);

  // Reset the board if the sport changes
  useEffect(() => {
    setPositions({});
  }, [sport]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const playerId = active.id;
    const positionId = over.id;

    const playerToMove = bench.find(p => p.id === playerId);
    if (!playerToMove) return;

    setPositions(prev => ({ ...prev, [positionId]: playerToMove }));
    setBench(prev => prev.filter(p => p.id !== playerId));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-6 bg-black border border-neutral-800 rounded-2xl w-full">
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5500]"></span>
          SQUAD FORMATION
        </h2>
        
        {/* The Pitch Container */}
        <div className={`relative w-full h-80 rounded-xl border ${config.bg} mb-8 overflow-hidden transition-colors duration-500`}>
          {config.positions.map((pos) => (
            <PitchPosition key={pos.id} id={pos.id} label={pos.label} top={pos.top} left={pos.left}>
              {positions[pos.id] && (
                <PlayerToken id={positions[pos.id].id} name={positions[pos.id].name} />
              )}
            </PitchPosition>
          ))}
        </div>

        {/* The Bench */}
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
          <h3 className="text-xs text-neutral-500 font-bold uppercase mb-4">BENCH</h3>
          <div className="flex gap-4 flex-wrap">
            {bench.map(player => (
              <PlayerToken key={player.id} id={player.id} name={player.name} />
            ))}
            {bench.length === 0 && <span className="text-sm text-neutral-500">Bench is empty!</span>}
          </div>
        </div>
      </div>
    </DndContext>
  );
}