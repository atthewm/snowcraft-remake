'use client';

import React from 'react';
import { Difficulty } from '@/game/types';

interface DifficultySelectorProps {
  selected: Difficulty;
  onChange: (d: Difficulty) => void;
}

const options: { value: Difficulty; label: string; color: string; shadow: string; desc: string }[] = [
  { value: 'easy', label: 'EASY', color: '#2ecc71', shadow: '#27ae60', desc: 'Weaker enemies, more healing' },
  { value: 'normal', label: 'NORMAL', color: '#f39c12', shadow: '#e67e22', desc: 'Balanced challenge' },
  { value: 'hard', label: 'HARD', color: '#e74c3c', shadow: '#c0392b', desc: 'Tougher, faster, less mercy' },
];

export default function DifficultySelector({ selected, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95 ${
            selected === opt.value ? 'ring-2 ring-yellow-400 ring-offset-2' : 'opacity-70'
          }`}
          style={{
            backgroundColor: opt.color,
            boxShadow: `0 3px 0 ${opt.shadow}`,
          }}
          title={opt.desc}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
