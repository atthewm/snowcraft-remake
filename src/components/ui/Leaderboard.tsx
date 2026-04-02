'use client';

import React from 'react';
import { HighScore } from '@/game/types';

interface LeaderboardProps {
  scores: HighScore[];
  onBack: () => void;
}

export default function Leaderboard({ scores, onBack }: LeaderboardProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-200 to-white z-20">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl font-game">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">HIGH SCORES</h2>

        {scores.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-8">No scores yet. Play a game!</p>
        ) : (
          <div className="space-y-2 mb-6">
            <div className="flex text-xs text-gray-400 px-3">
              <span className="w-8">#</span>
              <span className="flex-1">Score</span>
              <span className="w-16 text-center">Level</span>
              <span className="w-16 text-center">Diff</span>
              <span className="w-20 text-right">Date</span>
            </div>
            {scores.map((s, i) => (
              <div
                key={i}
                className={`flex items-center text-sm px-3 py-2 rounded-lg ${
                  i === 0 ? 'bg-yellow-50 text-yellow-800' :
                  i === 1 ? 'bg-gray-50 text-gray-700' :
                  i === 2 ? 'bg-orange-50 text-orange-800' :
                  'bg-white text-gray-600'
                }`}
              >
                <span className="w-8 font-bold">{i + 1}</span>
                <span className="flex-1 font-bold text-lg">{s.score}</span>
                <span className="w-16 text-center">{s.level}</span>
                <span className="w-16 text-center capitalize">{s.difficulty}</span>
                <span className="w-20 text-right text-xs">{s.date}</span>
              </div>
            ))}
          </div>
        )}

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
