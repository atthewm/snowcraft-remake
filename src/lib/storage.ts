import { HighScore, Difficulty } from '@/game/types';

const HIGH_SCORES_KEY = 'snowcraft_highscores';
const UNLOCKED_LEVELS_KEY = 'snowcraft_unlocked';
const MAX_HIGH_SCORES = 10;

export function getHighScores(): HighScore[] {
  try {
    const raw = localStorage.getItem(HIGH_SCORES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HighScore[];
  } catch {
    return [];
  }
}

export function saveHighScore(score: number, level: number, difficulty: Difficulty): void {
  try {
    const scores = getHighScores();
    scores.push({
      score,
      level,
      difficulty,
      date: new Date().toISOString().split('T')[0],
    });
    scores.sort((a, b) => b.score - a.score);
    const trimmed = scores.slice(0, MAX_HIGH_SCORES);
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage unavailable
  }
}

export function getUnlockedLevel(): number {
  try {
    const raw = localStorage.getItem(UNLOCKED_LEVELS_KEY);
    return raw ? parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}

export function unlockLevel(level: number): void {
  try {
    const current = getUnlockedLevel();
    if (level > current) {
      localStorage.setItem(UNLOCKED_LEVELS_KEY, String(level));
    }
  } catch {
    // localStorage unavailable
  }
}
