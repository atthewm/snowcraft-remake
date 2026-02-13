'use client';

import React, { useState } from 'react';
import CreditsPanel from './CreditsPanel';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export default function PauseMenu({ onResume, onRestart, onQuit, onToggleMute, isMuted }: PauseMenuProps) {
  const [showCredits, setShowCredits] = useState(false);

  if (showCredits) {
    return <CreditsPanel onBack={() => setShowCredits(false)} />;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
      <div
        className="bg-white rounded-xl p-8 min-w-[280px] shadow-xl"
        style={{ fontFamily: 'VT323, monospace' }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">PAUSED</h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="px-8 py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#2ecc71', boxShadow: '0 4px 0 #27ae60' }}
          >
            RESUME
          </button>
          <button
            onClick={onToggleMute}
            className="px-8 py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#9b59b6', boxShadow: '0 4px 0 #8e44ad' }}
          >
            {isMuted ? 'UNMUTE' : 'MUTE'} SOUND
          </button>
          <button
            onClick={onRestart}
            className="px-8 py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#f39c12', boxShadow: '0 4px 0 #e67e22' }}
          >
            RESTART LEVEL
          </button>
          <button
            onClick={() => setShowCredits(true)}
            className="px-8 py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#95a5a6', boxShadow: '0 4px 0 #7f8c8d' }}
          >
            CREDITS
          </button>
          <button
            onClick={onQuit}
            className="px-8 py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#e74c3c', boxShadow: '0 4px 0 #c0392b' }}
          >
            QUIT TO TITLE
          </button>
        </div>
      </div>
    </div>
  );
}
