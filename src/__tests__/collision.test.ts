import { circleCircle, circleRect, pointInCircle, vecDist, vec2 } from '../lib/utils';

describe('circleCircle collision', () => {
  it('detects overlapping circles', () => {
    expect(circleCircle(vec2(0, 0), 10, vec2(15, 0), 10)).toBe(true);
  });

  it('detects touching circles', () => {
    expect(circleCircle(vec2(0, 0), 10, vec2(19.9, 0), 10)).toBe(true);
  });

  it('rejects non-overlapping circles', () => {
    expect(circleCircle(vec2(0, 0), 10, vec2(25, 0), 10)).toBe(false);
  });

  it('detects identical positions', () => {
    expect(circleCircle(vec2(5, 5), 10, vec2(5, 5), 10)).toBe(true);
  });

  it('handles diagonal separation', () => {
    // Distance between (0,0) and (14,14) ~= 19.8, sum of radii = 20
    expect(circleCircle(vec2(0, 0), 10, vec2(14, 14), 10)).toBe(true);
    // Distance between (0,0) and (15,15) ~= 21.2, sum of radii = 20
    expect(circleCircle(vec2(0, 0), 10, vec2(15, 15), 10)).toBe(false);
  });
});

describe('circleRect collision', () => {
  it('detects circle inside rect', () => {
    expect(circleRect(vec2(50, 50), 5, vec2(50, 50), 40, 30)).toBe(true);
  });

  it('detects circle overlapping rect edge', () => {
    expect(circleRect(vec2(25, 50), 10, vec2(50, 50), 40, 30)).toBe(true);
  });

  it('rejects circle far from rect', () => {
    expect(circleRect(vec2(0, 0), 5, vec2(50, 50), 20, 20)).toBe(false);
  });

  it('detects circle touching rect corner', () => {
    // Rect centered at (50,50) with w=20,h=20 has corner at (60,60)
    // Circle at (65,60) with r=6 should touch
    expect(circleRect(vec2(65, 60), 6, vec2(50, 50), 20, 20)).toBe(true);
  });
});

describe('pointInCircle', () => {
  it('detects point inside circle', () => {
    expect(pointInCircle(vec2(5, 5), vec2(0, 0), 10)).toBe(true);
  });

  it('detects point on edge', () => {
    expect(pointInCircle(vec2(10, 0), vec2(0, 0), 10)).toBe(true);
  });

  it('rejects point outside', () => {
    expect(pointInCircle(vec2(15, 0), vec2(0, 0), 10)).toBe(false);
  });
});

describe('vecDist', () => {
  it('calculates zero distance for same point', () => {
    expect(vecDist(vec2(5, 5), vec2(5, 5))).toBe(0);
  });

  it('calculates horizontal distance', () => {
    expect(vecDist(vec2(0, 0), vec2(10, 0))).toBe(10);
  });

  it('calculates diagonal distance', () => {
    const d = vecDist(vec2(0, 0), vec2(3, 4));
    expect(d).toBeCloseTo(5, 10);
  });
});
