import { Snowball, Team, Vec2 } from '../types';
import {
  SNOWBALL_RADIUS,
  SNOWBALL_MIN_SPEED,
  SNOWBALL_MAX_SPEED,
  SNOWBALL_MIN_DAMAGE,
  SNOWBALL_MAX_DAMAGE,
  SNOWBALL_LIFETIME,
  SNOWBALL_ARC_HEIGHT,
} from '../constants';
import { genId, vecNormalize, vecScale, lerp } from '@/lib/utils';

export function createSnowball(
  team: Team,
  origin: Vec2,
  target: Vec2,
  charge: number // 0..1
): Snowball {
  const dir = vecNormalize({ x: target.x - origin.x, y: target.y - origin.y });
  const speed = lerp(SNOWBALL_MIN_SPEED, SNOWBALL_MAX_SPEED, charge);
  const damage = lerp(SNOWBALL_MIN_DAMAGE, SNOWBALL_MAX_DAMAGE, charge);
  const vel = vecScale(dir, speed);

  return {
    id: genId('sb'),
    team,
    pos: { ...origin },
    vel,
    speed,
    radius: SNOWBALL_RADIUS,
    damage,
    lifetime: SNOWBALL_LIFETIME,
    maxLifetime: SNOWBALL_LIFETIME,
    shadow: { ...origin },
    heightOffset: 0,
    heightVel: SNOWBALL_ARC_HEIGHT * 2, // initial upward velocity for arc
  };
}
