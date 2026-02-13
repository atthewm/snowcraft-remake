'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { GameEngine } from '@/game/engine';

interface GameCanvasProps {
  engineRef: React.MutableRefObject<GameEngine | null>;
  onPhaseChange: (phase: string) => void;
  embedded?: boolean;
}

export default function GameCanvas({ engineRef, onPhaseChange, embedded }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    engineRef.current?.resize(w, h);
  }, [engineRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, onPhaseChange);
    engineRef.current = engine;

    handleResize();
    engine.start();

    const ro = new ResizeObserver(handleResize);
    const container = containerRef.current;
    if (container) ro.observe(container);

    return () => {
      engine.stop();
      ro.disconnect();
    };
  }, [engineRef, onPhaseChange, handleResize]);

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    engineRef.current?.handleMouseDown(x, y, e.button);
  }, [engineRef, getCanvasCoords]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    engineRef.current?.handleMouseUp(x, y, e.button);
  }, [engineRef, getCanvasCoords]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    engineRef.current?.handleMouseMove(x, y);
  }, [engineRef, getCanvasCoords]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // In embedded mode, don't steal global shortcuts
      if (embedded && !['Tab', 'Escape', ' '].includes(e.key)) return;
      if (e.key === 'Tab') e.preventDefault();
      engineRef.current?.handleKeyDown(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      engineRef.current?.handleKeyUp(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [engineRef, embedded]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-sky-100">
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onContextMenu={handleContextMenu}
      />
    </div>
  );
}
