import { GameState, InputState, Vec2 } from './types';
import { FIXED_DT, MAX_DT, MOVEMENT_RANGE, UNIT_RADIUS } from './constants';
import {
  createInitialState,
  setupLevel,
  updateScreenShake,
  checkWinCondition,
  getSelectedUnit,
  selectNextUnit,
} from './state';
import { updateMovement, moveUnitTo } from './systems/movement';
import { startCharge, updateCharge, releaseThrow, updateSnowballs, updateCooldowns } from './systems/combat';
import { detectCollisions, resolveCollisions, removeOutOfBounds } from './systems/collision';
import { updateParticles, createChargeParticle } from './systems/particles';
import { updateAI } from './systems/ai';
import { render, screenToWorld } from './renderer';
import {
  playThrow,
  playHit,
  playKnockout,
  playSelect,
  playLevelComplete,
  playGameOver,
  playClick,
} from './audio/soundManager';
import { vecDist, pointInCircle } from '@/lib/utils';
import { levels } from './levels/levelData';

export class GameEngine {
  state: GameState;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrame: number = 0;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private input: InputState;
  private mouseWorldPos: Vec2 | null = null;
  private running: boolean = false;
  private chargeParticleTimer: number = 0;
  private onPhaseChange?: (phase: string) => void;

  constructor(canvas: HTMLCanvasElement, onPhaseChange?: (phase: string) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.state = createInitialState();
    this.onPhaseChange = onPhaseChange;
    this.input = {
      mouseX: 0,
      mouseY: 0,
      mouseDown: false,
      mouseJustPressed: false,
      mouseJustReleased: false,
      rightMouseDown: false,
      rightMouseJustPressed: false,
      keys: new Set(),
      keysJustPressed: new Set(),
    };
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop(): void {
    this.running = false;
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
    }
  }

  setPhase(phase: GameState['phase']): void {
    this.state.phase = phase;
    this.onPhaseChange?.(phase);
  }

  startGame(): void {
    this.state = createInitialState();
    this.state.phase = 'playing';
    this.state.level = 1;
    this.state.score = 0;
    setupLevel(this.state);
    this.onPhaseChange?.('playing');
  }

  nextLevel(): void {
    this.state.level++;
    if (this.state.level > levels.length) {
      this.state.phase = 'victory';
      this.onPhaseChange?.('victory');
    } else {
      setupLevel(this.state);
      this.state.phase = 'playing';
      this.onPhaseChange?.('playing');
    }
  }

  restartLevel(): void {
    setupLevel(this.state);
    this.state.phase = 'playing';
    this.onPhaseChange?.('playing');
  }

  // Input handlers
  handleMouseDown(x: number, y: number, button: number): void {
    if (button === 0) {
      this.input.mouseDown = true;
      this.input.mouseJustPressed = true;
    } else if (button === 2) {
      this.input.rightMouseDown = true;
      this.input.rightMouseJustPressed = true;
    }
    this.input.mouseX = x;
    this.input.mouseY = y;
  }

  handleMouseUp(x: number, y: number, button: number): void {
    if (button === 0) {
      this.input.mouseDown = false;
      this.input.mouseJustReleased = true;
    } else if (button === 2) {
      this.input.rightMouseDown = false;
    }
    this.input.mouseX = x;
    this.input.mouseY = y;
  }

  handleMouseMove(x: number, y: number): void {
    this.input.mouseX = x;
    this.input.mouseY = y;
  }

  handleKeyDown(key: string): void {
    this.input.keys.add(key);
    this.input.keysJustPressed.add(key);
  }

  handleKeyUp(key: string): void {
    this.input.keys.delete(key);
  }

  private loop = (now: number): void => {
    if (!this.running) return;

    const rawDt = (now - this.lastTime) / 1000;
    const dt = Math.min(rawDt, MAX_DT);
    this.lastTime = now;

    // Convert mouse to world coords
    this.mouseWorldPos = screenToWorld(
      this.input.mouseX,
      this.input.mouseY,
      this.canvas.width,
      this.canvas.height,
      this.state.camera,
      this.state.arenaWidth,
      this.state.arenaHeight
    );

    if (this.state.phase === 'playing') {
      this.accumulator += dt;
      while (this.accumulator >= FIXED_DT) {
        this.fixedUpdate(FIXED_DT);
        this.accumulator -= FIXED_DT;
      }
    }

    // Render
    render(this.ctx, this.state, this.canvas.width, this.canvas.height, this.mouseWorldPos);

    // Clear one-frame input flags
    this.input.mouseJustPressed = false;
    this.input.mouseJustReleased = false;
    this.input.rightMouseJustPressed = false;
    this.input.keysJustPressed.clear();

    this.animFrame = requestAnimationFrame(this.loop);
  };

