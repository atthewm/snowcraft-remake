'use client';

import React, { useState } from 'react';
import { levels } from '@/game/levels/levelData';
import { Difficulty } from '@/game/types';
import DifficultySelector from './DifficultySelector';

interface LevelSelectProps {
  unlockedLevel: number;
  onSelectLevel: (level: number, difficulty: Difficulty) => void;
  onBack: () => void;
}

export default function LevelSelect({ unlockedLevel, onSelectLevel, onBack }: LevelSelectProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-200 to-white z-20">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-xl font-game">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">LEVEL SELECT</h2>

        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {levels.map((lvl, i) => {
            const levelNum = i + 1;
            const locked = levelNum > unlockedLevel;
            return (
              <button
                key={lvl.id}
                onClick={() => !locked && onSelectLevel(levelNum, difficulty)}
                disabled={locked}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-center transition-all ${
                  locked
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-sky-100 text-gray-800 hover:scale-105 active:scale-95 hover:bg-sky-200'
                }`}
              >
                <span className="text-xl font-bold">{locked ? '🔒' : levelNum}</span>
                {!locked && (
                  <span className="text-[10px] leading-tight mt-1 text-gray-500 truncate w-full px-1">
                    {lvl.name.split(' ')[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onBack}
          className="w-full py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#95a5a6', boxShadow: '0 4px 0 #7f8c8d' }}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
