'use client';

import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onReady }: { onReady: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Quick simulated load (fonts + assets are tiny)
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setProgress(Math.min(100, frame * 12));
      if (frame >= 9) {
        clearInterval(interval);
        setTimeout(onReady, 150);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [onReady]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 via-sky-200 to-white z-50 font-game">
      {/* Snowflake spinner */}
      <div className="text-5xl mb-6 animate-spin" style={{ animationDuration: '3s' }}>
        ❄️
      </div>

      <h1 className="text-4xl font-bold text-gray-700 mb-6" style={{ textShadow: '2px 2px 0 #bdc3c7' }}>
        SNOWCRAFT
      </h1>

      {/* Progress bar */}
      <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            backgroundColor: '#3498db',
          }}
        />
      </div>

      <p className="mt-3 text-sm text-gray-400">Loading...</p>
    </div>
  );
}
