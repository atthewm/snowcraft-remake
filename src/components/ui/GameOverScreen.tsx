'use client';

import React, { useState, useCallback } from 'react';

interface GameOverScreenProps {
  type: 'game_over' | 'level_complete' | 'victory';
  level: number;
  score: number;
  onNextLevel?: () => void;
  onRestart?: () => void;
  onQuit: () => void;
}

function ShareButton({ score, level, type }: { score: number; level: number; type: string }) {
  const [copied, setCopied] = useState(false);

  const shareText = type === 'victory'
    ? `I conquered all 10 levels of SnowCraft with a score of ${score}! Can you beat it?`
    : `I scored ${score} on level ${level} in SnowCraft! Can you beat it?`;

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'SnowCraft',
      text: shareText,
      url: typeof window !== 'undefined' ? window.location.href : 'https://snowcraft.vercel.app',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareData.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }, [shareText]);

  return (
    <button
      onClick={handleShare}
      className="px-8 py-3 text-lg font-bold text-white rounded-lg transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      style={{ backgroundColor: '#3498db', boxShadow: '0 4px 0 #2980b9' }}
    >
      {copied ? 'COPIED!' : 'SHARE SCORE'}
    </button>
  );
}

export default function GameOverScreen({ type, level, score, onNextLevel, onRestart, onQuit }: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
      <div className="bg-white rounded-xl p-8 min-w-[320px] shadow-xl text-center font-game">
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
              <ShareButton score={score} level={level} type={type} />
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
              <ShareButton score={score} level={level} type={type} />
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
              <ShareButton score={score} level={level} type={type} />
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
