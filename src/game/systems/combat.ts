import { GameState, Unit, Snowball, Vec2 } from '../types';
import { createSnowball } from '../entities/snowball';
import { CHARGE_TIME, SNOWBALL_ARC_HEIGHT } from '../constants';
import { vecAdd, vecScale, vecNormalize, vecSub, clamp } from '@/lib/utils';

export function startCharge(unit: Unit): void {
  if (unit.cooldown > 0 || unit.isKnockedOut) return;
  unit.isCharging = true;
  unit.throwCharge = 0;
  unit.targetPos = null; // Stop moving
}

export function updateCharge(unit: Unit, dt: number): void {
  if (!unit.isCharging) return;
  unit.throwCharge = clamp(unit.throwCharge + dt / CHARGE_TIME, 0, 1);
}

export function releaseThrow(
  unit: Unit,
  aimTarget: Vec2,
  state: GameState
): void {
  if (!unit.isCharging || unit.isKnockedOut) return;

  const charge = Math.max(unit.throwCharge, 0.1);
  const dir = vecNormalize(vecSub(aimTarget, unit.pos));
  unit.facing = Math.atan2(dir.y, dir.x);

  const spawnOffset = vecScale(dir, unit.radius + 8);
  const spawnPos = vecAdd(unit.pos, spawnOffset);

  const snowball = createSnowball(unit.team, spawnPos, aimTarget, charge);
  state.snowballs.push(snowball);

  unit.isCharging = false;
  unit.throwCharge = 0;
  unit.cooldown = unit.cooldownMax;
}

export function updateSnowballs(snowballs: Snowball[], dt: number): void {
  for (let i = snowballs.length - 1; i >= 0; i--) {
    const sb = snowballs[i];
    sb.pos.x += sb.vel.x * dt;
    sb.pos.y += sb.vel.y * dt;
    sb.shadow.x = sb.pos.x;
    sb.shadow.y = sb.pos.y;

    // Parabolic arc
    sb.heightVel -= SNOWBALL_ARC_HEIGHT * 4 * dt;
    sb.heightOffset += sb.heightVel * dt;
    if (sb.heightOffset < 0) sb.heightOffset = 0;

    sb.lifetime -= dt;
    if (sb.lifetime <= 0) {
      snowballs.splice(i, 1);
    }
  }
}

export function updateCooldowns(units: Unit[], dt: number): void {
  for (const unit of units) {
    if (unit.cooldown > 0) {
      unit.cooldown = Math.max(0, unit.cooldown - dt);
    }
    if (unit.hitFlashTimer > 0) {
      unit.hitFlashTimer -= dt;
    }
  }
}
