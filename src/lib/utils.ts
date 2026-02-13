import { Vec2 } from '@/game/types';

// ---- Vector math ----
export function vec2(x: number, y: number): Vec2 {
  return { x, y };
}

export function vecAdd(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function vecSub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function vecScale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s };
}

export function vecLen(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function vecDist(a: Vec2, b: Vec2): number {
  return vecLen(vecSub(a, b));
}

export function vecNormalize(v: Vec2): Vec2 {
  const len = vecLen(v);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

export function vecDot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function vecAngle(v: Vec2): number {
  return Math.atan2(v.y, v.x);
}

export function vecFromAngle(angle: number, length: number = 1): Vec2 {
  return { x: Math.cos(angle) * length, y: Math.sin(angle) * length };
}

export function vecLerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// ---- Collision ----
export function circleCircle(
  p1: Vec2, r1: number,
  p2: Vec2, r2: number
): boolean {
  const d = vecDist(p1, p2);
  return d < r1 + r2;
}

export function circleRect(
  cp: Vec2, cr: number,
  rp: Vec2, rw: number, rh: number
): boolean {
  const closestX = clamp(cp.x, rp.x - rw / 2, rp.x + rw / 2);
  const closestY = clamp(cp.y, rp.y - rh / 2, rp.y + rh / 2);
  const dx = cp.x - closestX;
  const dy = cp.y - closestY;
  return (dx * dx + dy * dy) < (cr * cr);
}

export function pointInCircle(point: Vec2, center: Vec2, radius: number): boolean {
  return vecDist(point, center) <= radius;
}

// ---- Math helpers ----
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ---- ID generation ----
let nextId = 0;
export function genId(prefix: string = 'e'): string {
  return `${prefix}_${nextId++}`;
}

export function resetIdCounter(): void {
  nextId = 0;
}
