// ---- Timing ----
export const FIXED_DT = 1 / 60;          // 60 Hz physics
export const MAX_DT = 0.25;               // max frame time before skipping

// ---- Arena ----
export const BASE_ARENA_W = 800;
export const BASE_ARENA_H = 600;
export const TILE_SIZE = 40;

// ---- Units ----
export const UNIT_RADIUS = 14;
export const UNIT_SPEED = 120;            // px/sec
export const UNIT_MAX_HP = 100;
export const UNIT_COOLDOWN = 0.8;         // seconds between throws
export const UNIT_KNOCKOUT_TIME = 999;    // permanent knockout
export const UNIT_HIT_FLASH_TIME = 0.15;
export const MOVEMENT_RANGE = 250;        // max move distance per click

// ---- Snowballs ----
export const SNOWBALL_RADIUS = 5;
export const SNOWBALL_MIN_SPEED = 200;
export const SNOWBALL_MAX_SPEED = 500;
export const SNOWBALL_MIN_DAMAGE = 15;
export const SNOWBALL_MAX_DAMAGE = 45;
export const SNOWBALL_LIFETIME = 2.0;     // seconds
export const SNOWBALL_ARC_HEIGHT = 30;    // pixels peak height
export const CHARGE_TIME = 1.0;           // seconds for full charge

// ---- Obstacles ----
export const FORT_HP = 80;

// ---- Particles ----
export const MAX_PARTICLES = 200;
export const PUFF_COUNT_ON_HIT = 8;
export const TRAIL_INTERVAL = 0.05;       // seconds between trail particles

// ---- AI ----
export const AI_THINK_INTERVAL = 0.5;     // seconds between AI decisions
export const AI_THROW_RANGE = 350;
export const AI_APPROACH_RANGE = 250;
export const AI_SCATTER_DISTANCE = 60;

// ---- Camera ----
export const SHAKE_DECAY = 8;             // how fast shake fades

// ---- Colors ----
export const TEAM_COLORS = {
  red: {
    body: '#e74c3c',
    scarf: '#c0392b',
    hat: '#922b21',
    outline: '#7b241c',
  },
  green: {
    body: '#2ecc71',
    scarf: '#27ae60',
    hat: '#1e8449',
    outline: '#196f3d',
  },
} as const;

export const SNOW_WHITE = '#f0f0f5';
export const SNOW_SHADOW = '#c8d6e5';
export const SNOW_BLUE = '#74b9ff';
export const ICE_BLUE = '#a0c4ff';
export const GROUND_COLOR = '#e8eef4';
export const GRID_COLOR = '#d5dee8';
