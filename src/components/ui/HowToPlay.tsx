'use client';

import React from 'react';

interface HowToPlayProps {
  onBack: () => void;
}

export default function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-200 to-white z-20">
      <div
        className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-xl"
        style={{ fontFamily: 'VT323, monospace' }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">HOW TO PLAY</h2>

        <div className="space-y-4 text-lg text-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <strong className="text-gray-900">Select a unit:</strong>
              <br />Left-click on one of your red team characters to select them.
              Use Tab to cycle through your units.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🏃</span>
            <div>
              <strong className="text-gray-900">Move:</strong>
              <br />Right-click anywhere within the movement range (dashed circle)
              to move your selected unit there.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">❄️</span>
            <div>
              <strong className="text-gray-900">Throw snowballs:</strong>
              <br />Left-click and hold to charge up your throw power.
              Release to throw! Longer charge means more speed and damage.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <strong className="text-gray-900">Use cover:</strong>
              <br />Hide behind snow forts and obstacles to avoid enemy fire.
              Some obstacles can be destroyed!
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <strong className="text-gray-900">Win condition:</strong>
              <br />Knock out all enemy units (green team) to clear the level.
              More enemies appear in later levels!
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">⏸️</span>
            <div>
              <strong className="text-gray-900">Pause:</strong>
              <br />Press Escape to pause the game.
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-6 w-full py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: '#3498db',
            boxShadow: '0 4px 0 #2980b9',
          }}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
