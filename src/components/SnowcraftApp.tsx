'use client';

import React, { useRef, useState, useCallback } from 'react';
import GameCanvas from './GameCanvas';
import TitleScreen from './ui/TitleScreen';
import HowToPlay from './ui/HowToPlay';
import CreditsPanel from './ui/CreditsPanel';
import PauseMenu from './ui/PauseMenu';
import HUD from './ui/HUD';
import GameOverScreen from './ui/GameOverScreen';
import { GameEngine } from '@/game/engine';
import { setMuted, isMuted } from '@/game/audio/soundManager';

interface SnowcraftAppProps {
  mode?: 'standalone' | 'embedded';
  hideChrome?: boolean;
}

export default function SnowcraftApp({ mode = 'standalone', hideChrome = false }: SnowcraftAppProps) {
  const engineRef = useRef<GameEngine | null>(null);
  const [phase, setPhase] = useState<string>('title');
  const [muted, setMutedState] = useState(false);
  const [, forceUpdate] = useState(0);

  const handlePhaseChange = useCallback((newPhase: string) => {
    setPhase(newPhase);
    // Force re-render to update HUD
    forceUpdate(n => n + 1);
  }, []);

  const handleStart = useCallback(() => {
    engineRef.current?.startGame();
  }, []);

  const handleHowToPlay = useCallback(() => {
    setPhase('how_to_play');
  }, []);

  const handleCredits = useCallback(() => {
    setPhase('credits');
  }, []);

  const handleBackToTitle = useCallback(() => {
    setPhase('title');
    if (engineRef.current) {
      engineRef.current.setPhase('title');
    }
  }, []);

  const handleResume = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.setPhase('playing');
    }
  }, []);

  const handleRestart = useCallback(() => {
    engineRef.current?.restartLevel();
  }, []);

  const handleNextLevel = useCallback(() => {
    engineRef.current?.nextLevel();
  }, []);

  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted();
    setMuted(newMuted);
    setMutedState(newMuted);
  }, []);

  const gameState = engineRef.current?.getState();

  return (
    <div
      className={`relative overflow-hidden bg-sky-100 ${
        mode === 'standalone' && !hideChrome ? 'w-screen h-screen' : 'w-full h-full'
      }`}
      style={{ minWidth: 320, minHeight: 240 }}
    >
      {/* Google Fonts for retro look */}
      <link
        href="https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      {/* Game canvas (always rendered) */}
      <GameCanvas
        engineRef={engineRef}
        onPhaseChange={handlePhaseChange}
        embedded={mode === 'embedded'}
      />

      {/* UI overlay based on phase */}
      {phase === 'title' && (
        <TitleScreen
          onStart={handleStart}
          onHowToPlay={handleHowToPlay}
          onCredits={handleCredits}
        />
      )}

      {phase === 'how_to_play' && (
        <HowToPlay onBack={handleBackToTitle} />
      )}

      {phase === 'credits' && (
        <CreditsPanel onBack={handleBackToTitle} />
      )}

      {phase === 'playing' && gameState && (
        <HUD state={gameState} />
      )}

      {phase === 'paused' && (
        <PauseMenu
          onResume={handleResume}
          onRestart={handleRestart}
          onQuit={handleBackToTitle}
          onToggleMute={handleToggleMute}
          isMuted={muted}
        />
      )}

      {phase === 'level_complete' && gameState && (
        <GameOverScreen
          type="level_complete"
          level={gameState.level}
          score={gameState.score}
          onNextLevel={handleNextLevel}
          onQuit={handleBackToTitle}
        />
      )}

      {phase === 'game_over' && gameState && (
        <GameOverScreen
          type="game_over"
          level={gameState.level}
          score={gameState.score}
          onRestart={handleRestart}
          onQuit={handleBackToTitle}
        />
      )}

      {phase === 'victory' && gameState && (
        <GameOverScreen
          type="victory"
          level={gameState.level}
          score={gameState.score}
          onQuit={handleBackToTitle}
        />
      )}
    </div>
  );
}
