import { GameState, Unit, Vec2 } from '../types';
import {
  AI_THINK_INTERVAL,
  AI_THROW_RANGE,
  AI_APPROACH_RANGE,
  AI_SCATTER_DISTANCE,
  MOVEMENT_RANGE,
} from '../constants';
import {
  vecDist,
  vecSub,
  vecNormalize,
  vecAdd,
  vecScale,
  randomRange,
  clamp,
} from '@/lib/utils';
import { moveUnitTo } from './movement';
import { startCharge, releaseThrow } from './combat';

interface AIState {
  thinkTimer: number;
  chargeTarget: Vec2 | null;
  chargeTimer: number;
  desiredChargeTime: number;
}

const aiStates = new Map<string, AIState>();

function getAI(unit: Unit): AIState {
  if (!aiStates.has(unit.id)) {
    aiStates.set(unit.id, {
      thinkTimer: randomRange(0, AI_THINK_INTERVAL),
      chargeTarget: null,
      chargeTimer: 0,
      desiredChargeTime: 0,
    });
  }
  return aiStates.get(unit.id)!;
}

export function resetAIStates(): void {
  aiStates.clear();
}

export function updateAI(state: GameState, dt: number): void {
  const enemies = state.units.filter(u => u.team === 'green' && !u.isKnockedOut);
  const players = state.units.filter(u => u.team === 'red' && !u.isKnockedOut);

  if (players.length === 0) return;

  const levelData = getLevelParams(state.level);

  for (const enemy of enemies) {
    const ai = getAI(enemy);

    // Handle active charge
    if (enemy.isCharging && ai.chargeTarget) {
      ai.chargeTimer += dt;
      if (ai.chargeTimer >= ai.desiredChargeTime) {
        // Add inaccuracy based on level
        const inaccuracy = (1 - levelData.accuracy) * 60;
        const jitteredTarget: Vec2 = {
          x: ai.chargeTarget.x + randomRange(-inaccuracy, inaccuracy),
          y: ai.chargeTarget.y + randomRange(-inaccuracy, inaccuracy),
        };
        releaseThrow(enemy, jitteredTarget, state);
        ai.chargeTarget = null;
        ai.chargeTimer = 0;
        continue;
      }
      continue; // Don't think while charging
    }

    ai.thinkTimer -= dt;
    if (ai.thinkTimer > 0) continue;
    ai.thinkTimer = AI_THINK_INTERVAL * randomRange(0.7, 1.3);

    // Find nearest player
    let nearest: Unit | null = null;
    let nearestDist = Infinity;
    for (const p of players) {
      const d = vecDist(enemy.pos, p.pos);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = p;
      }
    }

    if (!nearest) continue;

    const aggression = levelData.aggression;

    // Decision: throw, approach, or take cover
    if (nearestDist < AI_THROW_RANGE && enemy.cooldown <= 0) {
      // Try to throw at nearest player
      if (Math.random() < aggression) {
        const leadFactor = randomRange(0, 0.3);
        const predictedPos: Vec2 = {
          x: nearest.pos.x + nearest.vel.x * leadFactor,
          y: nearest.pos.y + nearest.vel.y * leadFactor,
        };
        startCharge(enemy);
        ai.chargeTarget = predictedPos;
        ai.chargeTimer = 0;
        ai.desiredChargeTime = randomRange(0.2, 0.8);
        enemy.facing = Math.atan2(
          predictedPos.y - enemy.pos.y,
          predictedPos.x - enemy.pos.x
        );
      }
    } else if (nearestDist > AI_APPROACH_RANGE) {
      // Move toward nearest player
      const dir = vecNormalize(vecSub(nearest.pos, enemy.pos));
      const moveTarget = vecAdd(
        enemy.pos,
        vecScale(dir, randomRange(40, MOVEMENT_RANGE * 0.6))
      );
      // Add some scatter
      moveTarget.x += randomRange(-AI_SCATTER_DISTANCE, AI_SCATTER_DISTANCE);
      moveTarget.y += randomRange(-AI_SCATTER_DISTANCE, AI_SCATTER_DISTANCE);
      moveTarget.x = clamp(moveTarget.x, 30, state.arenaWidth - 30);
      moveTarget.y = clamp(moveTarget.y, 30, state.arenaHeight - 30);
      moveUnitTo(enemy, moveTarget, MOVEMENT_RANGE);
    } else {
      // Strafe / reposition
      const perpAngle = Math.atan2(
        nearest.pos.y - enemy.pos.y,
        nearest.pos.x - enemy.pos.x
      ) + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2);
      const strafeTarget: Vec2 = {
        x: enemy.pos.x + Math.cos(perpAngle) * randomRange(30, 80),
        y: enemy.pos.y + Math.sin(perpAngle) * randomRange(30, 80),
      };
      strafeTarget.x = clamp(strafeTarget.x, 30, state.arenaWidth - 30);
      strafeTarget.y = clamp(strafeTarget.y, 30, state.arenaHeight - 30);
      moveUnitTo(enemy, strafeTarget, MOVEMENT_RANGE);
    }
  }
}

function getLevelParams(level: number): { aggression: number; accuracy: number } {
  const t = clamp((level - 1) / 9, 0, 1); // 0 at level 1, 1 at level 10
  return {
    aggression: 0.4 + t * 0.5,
    accuracy: 0.3 + t * 0.6,
  };
}
