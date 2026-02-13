import { createSnowball } from '../game/entities/snowball';
import { vec2, vecLen } from '../lib/utils';
import {
  SNOWBALL_MIN_SPEED,
  SNOWBALL_MAX_SPEED,
  SNOWBALL_MIN_DAMAGE,
  SNOWBALL_MAX_DAMAGE,
  SNOWBALL_LIFETIME,
} from '../game/constants';

describe('createSnowball', () => {
  it('creates a snowball with correct origin', () => {
    const sb = createSnowball('red', vec2(100, 100), vec2(200, 100), 0.5);
    expect(sb.pos.x).toBe(100);
    expect(sb.pos.y).toBe(100);
    expect(sb.team).toBe('red');
  });

  it('sets minimum speed at zero charge', () => {
    const sb = createSnowball('red', vec2(0, 0), vec2(100, 0), 0);
    const speed = vecLen(sb.vel);
    expect(speed).toBeCloseTo(SNOWBALL_MIN_SPEED, 0);
  });

  it('sets maximum speed at full charge', () => {
    const sb = createSnowball('red', vec2(0, 0), vec2(100, 0), 1);
    const speed = vecLen(sb.vel);
    expect(speed).toBeCloseTo(SNOWBALL_MAX_SPEED, 0);
  });

  it('scales damage with charge', () => {
    const sbLow = createSnowball('red', vec2(0, 0), vec2(100, 0), 0);
    const sbHigh = createSnowball('green', vec2(0, 0), vec2(100, 0), 1);
    expect(sbLow.damage).toBeCloseTo(SNOWBALL_MIN_DAMAGE, 0);
    expect(sbHigh.damage).toBeCloseTo(SNOWBALL_MAX_DAMAGE, 0);
  });

  it('sets correct lifetime', () => {
    const sb = createSnowball('red', vec2(0, 0), vec2(100, 0), 0.5);
    expect(sb.lifetime).toBe(SNOWBALL_LIFETIME);
  });

  it('aims in the correct direction', () => {
    // Straight right
    const sb1 = createSnowball('red', vec2(0, 0), vec2(100, 0), 0.5);
    expect(sb1.vel.x).toBeGreaterThan(0);
    expect(Math.abs(sb1.vel.y)).toBeLessThan(0.001);

    // Straight down
    const sb2 = createSnowball('red', vec2(0, 0), vec2(0, 100), 0.5);
    expect(Math.abs(sb2.vel.x)).toBeLessThan(0.001);
    expect(sb2.vel.y).toBeGreaterThan(0);
  });
});
