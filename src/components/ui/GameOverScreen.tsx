'use client';

import React from 'react';

interface GameOverScreenProps {
  type: 'game_over' | 'level_complete' | 'victory';
  level: number;
  score: number;
  onNextLevel?: () => void;
  onRestart?: () => void;
  onQuit: () => void;
}

export default function GameOverScreen({ type, level, score, onNextLevel, onRestart, onQuit }: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
      <div
        className="bg-white rounded-xl p-8 min-w-[320px] shadow-xl text-center"
        style={{ fontFamily: 'VT323, monospace' }}
      >
        {type === 'level_complete' && (
          <>
            <h2 className="text-4xl font-bold text-green-600 mb-2">LEVEL CLEAR!</h2>
            <p className="text-xl text-gray-600 mb-1">Level {level} complete</p>
            <p className="text-2xl text-yellow-500 mb-6">Score: {score}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onNextLevel}
                className="px-8 py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#2ecc71', boxShadow: '0 4px 0 #27ae60' }}
              >
                NEXT LEVEL
              </button>
              <button
                onClick={onQuit}
                className="px-8 py-3 text-lg text-gray-600 rounded-lg transition-all hover:scale-105 active:scale-95 bg-gray-200"
              >
                QUIT TO TITLE
              </button>
            </div>
          </>
        )}

        {type === 'game_over' && (
          <>
            <h2 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h2>
            <p className="text-xl text-gray-600 mb-1">Your team was knocked out!</p>
            <p className="text-2xl text-yellow-500 mb-6">Final Score: {score}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onRestart}
                className="px-8 py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#f39c12', boxShadow: '0 4px 0 #e67e22' }}
              >
                TRY AGAIN
              </button>
              <button
                onClick={onQuit}
                className="px-8 py-3 text-lg text-gray-600 rounded-lg transition-all hover:scale-105 active:scale-95 bg-gray-200"
              >
                QUIT TO TITLE
              </button>
            </div>
          </>
        )}

        {type === 'victory' && (
          <>
            <h2 className="text-4xl font-bold text-yellow-500 mb-2">VICTORY!</h2>
            <p className="text-xl text-gray-600 mb-1">You conquered all levels!</p>
            <p className="text-3xl text-yellow-500 mb-6">Final Score: {score}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onQuit}
                className="px-8 py-3 text-xl font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#2ecc71', boxShadow: '0 4px 0 #27ae60' }}
              >
                BACK TO TITLE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
