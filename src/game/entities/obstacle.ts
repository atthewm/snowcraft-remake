import { Obstacle, Vec2 } from '../types';
import { FORT_HP } from '../constants';
import { genId } from '@/lib/utils';

type ObstacleType = Obstacle['type'];

const OBSTACLE_DEFAULTS: Record<ObstacleType, { width: number; height: number; hp: number }> = {
  fort: { width: 60, height: 30, hp: FORT_HP },
  snowman: { width: 30, height: 30, hp: 40 },
  tree: { width: 24, height: 24, hp: 9999 },
  rock: { width: 36, height: 28, hp: 9999 },
};

export function createObstacle(
  type: ObstacleType,
  pos: Vec2,
  overrides?: Partial<Obstacle>
): Obstacle {
  const defaults = OBSTACLE_DEFAULTS[type];
  return {
    id: genId('obs'),
    type,
    pos: { ...pos },
    width: overrides?.width ?? defaults.width,
    height: overrides?.height ?? defaults.height,
    hp: overrides?.hp ?? defaults.hp,
    maxHp: overrides?.hp ?? defaults.hp,
  };
}
