import { Unit, Obstacle, Vec2 } from '../types';
import { vecSub, vecLen, vecNormalize, vecScale, vecAdd, clamp, circleRect } from '@/lib/utils';
import { UNIT_RADIUS } from '../constants';

export function updateMovement(
  units: Unit[],
  obstacles: Obstacle[],
  arenaW: number,
  arenaH: number,
  dt: number
): void {
  for (const unit of units) {
    if (unit.isKnockedOut) continue;
    if (unit.isCharging) {
      // Can't move while charging
      unit.vel = { x: 0, y: 0 };
      continue;
    }

    if (unit.targetPos) {
      const toTarget = vecSub(unit.targetPos, unit.pos);
      const dist = vecLen(toTarget);

      if (dist < 3) {
        // Arrived
        unit.targetPos = null;
        unit.vel = { x: 0, y: 0 };
      } else {
        const dir = vecNormalize(toTarget);
        const moveAmount = Math.min(unit.speed * dt, dist);
        unit.vel = vecScale(dir, unit.speed);
        unit.pos = vecAdd(unit.pos, vecScale(dir, moveAmount));
        unit.facing = Math.atan2(dir.y, dir.x);
      }
    } else {
      unit.vel = { x: 0, y: 0 };
    }

    // Obstacle collision (push out)
    for (const obs of obstacles) {
      if (obs.hp <= 0) continue;
      if (circleRect(unit.pos, UNIT_RADIUS, obs.pos, obs.width, obs.height)) {
        pushCircleOutOfRect(unit, obs);
      }
    }

    // Unit-unit collision (push apart)
    for (const other of units) {
      if (other.id === unit.id || other.isKnockedOut) continue;
      const d = vecLen(vecSub(unit.pos, other.pos));
      const minDist = UNIT_RADIUS * 2;
      if (d < minDist && d > 0) {
        const push = vecNormalize(vecSub(unit.pos, other.pos));
        const overlap = (minDist - d) / 2;
        unit.pos = vecAdd(unit.pos, vecScale(push, overlap));
        other.pos = vecSub(other.pos, vecScale(push, overlap));
      }
    }

    // Keep in bounds
    const margin = UNIT_RADIUS;
    unit.pos.x = clamp(unit.pos.x, margin, arenaW - margin);
    unit.pos.y = clamp(unit.pos.y, margin, arenaH - margin);
  }
}

function pushCircleOutOfRect(unit: Unit, obs: Obstacle): void {
  const halfW = obs.width / 2 + UNIT_RADIUS;
  const halfH = obs.height / 2 + UNIT_RADIUS;
  const dx = unit.pos.x - obs.pos.x;
  const dy = unit.pos.y - obs.pos.y;

  const overlapX = halfW - Math.abs(dx);
  const overlapY = halfH - Math.abs(dy);

  if (overlapX < overlapY) {
    unit.pos.x = obs.pos.x + (dx > 0 ? halfW : -halfW);
  } else {
    unit.pos.y = obs.pos.y + (dy > 0 ? halfH : -halfH);
  }
}

export function moveUnitTo(unit: Unit, target: Vec2, maxRange: number): void {
  const toTarget = vecSub(target, unit.pos);
  const dist = vecLen(toTarget);

  if (dist > maxRange) {
    const dir = vecNormalize(toTarget);
    unit.targetPos = vecAdd(unit.pos, vecScale(dir, maxRange));
  } else {
    unit.targetPos = { ...target };
  }
}
