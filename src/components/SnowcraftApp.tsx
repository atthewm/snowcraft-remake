'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import GameCanvas from './GameCanvas';
import TitleScreen from './ui/TitleScreen';
import HowToPlay from './ui/HowToPlay';
import CreditsPanel from './ui/CreditsPanel';
import PauseMenu from './ui/PauseMenu';
import HUD from './ui/HUD';
import GameOverScreen from './ui/GameOverScreen';
import LevelSelect from './ui/LevelSelect';
import Leaderboard from './ui/Leaderboard';
import MobileControls from './ui/MobileControls';
import LoadingScreen from './ui/LoadingScreen';
import { GameEngine } from '@/game/engine';
import { Difficulty } from '@/game/types';
import { setMuted, isMuted, setVolume, getVolume } from '@/game/audio/soundManager';
import { getHighScores, saveHighScore, getUnlockedLevel, unlockLevel } from '@/lib/storage';
import { playSelect } from '@/game/audio/soundManager';
import { selectNextUnit } from '@/game/state';

interface SnowcraftAppProps {
  mode?: 'standalone' | 'embedded';
  hideChrome?: boolean;
}

export default function SnowcraftApp({ mode = 'standalone', hideChrome = false }: SnowcraftAppProps) {
  const engineRef = useRef<GameEngine | null>(null);
  const [phase, setPhase] = useState<string>('title');
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const [, forceUpdate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handlePhaseChange = useCallback((newPhase: string) => {
    setPhase(newPhase);
    forceUpdate(n => n + 1);
  }, []);

  const handleStart = useCallback((difficulty: Difficulty) => {
    engineRef.current?.startGame(difficulty);
  }, []);

  const handleStartFromLevel = useCallback((level: number, difficulty: Difficulty) => {
    engineRef.current?.startFromLevel(level, difficulty);
  }, []);

  const handleHowToPlay = useCallback(() => {
    setPhase('how_to_play');
  }, []);

  const handleCredits = useCallback(() => {
    setPhase('credits');
  }, []);

  const handleLevelSelect = useCallback(() => {
    setPhase('level_select');
  }, []);

  const handleLeaderboard = useCallback(() => {
    setPhase('leaderboard');
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
    const engine = engineRef.current;
    if (engine) {
      const state = engine.getState();
      // Unlock the next level
      unlockLevel(state.level + 1);
    }
    engineRef.current?.nextLevel();
  }, []);

  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted();
    setMuted(newMuted);
    setMutedState(newMuted);
  }, []);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    setVolumeState(v);
  }, []);

  const handleToggleInputMode = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      const state = engine.getState();
      state.inputMode = state.inputMode === 'throw' ? 'move' : 'throw';
      forceUpdate(n => n + 1);
    }
  }, []);

  const handleMobileNextUnit = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      selectNextUnit(engine.getState());
      playSelect();
      forceUpdate(n => n + 1);
    }
  }, []);

  const handleMobilePause = useCallback(() => {
    const engine = engineRef.current;
    if (engine && engine.getState().phase === 'playing') {
      engine.setPhase('paused');
    }
  }, []);

  // Save score on game over / victory
  const handleQuitWithScore = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      const state = engine.getState();
      if (state.score > 0) {
        saveHighScore(state.score, state.level, state.difficulty);
      }
    }
    handleBackToTitle();
  }, [handleBackToTitle]);

  const handleGameOverQuit = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      const state = engine.getState();
      if (state.score > 0) {
        saveHighScore(state.score, state.level, state.difficulty);
      }
    }
    handleBackToTitle();
  }, [handleBackToTitle]);

  const handleVictoryQuit = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      const state = engine.getState();
      saveHighScore(state.score, state.level, state.difficulty);
      unlockLevel(11); // All levels unlocked
    }
    handleBackToTitle();
  }, [handleBackToTitle]);

  const gameState = engineRef.current?.getState();

  if (loading) {
    return <LoadingScreen onReady={() => setLoading(false)} />;
  }

  return (
    <ErrorBoundary>
      <div
        className={`relative overflow-hidden bg-sky-100 ${
          mode === 'standalone' && !hideChrome ? 'w-screen h-screen' : 'w-full h-full'
        }`}
        style={{ minWidth: 320, minHeight: 240 }}
      >
        {/* Game canvas (always rendered) */}
        <GameCanvas
          engineRef={engineRef}
          onPhaseChange={handlePhaseChange}
          embedded={mode === 'embedded'}
        />

        {/* UI overlay based on phase (hidden when hideChrome is true) */}
        {!hideChrome && phase === 'title' && (
          <TitleScreen
            onStart={handleStart}
            onHowToPlay={handleHowToPlay}
            onCredits={handleCredits}
            onLevelSelect={handleLevelSelect}
            onLeaderboard={handleLeaderboard}
          />
        )}

        {!hideChrome && phase === 'how_to_play' && (
          <HowToPlay onBack={handleBackToTitle} />
        )}

        {!hideChrome && phase === 'credits' && (
          <CreditsPanel onBack={handleBackToTitle} />
        )}

        {!hideChrome && phase === 'level_select' && (
          <LevelSelect
            unlockedLevel={getUnlockedLevel()}
            onSelectLevel={handleStartFromLevel}
            onBack={handleBackToTitle}
          />
        )}

        {!hideChrome && phase === 'leaderboard' && (
          <Leaderboard
            scores={getHighScores()}
            onBack={handleBackToTitle}
          />
        )}

        {phase === 'playing' && gameState && (
          <>
            <HUD state={gameState} />
            {isMobile && (
              <MobileControls
                inputMode={gameState.inputMode}
                onToggleMode={handleToggleInputMode}
                onNextUnit={handleMobileNextUnit}
                onPause={handleMobilePause}
              />
            )}
          </>
        )}

        {!hideChrome && phase === 'paused' && (
          <PauseMenu
            onResume={handleResume}
            onRestart={handleRestart}
            onQuit={handleQuitWithScore}
            onToggleMute={handleToggleMute}
            isMuted={muted}
            volume={volume}
            onVolumeChange={handleVolumeChange}
          />
        )}

        {!hideChrome && phase === 'level_complete' && gameState && (
          <GameOverScreen
            type="level_complete"
            level={gameState.level}
            score={gameState.score}
            onNextLevel={handleNextLevel}
            onQuit={handleQuitWithScore}
          />
        )}

        {!hideChrome && phase === 'game_over' && gameState && (
          <GameOverScreen
            type="game_over"
            level={gameState.level}
            score={gameState.score}
            onRestart={handleRestart}
            onQuit={handleGameOverQuit}
          />
        )}

        {!hideChrome && phase === 'victory' && gameState && (
          <GameOverScreen
            type="victory"
            level={gameState.level}
            score={gameState.score}
            onQuit={handleVictoryQuit}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
