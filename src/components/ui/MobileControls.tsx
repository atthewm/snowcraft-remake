'use client';

import React from 'react';

interface MobileControlsProps {
  inputMode: 'throw' | 'move';
  onToggleMode: () => void;
  onNextUnit: () => void;
  onPause: () => void;
}

export default function MobileControls({ inputMode, onToggleMode, onNextUnit, onPause }: MobileControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none font-game md:hidden">
      <div className="flex justify-between items-end p-3 pointer-events-auto">
        {/* Left side: mode toggle */}
        <button
          onClick={onToggleMode}
          className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-white text-sm font-bold shadow-lg active:scale-95 transition-transform"
          style={{
            backgroundColor: inputMode === 'throw' ? '#e74c3c' : '#3498db',
            boxShadow: `0 3px 0 ${inputMode === 'throw' ? '#c0392b' : '#2980b9'}`,
          }}
        >
          <span className="text-xl">{inputMode === 'throw' ? '❄️' : '👆'}</span>
          <span>{inputMode === 'throw' ? 'THROW' : 'MOVE'}</span>
        </button>

        {/* Center: unit cycle */}
        <button
          onClick={onNextUnit}
          className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-white text-sm font-bold shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: '#f39c12', boxShadow: '0 3px 0 #e67e22' }}
        >
          <span className="text-xl">🔄</span>
          <span>NEXT</span>
        </button>

        {/* Right: pause */}
        <button
          onClick={onPause}
          className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-white text-sm font-bold shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: '#95a5a6', boxShadow: '0 3px 0 #7f8c8d' }}
        >
          <span className="text-xl">⏸️</span>
          <span>PAUSE</span>
        </button>
      </div>
    </div>
  );
}