  private fixedUpdate(dt: number): void {
    this.handlePlayingInput(dt);

    // Update systems
    updateMovement(this.state.units, this.state.obstacles, this.state.arenaWidth, this.state.arenaHeight, dt);
    updateSnowballs(this.state.snowballs, dt);
    updateCooldowns(this.state.units, dt);

    // Update charges
    for (const unit of this.state.units) {
      updateCharge(unit, dt);
    }

    // Charge particles
    const selected = getSelectedUnit(this.state);
    if (selected && selected.isCharging) {
      this.chargeParticleTimer -= dt;
      if (this.chargeParticleTimer <= 0) {
        this.state.particles.push(createChargeParticle(selected.pos.x, selected.pos.y, selected.throwCharge));
        this.chargeParticleTimer = 0.05;
      }
    }

    // Collisions
    const collisions = detectCollisions(this.state);
    if (collisions.unitHits.length > 0) {
      const hadKnockouts = this.state.units.filter(u => u.isKnockedOut).length;
      resolveCollisions(this.state, collisions);
      const nowKnockouts = this.state.units.filter(u => u.isKnockedOut).length;

      for (const hit of collisions.unitHits) {
        playHit();
      }
      if (nowKnockouts > hadKnockouts) {
        playKnockout();
      }
    } else if (collisions.obstacleHits.length > 0) {
      resolveCollisions(this.state, collisions);
      playHit();
    }

    removeOutOfBounds(this.state);

    // AI
    updateAI(this.state, dt);

    // Particles
    this.state.particles = updateParticles(this.state.particles, dt);

    // Screen shake
    updateScreenShake(this.state, dt);

    // Camera
    this.updateCamera();

    // Win/lose check
    const result = checkWinCondition(this.state);
    if (result === 'level_complete') {
      this.state.score += 100 * this.state.level;
      // Bonus for surviving units
      const alive = this.state.units.filter(u => u.team === 'red' && !u.isKnockedOut);
      this.state.score += alive.length * 50;
      playLevelComplete();
      this.state.phase = 'level_complete';
      this.state.levelTransitionTimer = 2;
      this.onPhaseChange?.('level_complete');
    } else if (result === 'game_over') {
      playGameOver();
      this.state.phase = 'game_over';
      this.onPhaseChange?.('game_over');
    }

    // Level transition timer
    if (this.state.phase === 'level_complete') {
      this.state.levelTransitionTimer -= dt;
    }
  }

  private handlePlayingInput(dt: number): void {
    if (!this.mouseWorldPos) return;
    const worldPos = this.mouseWorldPos;
    const selected = getSelectedUnit(this.state);

    // Tab to cycle units
    if (this.input.keysJustPressed.has('Tab')) {
      selectNextUnit(this.state);
      playSelect();
    }

    // Escape to pause
    if (this.input.keysJustPressed.has('Escape')) {
      this.state.phase = 'paused';
      this.onPhaseChange?.('paused');
      return;
    }

    // Left click
    if (this.input.mouseJustPressed) {
      // Check if clicking on a player unit to select it
      const clickedUnit = this.state.units.find(
        u => u.team === 'red' && !u.isKnockedOut && pointInCircle(worldPos, u.pos, UNIT_RADIUS + 4)
      );

      if (clickedUnit) {
        this.state.selectedUnitId = clickedUnit.id;
        playSelect();
        return;
      }

      // If we have a selected unit, start charging
      if (selected && !selected.isKnockedOut && selected.cooldown <= 0) {
        // Check if clicking on or near an enemy - start throw
        const nearEnemy = this.state.units.some(
          u => u.team === 'green' && !u.isKnockedOut && vecDist(worldPos, u.pos) < 200
        );
        if (nearEnemy || this.input.keys.has('Shift')) {
          startCharge(selected);
          return;
        }
      }
    }

    // Mouse held down - continue charging or start charge for throw
    if (this.input.mouseDown && selected && !selected.isKnockedOut) {
      if (!selected.isCharging && selected.cooldown <= 0) {
        // Start charge after brief hold
        startCharge(selected);
      }
    }

    // Mouse released - release throw or move
    if (this.input.mouseJustReleased) {
      if (selected && selected.isCharging) {
        releaseThrow(selected, worldPos, this.state);
        playThrow(selected.throwCharge);
      }
    }

    // Right click to move
    if (this.input.rightMouseJustPressed && selected && !selected.isKnockedOut) {
      if (!selected.isCharging) {
        moveUnitTo(selected, worldPos, MOVEMENT_RANGE);
        playClick();
      }
    }
  }

  private updateCamera(): void {
    // Auto-fit arena in view
    const scaleX = this.canvas.width / this.state.arenaWidth;
    const scaleY = this.canvas.height / this.state.arenaHeight;
    this.state.camera.scale = Math.min(scaleX, scaleY) * 0.95;
    this.state.camera.x = 0;
    this.state.camera.y = 0;
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  getState(): GameState {
    return this.state;
  }
}
