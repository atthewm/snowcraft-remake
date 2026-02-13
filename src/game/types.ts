// ---- Core geometry ----
export interface Vec2 {
  x: number;
  y: number;
}

// ---- Teams ----
export type Team = 'red' | 'green';

// ---- Unit state ----
export interface Unit {
  id: string;
  team: Team;
  pos: Vec2;
  vel: Vec2;
  targetPos: Vec2 | null;
  hp: number;
  maxHp: number;
  radius: number;
  speed: number;
  isKnockedOut: boolean;
  knockoutTimer: number;
  cooldown: number;        // seconds until can throw again
  cooldownMax: number;
  facing: number;          // radians
  throwCharge: number;     // 0..1, current charge level
  isCharging: boolean;
  hitFlashTimer: number;
  sprite: UnitSprite;
}

export interface UnitSprite {
  bodyColor: string;
  scarfColor: string;
  hatColor: string;
}

// ---- Snowball ----
export interface Snowball {
  id: string;
  team: Team;
  pos: Vec2;
  vel: Vec2;
  speed: number;
  radius: number;
  damage: number;
  lifetime: number;
  maxLifetime: number;
  shadow: Vec2;            // ground shadow position
  heightOffset: number;    // simulated arc height
  heightVel: number;
}

// ---- Obstacle ----
export interface Obstacle {
  id: string;
  pos: Vec2;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: 'fort' | 'snowman' | 'tree' | 'rock';
}

// ---- Particles ----
export type ParticleType = 'snow_puff' | 'hit_spark' | 'snow_trail' | 'charge_glow';

export interface Particle {
  pos: Vec2;
  vel: Vec2;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  type: ParticleType;
}

// ---- Level ----
export interface LevelData {
  id: number;
  name: string;
  enemyCount: number;
  arenaWidth: number;
  arenaHeight: number;
  obstacles: Omit<Obstacle, 'id'>[];
  enemyAggression: number;  // 0..1
  enemyAccuracy: number;    // 0..1
  enemySpeed: number;       // multiplier
}

// ---- Game state ----
export type GamePhase = 'title' | 'how_to_play' | 'credits' | 'playing' | 'paused' | 'level_complete' | 'game_over' | 'victory';

export interface GameState {
  phase: GamePhase;
  level: number;
  score: number;
  units: Unit[];
  snowballs: Snowball[];
  obstacles: Obstacle[];
  particles: Particle[];
  selectedUnitId: string | null;
  camera: Camera;
  screenShake: ScreenShake;
  arenaWidth: number;
  arenaHeight: number;
  levelTransitionTimer: number;
}

export interface Camera {
  x: number;
  y: number;
  scale: number;
}

export interface ScreenShake {
  intensity: number;
  duration: number;
  timer: number;
}

// ---- Input ----
export interface InputState {
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  mouseJustPressed: boolean;
  mouseJustReleased: boolean;
  rightMouseDown: boolean;
  rightMouseJustPressed: boolean;
  keys: Set<string>;
  keysJustPressed: Set<string>;
}

// ---- Rendering ----
export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  camera: Camera;
  shake: Vec2;
}
