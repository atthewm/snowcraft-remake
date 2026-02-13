'use client';

import React from 'react';

interface TitleScreenProps {
  onStart: () => void;
  onHowToPlay: () => void;
  onCredits: () => void;
}

export default function TitleScreen({ onStart, onHowToPlay, onCredits }: TitleScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-white z-20">
      {/* Falling snowflakes background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-60 animate-bounce"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 100}%`,
              fontSize: `${8 + (i % 4) * 4}px`,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }}
          >
            *
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="relative mb-12 text-center">
        <h1
          className="text-6xl font-bold tracking-wider"
          style={{
            fontFamily: 'VT323, monospace',
            color: '#2c3e50',
            textShadow: '3px 3px 0 #bdc3c7, 0 0 20px rgba(52, 152, 219, 0.3)',
            fontSize: '72px',
          }}
        >
          SNOWCRAFT
        </h1>
        <p
          className="mt-2 text-lg tracking-widest"
          style={{
            fontFamily: 'VT323, monospace',
            color: '#7f8c8d',
          }}
        >
          A Fan Remake
        </p>
      </div>

      {/* Snow character decoration */}
      <div className="relative mb-8">
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* Body */}
          <circle cx="40" cy="55" r="18" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="1.5" />
          <circle cx="40" cy="30" r="13" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="1.5" />
          {/* Hat */}
          <rect x="32" y="12" width="16" height="8" rx="1" fill="#e74c3c" />
          <rect x="29" y="20" width="22" height="4" rx="1" fill="#c0392b" />
          {/* Eyes */}
          <circle cx="36" cy="27" r="2" fill="#2c3e50" />
          <circle cx="44" cy="27" r="2" fill="#2c3e50" />
          {/* Scarf */}
          <rect x="30" y="40" width="20" height="5" rx="2" fill="#2ecc71" />
          <rect x="46" y="41" width="6" height="12" rx="2" fill="#27ae60" />
        </svg>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-3 z-10">
        <button
          onClick={onStart}
          className="px-12 py-3 text-xl font-bold text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          style={{
            fontFamily: 'VT323, monospace',
            fontSize: '24px',
            backgroundColor: '#e74c3c',
            boxShadow: '0 4px 0 #c0392b, 0 6px 20px rgba(0,0,0,0.15)',
          }}
        >
          START GAME
        </button>
        <button
          onClick={onHowToPlay}
          className="px-12 py-3 text-xl font-bold text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          style={{
            fontFamily: 'VT323, monospace',
            fontSize: '24px',
            backgroundColor: '#3498db',
            boxShadow: '0 4px 0 #2980b9, 0 6px 20px rgba(0,0,0,0.15)',
          }}
        >
          HOW TO PLAY
        </button>
        <button
          onClick={onCredits}
          className="px-12 py-3 text-xl font-bold text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          style={{
            fontFamily: 'VT323, monospace',
            fontSize: '24px',
            backgroundColor: '#95a5a6',
            boxShadow: '0 4px 0 #7f8c8d, 0 6px 20px rgba(0,0,0,0.15)',
          }}
        >
          ABOUT / CREDITS
        </button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 text-xs text-gray-400" style={{ fontFamily: 'VT323, monospace' }}>
        v1.0 &middot; 2026
      </p>
    </div>
  );
}
