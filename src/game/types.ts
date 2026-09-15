export type GameScreen = 'menu' | 'level_select' | 'playing' | 'game_over' | 'victory';

export type WeatherType = 'sunny' | 'cloudy' | 'rainy';

export type TimeOfDay = 'morning' | 'sunset' | 'night';

export type PowerUpType =
  | 'strawberry' // Speed boost
  | 'orange'     // High jump
  | 'grape'      // Shield (absorbs 1 hit)
  | 'watermelon' // Crush power (insta-crush stone worms/boulders)
  | 'bonus_score'// Score +500
  | 'extra_life' // +1 Life
  | 'fruit_coin' // Collectibles shower
  | 'enemy';     // "OH NO!" mini surprise worm

export interface PowerUpState {
  type: PowerUpType;
  name: string;
  duration: number; // in seconds
  maxDuration: number;
}

export type EnemyType =
  | 'green_worm'
  | 'red_worm'
  | 'blue_worm'
  | 'purple_worm'
  | 'stone_worm'
  | 'sky_worm'
  | 'fruit_bat'
  | 'hanging_worm';

export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  patrolDistance: number;
  facing: 1 | -1;
  isDead: boolean;
  deathTimer: number;
  health: number;
  maxHealth: number;
  animFrame: number;
  stateTimer: number;
  // Specific enemy properties
  jumpCooldown?: number;
  diveState?: 'hanging' | 'diving' | 'returning';
  originalY?: number;
  hangLength?: number;
}

export interface Collectible {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'fruit_coin' | 'cherry' | 'seed';
  collected: boolean;
  animOffset: number;
}

export interface SurpriseBox {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  opened: boolean;
  bumpOffsetY: number;
  sparkleTimer: number;
  contents: PowerUpType;
}

export interface GoldenFruit {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  sparkleTimer: number;
}

export interface SecretArea {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  discovered: boolean;
  name?: string;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'grass' | 'dirt' | 'wood' | 'stone' | 'moving' | 'spring' | 'leaf_secret';
  // For moving platforms
  moveX?: number;
  moveY?: number;
  speed?: number;
  originalX?: number;
  originalY?: number;
  phase?: number;
}

export interface Hazard {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spikes' | 'thorns' | 'pit';
}

export interface Checkpoint {
  x: number;
  y: number;
  width: number;
  height: number;
  activated: boolean;
}

export interface NPC {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  dialog: string;
  facing: 1 | -1;
  speechTimer?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  scale: number;
}

export interface BossState {
  active: boolean;
  name: string;
  health: number;
  maxHealth: number;
  phase: 1 | 2 | 3;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  isStunned: boolean;
  stunTimer: number;
  attackTimer: number;
  attackType: 'charge' | 'leap' | 'spawn' | 'slam' | 'idle';
  isDead: boolean;
  deathTimer: number;
  flashTimer: number;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  timeOfDay: TimeOfDay;
  weather: WeatherType;
  width: number;
  height: number;
  startX: number;
  startY: number;
  finishX: number;
  finishY: number;
  platforms: Platform[];
  hazards: Hazard[];
  enemies: Enemy[];
  collectibles: Collectible[];
  surpriseBoxes: SurpriseBox[];
  goldenFruit: GoldenFruit;
  secretArea: SecretArea;
  checkpoint: Checkpoint;
  npc: NPC;
}

export interface PlayerStats {
  score: number;
  lives: number;
  maxLives: number;
  fruitsCollected: number;
  totalFruits: number;
  goldenFruitCollected: boolean;
  comboCount: number;
  comboTimer: number;
}

export interface SaveProgress {
  unlockedLevels: number; // 1, 2, or 3
  goldenFruits: [boolean, boolean, boolean]; // Level 1, 2, 3
  highScores: [number, number, number];
  gardenRestored: boolean; // boss defeated
}
