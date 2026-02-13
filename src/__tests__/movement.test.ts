import { createUnit } from '../game/entities/unit';
import { moveUnitTo } from '../game/systems/movement';
import { vec2, vecDist } from '../lib/utils';
import { MOVEMENT_RANGE } from '../game/constants';

describe('moveUnitTo', () => {
  it('sets target within range', () => {
    const unit = createUnit('red', vec2(100, 100), 0);
    moveUnitTo(unit, vec2(150, 100), MOVEMENT_RANGE);
    expect(unit.targetPos).not.toBeNull();
    expect(unit.targetPos!.x).toBe(150);
    expect(unit.targetPos!.y).toBe(100);
  });

  it('clamps target to max range when too far', () => {
    const unit = createUnit('red', vec2(100, 100), 0);
    moveUnitTo(unit, vec2(500, 100), MOVEMENT_RANGE);
    expect(unit.targetPos).not.toBeNull();
    const d = vecDist(unit.pos, unit.targetPos!);
    expect(d).toBeCloseTo(MOVEMENT_RANGE, 0);
  });

  it('preserves direction when clamping', () => {
    const unit = createUnit('red', vec2(100, 100), 0);
    // Target is directly to the right, far away
    moveUnitTo(unit, vec2(1000, 100), MOVEMENT_RANGE);
    expect(unit.targetPos!.y).toBeCloseTo(100, 0);
    expect(unit.targetPos!.x).toBeGreaterThan(100);
  });

  it('handles zero distance target', () => {
    const unit = createUnit('red', vec2(100, 100), 0);
    moveUnitTo(unit, vec2(100, 100), MOVEMENT_RANGE);
    expect(unit.targetPos).not.toBeNull();
    expect(unit.targetPos!.x).toBe(100);
    expect(unit.targetPos!.y).toBe(100);
  });
});

describe('Unit creation', () => {
  it('creates a red team unit', () => {
    const unit = createUnit('red', vec2(50, 50), 0);
    expect(unit.team).toBe('red');
    expect(unit.pos.x).toBe(50);
    expect(unit.pos.y).toBe(50);
    expect(unit.hp).toBeGreaterThan(0);
    expect(unit.isKnockedOut).toBe(false);
  });

  it('creates a green team unit', () => {
    const unit = createUnit('green', vec2(200, 300), 1);
    expect(unit.team).toBe('green');
    expect(unit.sprite.bodyColor).toBeDefined();
  });
});
