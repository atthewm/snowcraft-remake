import { GameState, Snowball, Unit, Obstacle, Particle } from '../types';
import { circleCircle, circleRect, vecSub, vecNormalize, randomRange, genId } from '@/lib/utils';
import { UNIT_HIT_FLASH_TIME, PUFF_COUNT_ON_HIT } from '../constants';

export interface CollisionResult {
  unitHits: Array<{ snowball: Snowball; unit: Unit }>;
  obstacleHits: Array<{ snowball: Snowball; obstacle: Obstacle }>;
}

export function detectCollisions(state: GameState): CollisionResult {
  const result: CollisionResult = { unitHits: [], obstacleHits: [] };

  for (const sb of state.snowballs) {
    // Only check collisions when snowball is near ground level
    if (sb.heightOffset > 15) continue;

    // Check vs units
    for (const unit of state.units) {
      if (unit.isKnockedOut) continue;
      if (unit.team === sb.team) continue; // No friendly fire

      if (circleCircle(sb.pos, sb.radius, unit.pos, unit.radius)) {
        result.unitHits.push({ snowball: sb, unit });
      }
    }

    // Check vs obstacles
    for (const obs of state.obstacles) {
      if (obs.hp <= 0) continue;
      if (circleRect(sb.pos, sb.radius, obs.pos, obs.width, obs.height)) {
        result.obstacleHits.push({ snowball: sb, obstacle: obs });
      }
    }
  }

  return result;
}

export function resolveCollisions(state: GameState, result: CollisionResult): void {
  const toRemove = new Set<string>();

  for (const { snowball, unit } of result.unitHits) {
    if (toRemove.has(snowball.id)) continue;
    toRemove.add(snowball.id);

    unit.hp -= snowball.damage;
    unit.hitFlashTimer = UNIT_HIT_FLASH_TIME;

    // Spawn hit particles
    spawnHitParticles(state, snowball.pos, PUFF_COUNT_ON_HIT);

    // Screen shake
    state.screenShake.intensity = Math.min(state.screenShake.intensity + 2, 6);
    state.screenShake.timer = 0.15;

    if (unit.hp <= 0) {
      unit.hp = 0;
      unit.isKnockedOut = true;
      unit.knockoutTimer = 0;
      // Big puff on knockout
      spawnHitParticles(state, unit.pos, PUFF_COUNT_ON_HIT * 2);
    }
  }

  for (const { snowball, obstacle } of result.obstacleHits) {
    if (toRemove.has(snowball.id)) continue;
    toRemove.add(snowball.id);

    obstacle.hp -= snowball.damage;
    spawnHitParticles(state, snowball.pos, 4);

    if (obstacle.hp <= 0) {
      obstacle.hp = 0;
    }
  }

  // Remove destroyed snowballs
  state.snowballs = state.snowballs.filter(sb => !toRemove.has(sb.id));
}

// Remove snowballs that go out of bounds
export function removeOutOfBounds(state: GameState): void {
  const margin = 50;
  state.snowballs = state.snowballs.filter(sb =>
    sb.pos.x > -margin &&
    sb.pos.x < state.arenaWidth + margin &&
    sb.pos.y > -margin &&
    sb.pos.y < state.arenaHeight + margin
  );
}

function spawnHitParticles(state: GameState, pos: { x: number; y: number }, count: number): void {
  for (let i = 0; i < count; i++) {
    const angle = randomRange(0, Math.PI * 2);
    const speed = randomRange(30, 120);
    state.particles.push({
      pos: { x: pos.x, y: pos.y },
      vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      life: randomRange(0.2, 0.5),
      maxLife: 0.5,
      size: randomRange(2, 6),
      color: '#ffffff',
      alpha: 1,
      type: 'snow_puff',
    });
  }
}
