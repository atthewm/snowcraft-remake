import { Unit, Team, Vec2, UnitSprite } from '../types';
import { UNIT_RADIUS, UNIT_SPEED, UNIT_MAX_HP, UNIT_COOLDOWN, TEAM_COLORS } from '../constants';
import { genId } from '@/lib/utils';

export function createUnit(team: Team, pos: Vec2, index: number): Unit {
  const colors = TEAM_COLORS[team];
  const sprite: UnitSprite = {
    bodyColor: colors.body,
    scarfColor: colors.scarf,
    hatColor: colors.hat,
  };

  return {
    id: genId('unit'),
    team,
    pos: { ...pos },
    vel: { x: 0, y: 0 },
    targetPos: null,
    hp: UNIT_MAX_HP,
    maxHp: UNIT_MAX_HP,
    radius: UNIT_RADIUS,
    speed: UNIT_SPEED,
    isKnockedOut: false,
    knockoutTimer: 0,
    cooldown: 0,
    cooldownMax: UNIT_COOLDOWN,
    facing: team === 'red' ? 0 : Math.PI,
    throwCharge: 0,
    isCharging: false,
    hitFlashTimer: 0,
    sprite,
  };
}
