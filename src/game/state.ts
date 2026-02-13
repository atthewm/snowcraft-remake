import { GameState, GamePhase, Unit, Vec2 } from './types';
import { BASE_ARENA_W, BASE_ARENA_H, UNIT_MAX_HP, SHAKE_DECAY } from './constants';
import { createUnit } from './entities/unit';
import { createObstacle } from './entities/obstacle';
import { getLevel } from './levels/levelData';
import { resetIdCounter } from '@/lib/utils';
import { resetAIStates } from './systems/ai';

export function createInitialState(): GameState {
  return {
    phase: 'title',
    level: 1,
    score: 0,
    units: [],
    snowballs: [],
    obstacles: [],
    particles: [],
    selectedUnitId: null,
    camera: { x: 0, y: 0, scale: 1 },
    screenShake: { intensity: 0, duration: 0, timer: 0 },
    arenaWidth: BASE_ARENA_W,
    arenaHeight: BASE_ARENA_H,
    levelTransitionTimer: 0,
  };
}

export function setupLevel(state: GameState): void {
  resetIdCounter();
  resetAIStates();

  const levelData = getLevel(state.level);
  state.arenaWidth = levelData.arenaWidth;
  state.arenaHeight = levelData.arenaHeight;
  state.snowballs = [];
  state.particles = [];
  state.selectedUnitId = null;
  state.levelTransitionTimer = 0;

  // Create player units (red team, left side)
  const playerCount = 3;
  state.units = [];
  const playerStartX = 80;
  const spacingY = levelData.arenaHeight / (playerCount + 1);
  for (let i = 0; i < playerCount; i++) {
    const unit = createUnit('red', { x: playerStartX, y: spacingY * (i + 1) }, i);
    state.units.push(unit);
  }

  // Create enemy units (green team, right side)
  const enemyStartX = levelData.arenaWidth - 80;
  const enemySpacingY = levelData.arenaHeight / (levelData.enemyCount + 1);
  for (let i = 0; i < levelData.enemyCount; i++) {
    const unit = createUnit('green', { x: enemyStartX, y: enemySpacingY * (i + 1) }, i);
    unit.speed *= levelData.enemySpeed;
    state.units.push(unit);
  }

  // Create obstacles
  state.obstacles = levelData.obstacles.map(o =>
    createObstacle(o.type, o.pos, { width: o.width, height: o.height, hp: o.hp })
  );

  // Select first player unit
  const firstPlayer = state.units.find(u => u.team === 'red');
  if (firstPlayer) {
    state.selectedUnitId = firstPlayer.id;
  }
}

export function updateScreenShake(state: GameState, dt: number): void {
  if (state.screenShake.timer > 0) {
    state.screenShake.timer -= dt;
    if (state.screenShake.timer <= 0) {
      state.screenShake.intensity = 0;
    }
  }
  state.screenShake.intensity *= (1 - SHAKE_DECAY * dt);
}

export function checkWinCondition(state: GameState): 'playing' | 'level_complete' | 'game_over' {
  const playersAlive = state.units.filter(u => u.team === 'red' && !u.isKnockedOut);
  const enemiesAlive = state.units.filter(u => u.team === 'green' && !u.isKnockedOut);

  if (playersAlive.length === 0) return 'game_over';
  if (enemiesAlive.length === 0) return 'level_complete';
  return 'playing';
}

export function getSelectedUnit(state: GameState): Unit | null {
  if (!state.selectedUnitId) return null;
  return state.units.find(u => u.id === state.selectedUnitId) ?? null;
}

export function selectNextUnit(state: GameState): void {
  const playerUnits = state.units.filter(u => u.team === 'red' && !u.isKnockedOut);
  if (playerUnits.length === 0) return;

  const currentIdx = playerUnits.findIndex(u => u.id === state.selectedUnitId);
  const nextIdx = (currentIdx + 1) % playerUnits.length;
  state.selectedUnitId = playerUnits[nextIdx].id;
}
