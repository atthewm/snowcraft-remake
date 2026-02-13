import { GameState, Unit, Snowball, Obstacle, Particle, RenderContext, Vec2 } from './types';
import {
  TEAM_COLORS,
  GROUND_COLOR,
  GRID_COLOR,
  SNOW_WHITE,
  SNOW_SHADOW,
  TILE_SIZE,
  UNIT_RADIUS,
  MOVEMENT_RANGE,
  CHARGE_TIME,
} from './constants';
import { vecDist, clamp } from '@/lib/utils';

// Cross-browser roundRect using arcTo (avoids TS error with native check)
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  canvasWidth: number,
  canvasHeight: number,
  mouseWorldPos: Vec2 | null
): void {
  const cam = state.camera;

  // Calculate shake offset
  const shakeX = state.screenShake.intensity * (Math.random() * 2 - 1);
  const shakeY = state.screenShake.intensity * (Math.random() * 2 - 1);

  ctx.save();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Center the arena in the canvas
  const offsetX = (canvasWidth - state.arenaWidth * cam.scale) / 2;
  const offsetY = (canvasHeight - state.arenaHeight * cam.scale) / 2;

  ctx.translate(offsetX + shakeX, offsetY + shakeY);
  ctx.scale(cam.scale, cam.scale);
  ctx.translate(-cam.x, -cam.y);

  // Draw ground
  drawGround(ctx, state.arenaWidth, state.arenaHeight);

  // Draw movement range for selected unit
  const selectedUnit = state.units.find(u => u.id === state.selectedUnitId);
  if (selectedUnit && !selectedUnit.isKnockedOut) {
    drawMovementRange(ctx, selectedUnit);
  }

  // Sort entities by Y for depth
  const drawables: Array<{ y: number; draw: () => void }> = [];

  // Obstacles
  for (const obs of state.obstacles) {
    if (obs.hp <= 0 && obs.type !== 'tree' && obs.type !== 'rock') continue;
    drawables.push({ y: obs.pos.y, draw: () => drawObstacle(ctx, obs) });
  }

  // Snowball shadows
  for (const sb of state.snowballs) {
    drawables.push({
      y: sb.shadow.y - 1,
      draw: () => drawSnowballShadow(ctx, sb),
    });
  }

  // Units
  for (const unit of state.units) {
    drawables.push({ y: unit.pos.y, draw: () => drawUnit(ctx, unit, unit.id === state.selectedUnitId) });
  }

  // Snowballs (above units)
  for (const sb of state.snowballs) {
    drawables.push({
      y: sb.pos.y + 1000, // Draw above everything
      draw: () => drawSnowball(ctx, sb),
    });
  }

  // Sort and draw
  drawables.sort((a, b) => a.y - b.y);
  for (const d of drawables) {
    d.draw();
  }

  // Particles
  for (const p of state.particles) {
    drawParticle(ctx, p);
  }

  // Aim line for charging unit
  if (selectedUnit && selectedUnit.isCharging && mouseWorldPos) {
    drawAimLine(ctx, selectedUnit, mouseWorldPos);
  }

  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Base ground
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= w; x += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Snow texture dots
  ctx.fillStyle = '#ffffff';
  const seed = 42;
  for (let i = 0; i < 150; i++) {
    const px = ((seed * (i + 1) * 7919) % (w * 100)) / 100;
    const py = ((seed * (i + 1) * 6271) % (h * 100)) / 100;
    const sz = ((seed * (i + 1) * 3571) % 300) / 100 + 0.5;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(px, py, sz, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Arena border
  ctx.strokeStyle = '#b0bec5';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, w, h);
}

function drawMovementRange(ctx: CanvasRenderingContext2D, unit: Unit): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(unit.pos.x, unit.pos.y, MOVEMENT_RANGE, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(100, 180, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawUnit(ctx: CanvasRenderingContext2D, unit: Unit, isSelected: boolean): void {
  const { pos, radius, team, hp, maxHp, isKnockedOut, hitFlashTimer, isCharging, throwCharge } = unit;
  const colors = TEAM_COLORS[team];

  ctx.save();
  ctx.translate(pos.x, pos.y);

  if (isKnockedOut) {
    ctx.globalAlpha = 0.4;
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.7, radius * 0.9, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body (snowman-like)
  const flash = hitFlashTimer > 0;
  ctx.fillStyle = flash ? '#ffffff' : colors.body;
  ctx.strokeStyle = colors.outline;
  ctx.lineWidth = 1.5;

  // Lower body
  ctx.beginPath();
  ctx.arc(0, 4, radius * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Upper body
  ctx.fillStyle = flash ? '#ffffff' : SNOW_WHITE;
  ctx.beginPath();
  ctx.arc(0, -6, radius * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hat
  ctx.fillStyle = colors.hat;
  ctx.fillRect(-6, -18, 12, 6);
  ctx.fillRect(-8, -12, 16, 3);

  // Eyes
  ctx.fillStyle = '#2c3e50';
  const facingRight = Math.cos(unit.facing) >= 0;
  const eyeOffsetX = facingRight ? 2 : -2;
  ctx.beginPath();
  ctx.arc(-3 + eyeOffsetX, -8, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3 + eyeOffsetX, -8, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Scarf
  ctx.fillStyle = colors.scarf;
  ctx.fillRect(-8, -2, 16, 4);
  // Scarf tail
  ctx.fillRect(facingRight ? -10 : 6, -1, 5, 8);

  // Selection ring
  if (isSelected && !isKnockedOut) {
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(0, 2, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // HP bar (only show if damaged)
  if (hp < maxHp && !isKnockedOut) {
    const barW = 24;
    const barH = 3;
    const barY = -22;
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-barW / 2, barY, barW, barH);
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(-barW / 2, barY, barW * (hp / maxHp), barH);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(-barW / 2, barY, barW, barH);
  }

  // Charge meter
  if (isCharging) {
    const barW = 30;
    const barH = 4;
    const barY = -26;
    ctx.fillStyle = '#34495e';
    ctx.fillRect(-barW / 2, barY, barW, barH);
    const chargeColor = throwCharge > 0.7 ? '#e74c3c' : throwCharge > 0.4 ? '#f39c12' : '#3498db';
    ctx.fillStyle = chargeColor;
    ctx.fillRect(-barW / 2, barY, barW * throwCharge, barH);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(-barW / 2, barY, barW, barH);
  }

  // Knocked out X eyes
  if (isKnockedOut) {
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1.5;
    // Left X
    ctx.beginPath();
    ctx.moveTo(-5, -10); ctx.lineTo(-1, -6);
    ctx.moveTo(-1, -10); ctx.lineTo(-5, -6);
    ctx.stroke();
    // Right X
    ctx.beginPath();
    ctx.moveTo(1, -10); ctx.lineTo(5, -6);
    ctx.moveTo(5, -10); ctx.lineTo(1, -6);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSnowball(ctx: CanvasRenderingContext2D, sb: Snowball): void {
  ctx.save();
  ctx.translate(sb.pos.x, sb.pos.y - sb.heightOffset);

  // Glow
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(0, 0, sb.radius + 2, 0, Math.PI * 2);
  ctx.fill();

  // Ball
  ctx.fillStyle = SNOW_WHITE;
  ctx.strokeStyle = SNOW_SHADOW;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, sb.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.arc(-1.5, -1.5, sb.radius * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSnowballShadow(ctx: CanvasRenderingContext2D, sb: Snowball): void {
  const shadowScale = 1 - (sb.heightOffset / 60) * 0.5;
  ctx.save();
  ctx.globalAlpha = 0.15 * shadowScale;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(sb.shadow.x, sb.shadow.y, sb.radius * shadowScale, sb.radius * 0.4 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle): void {
  ctx.save();
  ctx.translate(obs.pos.x, obs.pos.y);

  if (obs.type === 'fort') {
    if (obs.hp <= 0) {
      // Destroyed fort - rubble
      ctx.fillStyle = SNOW_SHADOW;
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 5; i++) {
        const rx = (i * 17 % obs.width) - obs.width / 2;
        const ry = (i * 13 % obs.height) - obs.height / 2;
        ctx.beginPath();
        ctx.arc(rx, ry, 4 + (i % 3) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Snow wall
      const halfW = obs.width / 2;
      const halfH = obs.height / 2;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(-halfW + 2, -halfH + 2, obs.width, obs.height);

      // Main body
      ctx.fillStyle = SNOW_WHITE;
      ctx.strokeStyle = SNOW_SHADOW;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      roundRect(ctx,-halfW, -halfH, obs.width, obs.height, 4);
      ctx.fill();
      ctx.stroke();

      // Snow texture on top
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      roundRect(ctx,-halfW + 2, -halfH - 3, obs.width - 4, 8, 3);
      ctx.fill();

      // HP bar
      if (obs.hp < obs.maxHp) {
        const barW = obs.width;
        const barY = -halfH - 8;
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(-barW / 2, barY, barW, 3);
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(-barW / 2, barY, barW * (obs.hp / obs.maxHp), 3);
      }
    }
  } else if (obs.type === 'snowman') {
    if (obs.hp <= 0) {
      ctx.fillStyle = SNOW_SHADOW;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.ellipse(0, 5, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Bottom ball
      ctx.fillStyle = SNOW_WHITE;
      ctx.strokeStyle = SNOW_SHADOW;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 6, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Top ball
      ctx.beginPath();
      ctx.arc(0, -6, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Eyes
      ctx.fillStyle = '#2c3e50';
      ctx.beginPath();
      ctx.arc(-3, -8, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(3, -8, 1.5, 0, Math.PI * 2);
      ctx.fill();
      // Carrot nose
      ctx.fillStyle = '#e67e22';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(8, -5);
      ctx.lineTo(0, -4);
      ctx.closePath();
      ctx.fill();
    }
  } else if (obs.type === 'tree') {
    // Trunk
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(-3, 0, 6, 12);
    // Foliage layers
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(-10, -4);
    ctx.lineTo(10, -4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(-12, 2);
    ctx.lineTo(12, 2);
    ctx.closePath();
    ctx.fill();
    // Snow on top
    ctx.fillStyle = SNOW_WHITE;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(-5, -10);
    ctx.lineTo(5, -10);
    ctx.closePath();
    ctx.fill();
  } else if (obs.type === 'rock') {
    ctx.fillStyle = '#78909c';
    ctx.strokeStyle = '#546e7a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Snow cap
    ctx.fillStyle = SNOW_WHITE;
    ctx.beginPath();
    ctx.ellipse(-2, -4, obs.width / 3, obs.height / 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAimLine(ctx: CanvasRenderingContext2D, unit: Unit, target: Vec2): void {
  ctx.save();
  ctx.strokeStyle = `rgba(255, 235, 59, ${0.4 + unit.throwCharge * 0.4})`;
  ctx.lineWidth = 1 + unit.throwCharge * 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(unit.pos.x, unit.pos.y);
  ctx.lineTo(target.x, target.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Aim circle
  ctx.strokeStyle = `rgba(255, 235, 59, ${0.3 + unit.throwCharge * 0.3})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(target.x, target.y, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Convert screen coords to world coords
export function screenToWorld(
  screenX: number,
  screenY: number,
  canvasW: number,
  canvasH: number,
  camera: { x: number; y: number; scale: number },
  arenaW: number,
  arenaH: number
): Vec2 {
  const offsetX = (canvasW - arenaW * camera.scale) / 2;
  const offsetY = (canvasH - arenaH * camera.scale) / 2;
  return {
    x: (screenX - offsetX) / camera.scale + camera.x,
    y: (screenY - offsetY) / camera.scale + camera.y,
  };
}
