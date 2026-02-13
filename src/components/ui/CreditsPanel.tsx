'use client';

import React from 'react';

interface CreditsPanelProps {
  onBack: () => void;
}

export default function CreditsPanel({ onBack }: CreditsPanelProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-200 to-white z-20">
      <div
        className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-xl"
        style={{ fontFamily: 'VT323, monospace' }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">ABOUT / CREDITS</h2>

        <div className="space-y-5 text-lg text-gray-700">
          <div className="bg-sky-50 rounded-lg p-4">
            <p className="text-xl font-bold text-gray-800 mb-2">Original Game</p>
            <p>Inspired by SnowCraft (Windows, 2001).</p>
            <p className="mt-1">Original developer: <strong>Nicholson NY.</strong></p>
            <p>Original publisher: <strong>Nicholson NY.</strong></p>
            <p className="mt-2">
              Source:{' '}
              <a
                href="https://www.myabandonware.com/game/snowcraft-du6#download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 break-all"
              >
                myabandonware.com/game/snowcraft-du6
              </a>
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
            <p className="text-sm text-amber-800">
              <strong>Disclaimer:</strong> This is an unofficial fan remake and is not
              affiliated with Nicholson NY. All game assets (art, code, sounds) in
              this remake are newly created and original.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xl font-bold text-gray-800 mb-2">Remake Credits</p>
            <p>Fan remake built as a modern web app.</p>
            <p className="mt-1">Engine: HTML5 Canvas + Next.js</p>
            <p>All sprites, sounds, and code: original clean-room work.</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-6 w-full py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: '#95a5a6',
            boxShadow: '0 4px 0 #7f8c8d',
          }}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
