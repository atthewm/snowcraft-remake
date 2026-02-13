'use client';

import React from 'react';
import { GameState } from '@/game/types';
import { levels } from '@/game/levels/levelData';

interface HUDProps {
  state: GameState;
}

export default function HUD({ state }: HUDProps) {
  const playerUnits = state.units.filter(u => u.team === 'red');
  const enemyUnits = state.units.filter(u => u.team === 'green');
  const playersAlive = playerUnits.filter(u => !u.isKnockedOut).length;
  const enemiesAlive = enemyUnits.filter(u => !u.isKnockedOut).length;
  const levelName = levels[Math.min(state.level - 1, levels.length - 1)]?.name ?? '';

  return (
    <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
      <div
        className="flex justify-between items-start p-3 text-sm"
        style={{ fontFamily: 'VT323, monospace' }}
      >
        {/* Level info */}
        <div className="bg-black/50 text-white px-3 py-2 rounded-lg">
          <div className="text-lg font-bold">Level {state.level}</div>
          <div className="text-xs text-gray-300">{levelName}</div>
          <div className="text-yellow-300 mt-1">Score: {state.score}</div>
        </div>

        {/* Team status */}
        <div className="flex gap-4">
          {/* Player team */}
          <div className="bg-black/50 text-white px-3 py-2 rounded-lg flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-lg">{playersAlive}/{playerUnits.length}</span>
          </div>

          {/* Enemy team */}
          <div className="bg-black/50 text-white px-3 py-2 rounded-lg flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-lg">{enemiesAlive}/{enemyUnits.length}</span>
          </div>
        </div>
      </div>

      {/* Selected unit info */}
      {state.selectedUnitId && (() => {
        const selected = state.units.find(u => u.id === state.selectedUnitId);
        if (!selected || selected.isKnockedOut) return null;
        return (
          <div
            className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-2 rounded-lg"
            style={{ fontFamily: 'VT323, monospace' }}
          >
            <div className="text-xs text-gray-300">Selected Unit</div>
            <div className="flex items-center gap-2 mt-1">
              <span>HP:</span>
              <div className="w-20 h-2 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(selected.hp / selected.maxHp) * 100}%`,
                    backgroundColor: selected.hp > 50 ? '#2ecc71' : selected.hp > 25 ? '#f39c12' : '#e74c3c',
                  }}
                />
              </div>
              <span className="text-xs">{Math.ceil(selected.hp)}</span>
            </div>
            {selected.cooldown > 0 && (
              <div className="text-xs text-yellow-300 mt-1">Reloading...</div>
            )}
          </div>
        );
      })()}

      {/* Controls hint */}
      <div
        className="absolute bottom-3 right-3 bg-black/30 text-white/70 px-3 py-2 rounded-lg text-xs"
        style={{ fontFamily: 'VT323, monospace' }}
      >
        <div>LMB: Select / Charge throw</div>
        <div>RMB: Move</div>
        <div>Tab: Next unit | Esc: Pause</div>
      </div>
    </div>
  );
}
