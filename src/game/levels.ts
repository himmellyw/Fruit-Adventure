import { LevelData } from './types';

export const LEVEL_1: LevelData = {
  id: 1,
  name: 'LEVEL 1',
  subtitle: 'SUNNY GARDEN',
  timeOfDay: 'morning',
  weather: 'sunny',
  width: 3200,
  height: 600,
  startX: 60,
  startY: 440,
  finishX: 3050,
  finishY: 420,
  platforms: [
    // Starting ground
    { x: 0, y: 500, width: 700, height: 100, type: 'grass' },
    // Step up platforms
    { x: 280, y: 400, width: 120, height: 24, type: 'grass' },
    { x: 450, y: 340, width: 140, height: 24, type: 'grass' },
    // First gap with ground after
    { x: 780, y: 500, width: 600, height: 100, type: 'grass' },
    // Elevated bridge
    { x: 920, y: 380, width: 180, height: 24, type: 'wood' },
    { x: 1160, y: 320, width: 140, height: 24, type: 'wood' },
    // Middle section with checkpoint
    { x: 1450, y: 500, width: 750, height: 100, type: 'grass' },
    // Secret Area canopy platform (Leaf secret)
    { x: 1720, y: 260, width: 160, height: 24, type: 'grass' },
    { x: 1880, y: 220, width: 140, height: 24, type: 'grass' },
    { x: 1700, y: 220, width: 60, height: 80, type: 'leaf_secret' }, // False wall
    // High tree bough holding Golden Fruit
    { x: 1950, y: 160, width: 80, height: 20, type: 'wood' },
    // Spring mushroom to reach high trees
    { x: 1650, y: 470, width: 40, height: 30, type: 'spring' },
    // Second gap with moving platform
    { x: 2240, y: 460, width: 100, height: 24, type: 'moving', moveX: 120, speed: 1.5, originalX: 2240 },
    // Final stretch to finish flag
    { x: 2420, y: 500, width: 780, height: 100, type: 'grass' },
    { x: 2650, y: 410, width: 130, height: 24, type: 'grass' },
    { x: 2850, y: 340, width: 120, height: 24, type: 'grass' }
  ],
  hazards: [
    { x: 700, y: 570, width: 80, height: 30, type: 'pit' },
    { x: 1380, y: 500, width: 70, height: 20, type: 'thorns' },
    { x: 2200, y: 570, width: 220, height: 30, type: 'pit' }
  ],
  enemies: [
    // Green worms
    {
      id: 101,
      type: 'green_worm',
      x: 360,
      y: 470,
      width: 32,
      height: 24,
      vx: 1.2,
      vy: 0,
      startX: 300,
      startY: 470,
      patrolDistance: 180,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    {
      id: 102,
      type: 'green_worm',
      x: 950,
      y: 470,
      width: 32,
      height: 24,
      vx: 1.2,
      vy: 0,
      startX: 850,
      startY: 470,
      patrolDistance: 220,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    {
      id: 103,
      type: 'green_worm',
      x: 1750,
      y: 470,
      width: 32,
      height: 24,
      vx: 1.2,
      vy: 0,
      startX: 1680,
      startY: 470,
      patrolDistance: 160,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    // Sky worm (aerial winged)
    {
      id: 104,
      type: 'sky_worm',
      x: 1200,
      y: 220,
      width: 32,
      height: 20,
      vx: 1.5,
      vy: 0,
      startX: 1100,
      startY: 220,
      patrolDistance: 200,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    {
      id: 105,
      type: 'green_worm',
      x: 2700,
      y: 470,
      width: 32,
      height: 24,
      vx: 1.2,
      vy: 0,
      startX: 2600,
      startY: 470,
      patrolDistance: 200,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    }
  ],
  collectibles: [
    { id: 1, x: 200, y: 460, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 0 },
    { id: 2, x: 300, y: 360, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 10 },
    { id: 3, x: 480, y: 300, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 20 },
    { id: 4, x: 820, y: 460, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 30 },
    { id: 5, x: 1000, y: 340, width: 16, height: 16, type: 'seed', collected: false, animOffset: 40 },
    { id: 6, x: 1200, y: 280, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 50 },
    { id: 7, x: 1550, y: 460, width: 16, height: 16, type: 'seed', collected: false, animOffset: 60 },
    // Inside Secret Area
    { id: 8, x: 1800, y: 220, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 70 },
    { id: 9, x: 1850, y: 220, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 80 },
    { id: 10, x: 2500, y: 460, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 90 },
    { id: 11, x: 2700, y: 370, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 100 },
    { id: 12, x: 2900, y: 300, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 110 }
  ],
  surpriseBoxes: [
    { id: 1, x: 340, y: 290, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'strawberry' },
    { id: 2, x: 1050, y: 240, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'orange' },
    { id: 3, x: 1920, y: 170, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'extra_life' },
    { id: 4, x: 2600, y: 320, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'fruit_coin' }
  ],
  goldenFruit: {
    x: 1980,
    y: 120,
    width: 24,
    height: 24,
    collected: false,
    sparkleTimer: 0
  },
  secretArea: {
    id: 1,
    x: 1700,
    y: 120,
    width: 260,
    height: 180,
    discovered: false,
    name: 'Treetop Bower'
  },
  checkpoint: {
    x: 1500,
    y: 440,
    width: 24,
    height: 60,
    activated: false
  },
  npc: {
    x: 120,
    y: 440,
    width: 36,
    height: 56,
    name: 'Gardener Bram',
    dialog: 'Watch out! Worms ahead! Stomp from above!',
    facing: 1
  }
};

export const LEVEL_2: LevelData = {
  id: 2,
  name: 'LEVEL 2',
  subtitle: 'DEEP GARDEN',
  timeOfDay: 'sunset',
  weather: 'cloudy',
  width: 3600,
  height: 600,
  startX: 60,
  startY: 440,
  finishX: 3450,
  finishY: 420,
  platforms: [
    // Starting platform
    { x: 0, y: 500, width: 450, height: 100, type: 'grass' },
    // Narrow elevated branches
    { x: 320, y: 410, width: 100, height: 24, type: 'wood' },
    { x: 480, y: 350, width: 90, height: 24, type: 'wood' },
    // First moving platform over thorny chasm
    { x: 620, y: 380, width: 90, height: 20, type: 'moving', moveY: 90, speed: 1.6, originalY: 380 },
    // Stone ledge
    { x: 780, y: 480, width: 400, height: 120, type: 'stone' },
    { x: 920, y: 380, width: 110, height: 24, type: 'wood' },
    // Moving horizontal vine
    { x: 1240, y: 380, width: 100, height: 20, type: 'moving', moveX: 180, speed: 2.0, originalX: 1240 },
    // Middle grove with checkpoint
    { x: 1520, y: 490, width: 600, height: 110, type: 'grass' },
    // Secret root cavern under mid-grove
    { x: 1780, y: 360, width: 110, height: 24, type: 'wood' },
    { x: 1940, y: 280, width: 120, height: 24, type: 'wood' },
    { x: 2080, y: 220, width: 140, height: 24, type: 'grass' },
    // Secret false foliage
    { x: 2070, y: 160, width: 50, height: 90, type: 'leaf_secret' },
    // Spring mushroom to cross cavern
    { x: 1580, y: 460, width: 40, height: 30, type: 'spring' },
    // Moving double platforms
    { x: 2320, y: 420, width: 90, height: 20, type: 'moving', moveX: 140, speed: 2.2, originalX: 2320 },
    { x: 2540, y: 340, width: 90, height: 20, type: 'moving', moveY: 100, speed: 1.8, originalY: 340 },
    // High stone path leading to finish
    { x: 2750, y: 480, width: 850, height: 120, type: 'grass' },
    { x: 2950, y: 390, width: 110, height: 24, type: 'wood' },
    { x: 3150, y: 310, width: 110, height: 24, type: 'wood' }
  ],
  hazards: [
    { x: 450, y: 570, width: 330, height: 30, type: 'pit' },
    { x: 880, y: 480, width: 80, height: 20, type: 'thorns' },
    { x: 1180, y: 570, width: 340, height: 30, type: 'pit' },
    { x: 1850, y: 490, width: 100, height: 20, type: 'spikes' },
    { x: 2120, y: 570, width: 630, height: 30, type: 'pit' }
  ],
  enemies: [
    // Red Worm (fast)
    {
      id: 201,
      type: 'red_worm',
      x: 200,
      y: 470,
      width: 32,
      height: 24,
      vx: 2.2,
      vy: 0,
      startX: 150,
      startY: 470,
      patrolDistance: 160,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    // Fruit Bat
    {
      id: 202,
      type: 'fruit_bat',
      x: 650,
      y: 260,
      width: 34,
      height: 24,
      vx: 1.8,
      vy: 0,
      startX: 550,
      startY: 260,
      patrolDistance: 220,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    // Blue Worm (jumping)
    {
      id: 203,
      type: 'blue_worm',
      x: 880,
      y: 450,
      width: 32,
      height: 24,
      vx: 1.4,
      vy: 0,
      startX: 800,
      startY: 450,
      patrolDistance: 180,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0,
      jumpCooldown: 80
    },
    // Hanging Worm
    {
      id: 204,
      type: 'hanging_worm',
      x: 1050,
      y: 280,
      width: 24,
      height: 32,
      vx: 0,
      vy: 1.0,
      startX: 1050,
      startY: 200,
      originalY: 200,
      patrolDistance: 120,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0,
      diveState: 'hanging',
      hangLength: 80
    },
    // Red worm on middle grove
    {
      id: 205,
      type: 'red_worm',
      x: 1680,
      y: 460,
      width: 32,
      height: 24,
      vx: 2.2,
      vy: 0,
      startX: 1600,
      startY: 460,
      patrolDistance: 180,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    // Fruit Bat
    {
      id: 206,
      type: 'fruit_bat',
      x: 2450,
      y: 240,
      width: 34,
      height: 24,
      vx: 2.0,
      vy: 0,
      startX: 2350,
      startY: 240,
      patrolDistance: 240,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    // Blue worm near end
    {
      id: 207,
      type: 'blue_worm',
      x: 2900,
      y: 450,
      width: 32,
      height: 24,
      vx: 1.5,
      vy: 0,
      startX: 2800,
      startY: 450,
      patrolDistance: 190,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0,
      jumpCooldown: 90
    }
  ],
  collectibles: [
    { id: 21, x: 180, y: 460, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 5 },
    { id: 22, x: 350, y: 370, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 15 },
    { id: 23, x: 520, y: 310, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 25 },
    { id: 24, x: 850, y: 440, width: 16, height: 16, type: 'seed', collected: false, animOffset: 35 },
    { id: 25, x: 1000, y: 340, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 45 },
    { id: 26, x: 1300, y: 330, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 55 },
    { id: 27, x: 1700, y: 450, width: 16, height: 16, type: 'seed', collected: false, animOffset: 65 },
    // Secret area items
    { id: 28, x: 2120, y: 180, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 75 },
    { id: 29, x: 2160, y: 180, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 85 },
    { id: 30, x: 2800, y: 440, width: 16, height: 16, type: 'seed', collected: false, animOffset: 95 },
    { id: 31, x: 3000, y: 350, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 105 },
    { id: 32, x: 3200, y: 270, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 115 }
  ],
  surpriseBoxes: [
    { id: 11, x: 360, y: 280, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'grape' },
    { id: 12, x: 960, y: 260, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'watermelon' },
    { id: 13, x: 2180, y: 140, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'bonus_score' },
    { id: 14, x: 2850, y: 380, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'extra_life' }
  ],
  goldenFruit: {
    x: 2150,
    y: 180,
    width: 24,
    height: 24,
    collected: false,
    sparkleTimer: 0
  },
  secretArea: {
    id: 2,
    x: 2060,
    y: 120,
    width: 200,
    height: 140,
    discovered: false,
    name: 'Ancient Moss Canopy'
  },
  checkpoint: {
    x: 1540,
    y: 430,
    width: 24,
    height: 60,
    activated: false
  },
  npc: {
    x: 100,
    y: 440,
    width: 36,
    height: 56,
    name: 'Gardener Bram',
    dialog: 'Maybe there is something hidden behind that dense foliage!',
    facing: 1
  }
};

export const LEVEL_3: LevelData = {
  id: 3,
  name: 'LEVEL 3',
  subtitle: 'FORBIDDEN GARDEN',
  timeOfDay: 'night',
  weather: 'rainy',
  width: 3800,
  height: 600,
  startX: 60,
  startY: 440,
  finishX: 3700, // Gigaworm arena goal
  finishY: 420,
  platforms: [
    // Starting platform
    { x: 0, y: 500, width: 400, height: 100, type: 'stone' },
    { x: 260, y: 400, width: 90, height: 24, type: 'stone' },
    { x: 420, y: 320, width: 90, height: 24, type: 'stone' },
    // Tricky moving platforms over deep spike chasm
    { x: 570, y: 380, width: 80, height: 20, type: 'moving', moveX: 130, speed: 2.4, originalX: 570 },
    { x: 780, y: 330, width: 80, height: 20, type: 'moving', moveY: 100, speed: 2.2, originalY: 330 },
    // Mid island
    { x: 940, y: 480, width: 380, height: 120, type: 'stone' },
    // Spring mushroom to vault over spike field
    { x: 1020, y: 450, width: 40, height: 30, type: 'spring' },
    { x: 1140, y: 320, width: 100, height: 24, type: 'stone' },
    // Secret area up in the night clouds
    { x: 1280, y: 220, width: 100, height: 24, type: 'stone' },
    { x: 1420, y: 150, width: 140, height: 24, type: 'wood' },
    { x: 1410, y: 100, width: 50, height: 80, type: 'leaf_secret' },
    // Pre-boss checkpoint zone
    { x: 1600, y: 490, width: 450, height: 110, type: 'stone' },
    { x: 1800, y: 390, width: 100, height: 24, type: 'wood' },
    // Boss Arena (Wide enclosed platform from 2200 to 3600)
    { x: 2200, y: 500, width: 1500, height: 100, type: 'stone' },
    // Boss arena elevated platforms for tactical jump attacks
    { x: 2360, y: 380, width: 110, height: 24, type: 'wood' },
    { x: 2600, y: 330, width: 120, height: 24, type: 'wood' },
    { x: 2840, y: 380, width: 110, height: 24, type: 'wood' },
    { x: 3080, y: 330, width: 120, height: 24, type: 'wood' },
    { x: 3320, y: 380, width: 110, height: 24, type: 'wood' }
  ],
  hazards: [
    { x: 400, y: 570, width: 540, height: 30, type: 'pit' },
    { x: 990, y: 480, width: 80, height: 20, type: 'spikes' },
    { x: 1320, y: 570, width: 280, height: 30, type: 'pit' },
    { x: 2050, y: 570, width: 150, height: 30, type: 'pit' }
  ],
  enemies: [
    // Purple predator worm
    {
      id: 301,
      type: 'purple_worm',
      x: 250,
      y: 470,
      width: 32,
      height: 24,
      vx: 2.4,
      vy: 0,
      startX: 180,
      startY: 470,
      patrolDistance: 160,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    // Fruit Bat
    {
      id: 302,
      type: 'fruit_bat',
      x: 700,
      y: 220,
      width: 34,
      height: 24,
      vx: 2.2,
      vy: 0,
      startX: 600,
      startY: 220,
      patrolDistance: 240,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    },
    // Stone worm (tough armored!)
    {
      id: 303,
      type: 'stone_worm',
      x: 1050,
      y: 450,
      width: 34,
      height: 26,
      vx: 1.2,
      vy: 0,
      startX: 980,
      startY: 450,
      patrolDistance: 140,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 2,
      maxHealth: 2,
      animFrame: 0,
      stateTimer: 0
    },
    // Hanging worm
    {
      id: 304,
      type: 'hanging_worm',
      x: 1220,
      y: 240,
      width: 24,
      height: 32,
      vx: 0,
      vy: 1.2,
      startX: 1220,
      startY: 160,
      originalY: 160,
      patrolDistance: 130,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0,
      diveState: 'hanging',
      hangLength: 90
    },
    // Purple worm in pre-boss section
    {
      id: 305,
      type: 'purple_worm',
      x: 1750,
      y: 460,
      width: 32,
      height: 24,
      vx: 2.5,
      vy: 0,
      startX: 1650,
      startY: 460,
      patrolDistance: 200,
      facing: 1,
      isDead: false,
      deathTimer: 0,
      health: 1,
      maxHealth: 1,
      animFrame: 0,
      stateTimer: 0
    }
  ],
  collectibles: [
    { id: 41, x: 180, y: 460, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 10 },
    { id: 42, x: 300, y: 360, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 20 },
    { id: 43, x: 450, y: 280, width: 16, height: 16, type: 'seed', collected: false, animOffset: 30 },
    { id: 44, x: 620, y: 320, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 40 },
    { id: 45, x: 820, y: 270, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 50 },
    { id: 46, x: 1080, y: 440, width: 16, height: 16, type: 'seed', collected: false, animOffset: 60 },
    // Secret area items
    { id: 47, x: 1450, y: 110, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 70 },
    { id: 48, x: 1500, y: 110, width: 16, height: 16, type: 'fruit_coin', collected: false, animOffset: 80 },
    { id: 49, x: 1700, y: 450, width: 16, height: 16, type: 'cherry', collected: false, animOffset: 90 },
    { id: 50, x: 1850, y: 350, width: 16, height: 16, type: 'seed', collected: false, animOffset: 100 }
  ],
  surpriseBoxes: [
    { id: 21, x: 300, y: 260, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'grape' },
    { id: 22, x: 1180, y: 220, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'watermelon' },
    { id: 23, x: 1520, y: 90, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'extra_life' },
    { id: 24, x: 1900, y: 320, width: 32, height: 32, opened: false, bumpOffsetY: 0, sparkleTimer: 0, contents: 'strawberry' }
  ],
  goldenFruit: {
    x: 1480,
    y: 110,
    width: 24,
    height: 24,
    collected: false,
    sparkleTimer: 0
  },
  secretArea: {
    id: 3,
    x: 1400,
    y: 60,
    width: 180,
    height: 120,
    discovered: false,
    name: 'Moonlit Sanctuary'
  },
  checkpoint: {
    x: 1650,
    y: 430,
    width: 24,
    height: 60,
    activated: false
  },
  npc: {
    x: 100,
    y: 440,
    width: 36,
    height: 56,
    name: 'Gardener Bram',
    dialog: 'Gigaworm is in the orchard arena ahead! Defeat it to restore the garden!',
    facing: 1
  }
};

export const ALL_LEVELS: LevelData[] = [LEVEL_1, LEVEL_2, LEVEL_3];
