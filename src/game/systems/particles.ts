import { Particle } from '../types';
import { MAX_PARTICLES } from '../constants';

export function updateParticles(particles: Particle[], dt: number): Particle[] {
  const alive: Particle[] = [];

  for (const p of particles) {
    p.pos.x += p.vel.x * dt;
    p.pos.y += p.vel.y * dt;
    p.vel.x *= 0.95;
    p.vel.y *= 0.95;
    p.life -= dt;
    p.alpha = Math.max(0, p.life / p.maxLife);

    if (p.type === 'snow_puff') {
      p.size *= 0.98;
    }

    if (p.life > 0) {
      alive.push(p);
    }
  }

  // Cap particle count
  if (alive.length > MAX_PARTICLES) {
    return alive.slice(alive.length - MAX_PARTICLES);
  }

  return alive;
}

export function createChargeParticle(x: number, y: number, charge: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const dist = 15 + Math.random() * 10;
  return {
    pos: { x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist },
    vel: { x: (x - (x + Math.cos(angle) * dist)) * 2, y: (y - (y + Math.sin(angle) * dist)) * 2 },
    life: 0.3,
    maxLife: 0.3,
    size: 2 + charge * 3,
    color: charge > 0.7 ? '#ffeb3b' : '#bbdefb',
    alpha: 0.8,
    type: 'charge_glow',
  };
}
