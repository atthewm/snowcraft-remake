'use client';

import React, { useState } from 'react';
import { Difficulty } from '@/game/types';
import DifficultySelector from './DifficultySelector';

interface TitleScreenProps {
  onStart: (difficulty: Difficulty) => void;
  onHowToPlay: () => void;
  onCredits: () => void;
  onLevelSelect: () => void;
  onLeaderboard: () => void;
}

export default function TitleScreen({ onStart, onHowToPlay, onCredits, onLevelSelect, onLeaderboard }: TitleScreenProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-white z-20 font-game">
      {/* Falling snowflakes background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-60 snowflake-fall"
            style={{
              left: `${(i * 37) % 100}%`,
              fontSize: `${8 + (i % 4) * 4}px`,
              animationDuration: `${4 + (i % 5) * 2}s`,
              animationDelay: `${(i * 0.4) % 4}s`,
            }}
          >
            *
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="relative mb-8 text-center">
        <h1
          className="text-6xl font-bold tracking-wider font-game"
          style={{
            color: '#2c3e50',
            textShadow: '3px 3px 0 #bdc3c7, 0 0 20px rgba(52, 152, 219, 0.3)',
            fontSize: '72px',
          }}
        >
          SNOWCRAFT
        </h1>
        <p
          className="mt-2 text-lg tracking-widest font-game"
          style={{ color: '#7f8c8d' }}
        >
          A Fan Remake
        </p>
      </div>

      {/* Snow character decoration */}
      <div className="relative mb-6">
        <svg width="80" height="80" viewBox="0 0 80 80" aria-label="Snowman character">
          <circle cx="40" cy="55" r="18" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="1.5" />
          <circle cx="40" cy="30" r="13" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="1.5" />
          <rect x="32" y="12" width="16" height="8" rx="1" fill="#e74c3c" />
          <rect x="29" y="20" width="22" height="4" rx="1" fill="#c0392b" />
          <circle cx="36" cy="27" r="2" fill="#2c3e50" />
          <circle cx="44" cy="27" r="2" fill="#2c3e50" />
          <rect x="30" y="40" width="20" height="5" rx="2" fill="#2ecc71" />
          <rect x="46" y="41" width="6" height="12" rx="2" fill="#27ae60" />
        </svg>
      </div>

      {/* Difficulty selector */}
      <div className="mb-4 z-10">
        <DifficultySelector selected={difficulty} onChange={setDifficulty} />
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-3 z-10">
        <button
          onClick={() => onStart(difficulty)}
          className="px-12 py-3 text-2xl font-bold text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          style={{
            backgroundColor: '#e74c3c',
            boxShadow: '0 4px 0 #c0392b, 0 6px 20px rgba(0,0,0,0.15)',
          }}
        >
          START GAME
        </button>
        <div className="flex gap-3">
          <button
            onClick={onLevelSelect}
            className="flex-1 px-4 py-3 text-lg font-bold text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            style={{
              backgroundColor: '#9b59b6',
              boxShadow: '0 4px 0 #8e44ad, 0 6px 20px rgba(0,0,0,0.15)',
            }}
          >
            LEVELS
          </button>
          <button
            onClick={onLeaderboard}
            className="flex-1 px-4 py-3 text-lg font-bold text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            style={{
              backgroundColor: '#f39c12',
              boxShadow: '0 4px 0 #e67e22, 0 6px 20px rgba(0,0,0,0.15)',
            }}
          >
            SCORES
          </button>
        </div>
        <button
          onClick={onHowToPlay}
          className="px-12 py-3 text-2xl font-bold text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          style={{
            backgroundColor: '#3498db',
            boxShadow: '0 4px 0 #2980b9, 0 6px 20px rgba(0,0,0,0.15)',
          }}
        >
          HOW TO PLAY
        </button>
        <button
          onClick={onCredits}
          className="px-12 py-3 text-2xl font-bold text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          style={{
            backgroundColor: '#95a5a6',
            boxShadow: '0 4px 0 #7f8c8d, 0 6px 20px rgba(0,0,0,0.15)',
          }}
        >
          ABOUT / CREDITS
        </button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 text-xs text-gray-400">
        v1.1 &middot; 2026
      </p>
    </div>
  );
}
