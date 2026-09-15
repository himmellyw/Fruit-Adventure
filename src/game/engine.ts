import { audio } from './audio';
import { ALL_LEVELS } from './levels';
import { SpriteRenderer } from './sprites';
import {
  BossState,
  Enemy,
  FloatingText,
  GameScreen,
  LevelData,
  Particle,
  Platform,
  PowerUpState,
  PowerUpType,
  SaveProgress
} from './types';

export interface GameEngineCallbacks {
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
  onFruitChange: (collected: number, total: number) => void;
  onGoldenFruitChange: (collected: boolean) => void;
  onPowerUpChange: (power: PowerUpState | null) => void;
  onComboChange: (combo: number) => void;
  onBossStateChange: (boss: BossState | null) => void;
  onLevelComplete: (levelId: number, score: number, goldenFruit: boolean) => void;
  onGameOver: (finalScore: number, levelId: number) => void;
  onVictory: (finalScore: number, allGoldenFruits: boolean) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private callbacks: GameEngineCallbacks;

  // Screen & Level State
  public currentScreen: GameScreen = 'menu';
  public currentLevel: LevelData;
  public frameCount: number = 0;

  // Player Entity
  public player = {
    x: 60,
    y: 440,
    width: 28,
    height: 30,
    vx: 0,
    vy: 0,
    facing: 1 as 1 | -1,
    isGrounded: false,
    state: 'idle' as 'idle' | 'run' | 'jump' | 'fall' | 'hurt' | 'victory',
    invulnerableTimer: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    hasGrapeShield: false,
    activePower: null as PowerUpState | null
  };
  public standingPlatform: Platform | null = null;

  // Stats
  public score: number = 0;
  public lives: number = 3;
  public fruitsCollected: number = 0;
  public totalFruits: number = 10;
  public goldenFruitFound: boolean = false;
  public comboCount: number = 0;
  public comboTimer: number = 0;

  // Camera & Visuals
  public camera = { x: 0, y: 0 };
  public screenShake: number = 0;
  public transitionAlpha: number = 0;
  public transitionDirection: 'in' | 'out' | 'none' = 'none';
  private onTransitionEnd?: () => void;

  // Boss
  public boss: BossState | null = null;

  // Environment & Dynamic Systems
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];
  private rainDrops: { x: number; y: number; speed: number; length: number }[] = [];
  private clouds: { x: number; y: number; speed: number; scale: number }[] = [];
  private ambientButterflies: { x: number; y: number; vx: number; vy: number; color: string }[] = [];

  // Controls input map
  public keys = {
    left: false,
    right: false,
    jump: false
  };

  // Persistence
  public progress: SaveProgress = {
    unlockedLevels: 1,
    goldenFruits: [false, false, false],
    highScores: [0, 0, 0],
    gardenRestored: false
  };

  constructor(canvas: HTMLCanvasElement, callbacks: GameEngineCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D context not available');
    this.ctx = context;
    this.ctx.imageSmoothingEnabled = false;
    this.callbacks = callbacks;

    this.currentLevel = JSON.parse(JSON.stringify(ALL_LEVELS[0]));
    this.loadProgress();
    this.initEnvironment();
  }

  public loadProgress() {
    try {
      const saved = localStorage.getItem('fruit_garden_save_v1');
      if (saved) {
        this.progress = JSON.parse(saved);
      }
    } catch {
      // LocalStorage unavailable
    }
  }

  public saveProgress() {
    try {
      localStorage.setItem('fruit_garden_save_v1', JSON.stringify(this.progress));
    } catch {
      // Ignore
    }
  }

  private initEnvironment() {
    // Generate rain particles
    this.rainDrops = [];
    for (let i = 0; i < 70; i++) {
      this.rainDrops.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        speed: 6 + Math.random() * 4,
        length: 8 + Math.random() * 6
      });
    }

    // Fluffy background clouds
    this.clouds = [];
    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: Math.random() * 1200,
        y: 40 + Math.random() * 140,
        speed: 0.2 + Math.random() * 0.4,
        scale: 0.8 + Math.random() * 0.6
      });
    }

    // Ambient garden butterflies
    this.ambientButterflies = [];
    const colors = ['#f43f5e', '#facc15', '#38bdf8', '#c084fc'];
    for (let i = 0; i < 5; i++) {
      this.ambientButterflies.push({
        x: 100 + Math.random() * 700,
        y: 200 + Math.random() * 250,
        vx: 0.5 - Math.random(),
        vy: 0.3 - Math.random() * 0.6,
        color: colors[i % colors.length]
      });
    }
  }

  public startLevel(levelId: number) {
    const baseLevel = ALL_LEVELS.find((l) => l.id === levelId) || ALL_LEVELS[0];
    this.currentLevel = JSON.parse(JSON.stringify(baseLevel));
    this.currentScreen = 'playing';

    // Reset player position to start
    this.player.x = this.currentLevel.startX;
    this.player.y = this.currentLevel.startY;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.isGrounded = false;
    this.standingPlatform = null;
    this.player.state = 'idle';
    this.player.invulnerableTimer = 0;
    this.player.hasGrapeShield = false;
    this.player.activePower = null;

    // Reset stats for level
    this.fruitsCollected = 0;
    this.totalFruits = this.currentLevel.collectibles.length;
    this.goldenFruitFound = false;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.particles = [];
    this.floatingTexts = [];
    this.screenShake = 0;

    // Setup Boss for Level 3
    if (levelId === 3) {
      this.boss = {
        active: false, // Activated when player reaches arena
        name: 'GIGAWORM',
        health: 12,
        maxHealth: 12,
        phase: 1,
        x: 2800,
        y: 420,
        width: 140,
        height: 60,
        vx: -2.5,
        vy: 0,
        facing: -1,
        isStunned: false,
        stunTimer: 0,
        attackTimer: 0,
        attackType: 'charge',
        isDead: false,
        deathTimer: 0,
        flashTimer: 0
      };
      this.callbacks.onBossStateChange(null);
    } else {
      this.boss = null;
      this.callbacks.onBossStateChange(null);
    }

    // Notify React HUD
    this.callbacks.onScoreChange(this.score);
    this.callbacks.onLivesChange(this.lives);
    this.callbacks.onFruitChange(this.fruitsCollected, this.totalFruits);
    this.callbacks.onGoldenFruitChange(this.goldenFruitFound);
    this.callbacks.onPowerUpChange(null);
    this.callbacks.onComboChange(0);

    // Play appropriate BGM
    const trackName = levelId === 1 ? 'level1' : levelId === 2 ? 'level2' : 'level3';
    audio.playBGM(trackName);
  }

  public respawnAtCheckpoint() {
    this.lives--;
    this.callbacks.onLivesChange(this.lives);
    this.comboCount = 0;
    this.callbacks.onComboChange(0);
    this.player.hasGrapeShield = false;
    this.player.activePower = null;
    this.callbacks.onPowerUpChange(null);

    if (this.lives <= 0) {
      this.triggerGameOver();
      return;
    }

    audio.playHurt();
    this.addScreenShake(8);

    if (this.currentLevel.checkpoint.activated) {
      this.player.x = this.currentLevel.checkpoint.x;
      this.player.y = this.currentLevel.checkpoint.y - 20;
    } else {
      this.player.x = this.currentLevel.startX;
      this.player.y = this.currentLevel.startY;
    }
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.isGrounded = false;
    this.standingPlatform = null;
    this.player.invulnerableTimer = 90; // 1.5s invulnerability
  }

  public addScreenShake(amount: number) {
    this.screenShake = Math.max(this.screenShake, amount);
  }

  public addFloatingText(x: number, y: number, text: string, color: string = '#ffffff') {
    this.floatingTexts.push({
      id: Math.random(),
      x,
      y,
      text,
      color,
      life: 50,
      scale: 1.2
    });
  }

  public addParticles(x: number, y: number, color: string, count: number = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 3,
        life: 25 + Math.random() * 20,
        maxLife: 45
      });
    }
  }

  // Combat: Player stomps an enemy
  public handleEnemyStomp(enemy: Enemy) {
    audio.playStomp();
    this.addParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#84cc16', 12);

    // Stomp bounce thrust - crisp high bounce
    this.player.vy = -11.0;
    this.player.isGrounded = false;
    this.standingPlatform = null;

    // Check Watermelon smash or normal damage
    const damage = this.player.activePower?.type === 'watermelon' ? 2 : 1;
    enemy.health -= damage;

    if (enemy.health <= 0) {
      enemy.isDead = true;
      enemy.deathTimer = 20;

      // Combo handling
      this.comboCount++;
      this.comboTimer = 180; // 3 seconds to chain
      const scoreGain = 100 * this.comboCount;
      this.score += scoreGain;
      this.callbacks.onScoreChange(this.score);
      this.callbacks.onComboChange(this.comboCount);

      if (this.comboCount > 1) {
        this.addFloatingText(
          enemy.x,
          enemy.y - 10,
          `COMBO x${this.comboCount}! +${scoreGain}`,
          '#facc15'
        );
      } else {
        this.addFloatingText(enemy.x, enemy.y - 10, `+${scoreGain}`, '#ffffff');
      }
    } else {
      // Armored enemy took 1 hit
      this.addFloatingText(enemy.x, enemy.y - 10, 'HIT!', '#94a3b8');
      audio.playBossHurt();
    }
  }

  // Player hits enemy from side or hazards
  public handlePlayerHurt() {
    if (this.player.invulnerableTimer > 0) return;

    // Grape Shield absorbs hit safely!
    if (this.player.hasGrapeShield) {
      this.player.hasGrapeShield = false;
      this.player.activePower = null;
      this.callbacks.onPowerUpChange(null);
      audio.playBossHurt();
      this.addParticles(this.player.x + 14, this.player.y + 15, '#c084fc', 16);
      this.addFloatingText(this.player.x, this.player.y - 20, 'SHIELD BROKE!', '#c084fc');
      this.player.invulnerableTimer = 60;
      this.player.vy = -6;
      return;
    }

    // Normal damage
    this.player.invulnerableTimer = 90;
    this.comboCount = 0;
    this.callbacks.onComboChange(0);
    audio.playHurt();
    this.addScreenShake(6);
    this.addParticles(this.player.x + 14, this.player.y + 15, '#ef4444', 10);
    this.addFloatingText(this.player.x, this.player.y - 10, '-1 LIFE', '#ef4444');

    this.lives--;
    this.callbacks.onLivesChange(this.lives);

    // Knockback bounce
    this.player.vy = -7;
    this.player.vx = -this.player.facing * 3;

    if (this.lives <= 0) {
      this.triggerGameOver();
    }
  }

  // Surprise Box interaction
  public openSurpriseBox(box: { id: number; x: number; y: number; width: number; height: number; opened: boolean; bumpOffsetY: number; contents: PowerUpType }) {
    if (box.opened) return;
    box.opened = true;
    box.bumpOffsetY = -10;
    audio.playSurpriseBox();
    this.addParticles(box.x + box.width / 2, box.y, '#f59e0b', 14);
    this.addScreenShake(4);

    // Determine reward
    const rewards: PowerUpType[] = [
      'strawberry',
      'orange',
      'grape',
      'watermelon',
      'bonus_score',
      'extra_life',
      'fruit_coin',
      'enemy'
    ];
    // Random selection or preset content
    const chosen = Math.random() < 0.3 ? box.contents : rewards[Math.floor(Math.random() * rewards.length)];

    if (chosen === 'strawberry') {
      audio.playLucky();
      this.player.activePower = { type: 'strawberry', name: 'Strawberry Speed', duration: 15, maxDuration: 15 };
      this.callbacks.onPowerUpChange(this.player.activePower);
      this.addFloatingText(box.x, box.y - 24, 'LUCKY! SPEED UP!', '#ef4444');
    } else if (chosen === 'orange') {
      audio.playLucky();
      this.player.activePower = { type: 'orange', name: 'Orange High Jump', duration: 15, maxDuration: 15 };
      this.callbacks.onPowerUpChange(this.player.activePower);
      this.addFloatingText(box.x, box.y - 24, 'LUCKY! HIGH JUMP!', '#f97316');
    } else if (chosen === 'grape') {
      audio.playLucky();
      this.player.hasGrapeShield = true;
      this.player.activePower = { type: 'grape', name: 'Grape Shield', duration: 30, maxDuration: 30 };
      this.callbacks.onPowerUpChange(this.player.activePower);
      this.addFloatingText(box.x, box.y - 24, 'LUCKY! SHIELD ON!', '#a855f7');
    } else if (chosen === 'watermelon') {
      audio.playSuperBonus();
      this.player.activePower = { type: 'watermelon', name: 'Watermelon Smash', duration: 15, maxDuration: 15 };
      this.callbacks.onPowerUpChange(this.player.activePower);
      this.addFloatingText(box.x, box.y - 24, 'SUPER BONUS! SMASH!', '#22c55e');
    } else if (chosen === 'bonus_score') {
      audio.playSuperBonus();
      this.score += 500;
      this.callbacks.onScoreChange(this.score);
      this.addFloatingText(box.x, box.y - 24, 'SUPER BONUS! +500!', '#facc15');
    } else if (chosen === 'extra_life') {
      audio.playLucky();
      if (this.lives < 4) this.lives++;
      this.callbacks.onLivesChange(this.lives);
      this.addFloatingText(box.x, box.y - 24, 'LUCKY! +1 LIFE!', '#fb7185');
    } else if (chosen === 'fruit_coin') {
      audio.playCoin();
      this.score += 250;
      this.fruitsCollected = Math.min(this.totalFruits, this.fruitsCollected + 3);
      this.callbacks.onScoreChange(this.score);
      this.callbacks.onFruitChange(this.fruitsCollected, this.totalFruits);
      this.addFloatingText(box.x, box.y - 24, 'LUCKY! +250 COINS!', '#eab308');
    } else if (chosen === 'enemy') {
      audio.playOhNo();
      this.addFloatingText(box.x, box.y - 24, 'OH NO! MINI WORM!', '#a855f7');
      // Spawn a surprise mini worm!
      this.currentLevel.enemies.push({
        id: Math.random(),
        type: 'purple_worm',
        x: box.x,
        y: box.y - 20,
        width: 24,
        height: 18,
        vx: 2.0,
        vy: -4,
        startX: box.x - 60,
        startY: box.y - 20,
        patrolDistance: 120,
        facing: 1,
        isDead: false,
        deathTimer: 0,
        health: 1,
        maxHealth: 1,
        animFrame: 0,
        stateTimer: 0
      });
    }
  }

  // Trigger level complete
  public triggerLevelComplete() {
    audio.stopBGM();
    audio.playLevelClear();
    this.score += 1000;
    this.callbacks.onScoreChange(this.score);

    // Update progress
    const idx = this.currentLevel.id - 1;
    if (this.score > this.progress.highScores[idx]) {
      this.progress.highScores[idx] = this.score;
    }
    if (this.goldenFruitFound) {
      this.progress.goldenFruits[idx] = true;
    }
    if (this.currentLevel.id === 1 && this.progress.unlockedLevels < 2) {
      this.progress.unlockedLevels = 2;
    } else if (this.currentLevel.id === 2 && this.progress.unlockedLevels < 3) {
      this.progress.unlockedLevels = 3;
    }
    this.saveProgress();

    this.player.state = 'victory';
    this.addFloatingText(this.player.x, this.player.y - 40, 'LEVEL COMPLETE! +1000', '#facc15');

    setTimeout(() => {
      this.callbacks.onLevelComplete(this.currentLevel.id, this.score, this.goldenFruitFound);
    }, 2000);
  }

  // Trigger game over
  public triggerGameOver() {
    audio.stopBGM();
    audio.playGameOver();
    this.currentScreen = 'game_over';
    this.callbacks.onGameOver(this.score, this.currentLevel.id);
  }

  // Trigger victory after Boss
  public triggerVictory() {
    audio.stopBGM();
    audio.playVictory();
    this.currentScreen = 'victory';
    this.progress.gardenRestored = true;
    if (this.goldenFruitFound) {
      this.progress.goldenFruits[2] = true;
    }
    this.score += 3000; // Grand victory bonus!
    this.saveProgress();

    const allGolden = this.progress.goldenFruits.every((g) => g === true);
    this.callbacks.onVictory(this.score, allGolden);
  }

  // Update Game Loop (Physics, Combat, AI)
  public update() {
    this.frameCount++;

    if (this.currentScreen !== 'playing') {
      // Menu background animations
      for (const b of this.ambientButterflies) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 50 || b.x > 750) b.vx *= -1;
        if (b.y < 150 || b.y > 450) b.vy *= -1;
      }
      return;
    }

    // Power-up timer countdown
    if (this.player.activePower) {
      this.player.activePower.duration -= 1 / 60;
      if (this.player.activePower.duration <= 0) {
        this.player.activePower = null;
        this.callbacks.onPowerUpChange(null);
      } else if (this.frameCount % 15 === 0) {
        this.callbacks.onPowerUpChange({ ...this.player.activePower });
      }
    }

    // Combo timer countdown
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) {
        this.comboCount = 0;
        this.callbacks.onComboChange(0);
      }
    }

    // Invulnerability timer
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer--;
    }

    // Screen Shake decay
    if (this.screenShake > 0) {
      this.screenShake *= 0.9;
      if (this.screenShake < 0.1) this.screenShake = 0;
    }

    // Dynamic weather updates (Rain)
    if (this.currentLevel.weather === 'rainy') {
      for (const r of this.rainDrops) {
        r.y += r.speed;
        r.x += 1;
        if (r.y > 600) {
          r.y = -10;
          r.x = Math.random() * 800;
        }
      }
    }

    // Cloud drift
    for (const c of this.clouds) {
      c.x += c.speed;
      if (c.x > 1400) c.x = -200;
    }

    // 0. Update Moving Platforms FIRST and carry player if standing on one
    for (const plat of this.currentLevel.platforms) {
      if (plat.type === 'moving') {
        const oldX = plat.x;
        const oldY = plat.y;
        plat.phase = (plat.phase || 0) + 0.03 * (plat.speed || 1.5);
        if (plat.moveX && plat.originalX !== undefined) {
          plat.x = plat.originalX + Math.sin(plat.phase) * plat.moveX;
        }
        if (plat.moveY && plat.originalY !== undefined) {
          plat.y = plat.originalY + Math.sin(plat.phase) * plat.moveY;
        }
        const deltaX = plat.x - oldX;
        const deltaY = plat.y - oldY;
        // If player is standing on this platform, smoothly ride it!
        if (this.standingPlatform === plat) {
          this.player.x += deltaX;
          this.player.y += deltaY;
        }
      }
    }

    // 1. Player Movement & Physics
    const speedMultiplier = this.player.activePower?.type === 'strawberry' ? 1.6 : 1.0;
    const maxSpeed = 4.4 * speedMultiplier;
    const accel = 0.65 * speedMultiplier;
    const friction = 0.80;

    if (this.keys.left) {
      this.player.vx = Math.max(-maxSpeed, this.player.vx - accel);
      this.player.facing = -1;
    } else if (this.keys.right) {
      this.player.vx = Math.min(maxSpeed, this.player.vx + accel);
      this.player.facing = 1;
    } else {
      this.player.vx *= friction;
      if (Math.abs(this.player.vx) < 0.1) this.player.vx = 0;
    }

    // Move player horizontally
    this.player.x += this.player.vx;

    // Level horizontal boundaries
    if (this.player.x < 0) {
      this.player.x = 0;
      this.player.vx = 0;
    }
    if (this.player.x > this.currentLevel.width - this.player.width) {
      this.player.x = this.currentLevel.width - this.player.width;
      this.player.vx = 0;
    }

    // Horizontal Wall Collisions (prevent walking into the sides of ground blocks / walls)
    for (const plat of this.currentLevel.platforms) {
      if (plat.type === 'leaf_secret') continue;
      // Only platforms with substantial height act as solid side walls
      if (plat.height <= 24 && plat.type !== 'stone') continue;

      const px = this.player.x;
      const py = this.player.y;
      const pw = this.player.width;
      const ph = this.player.height;

      // Check if player horizontally overlaps and vertically overlaps deep in the body (leaving 8px top margin)
      if (
        px + pw > plat.x &&
        px < plat.x + plat.width &&
        py + ph > plat.y + 8 &&
        py < plat.y + plat.height - 4
      ) {
        if (this.player.vx > 0) {
          this.player.x = plat.x - pw;
          this.player.vx = 0;
        } else if (this.player.vx < 0) {
          this.player.x = plat.x + plat.width;
          this.player.vx = 0;
        }
      }
    }

    // 2. Vertical Movement & Gravity
    const gravity = 0.48;
    this.player.vy += gravity;
    if (this.player.vy > 11.5) this.player.vy = 11.5;

    // Coyote time & Jump buffering
    if (this.player.isGrounded) {
      this.player.coyoteTimer = 8;
    } else if (this.player.coyoteTimer > 0) {
      this.player.coyoteTimer--;
    }

    if (this.keys.jump) {
      this.player.jumpBufferTimer = 8;
    } else if (this.player.jumpBufferTimer > 0) {
      this.player.jumpBufferTimer--;
    }

    // Execute Jump (Higher, buoyant leap so player comfortably clears platforms)
    if (this.player.jumpBufferTimer > 0 && this.player.coyoteTimer > 0) {
      const jumpPower = this.player.activePower?.type === 'orange' ? -15.2 : -12.6;
      this.player.vy = jumpPower;
      this.player.isGrounded = false;
      this.standingPlatform = null;
      this.player.coyoteTimer = 0;
      this.player.jumpBufferTimer = 0;
      audio.playJump();
      this.addParticles(this.player.x + 14, this.player.y + 28, '#ffffff', 6);
    }

    // Variable jump height: release jump early for controlled hop
    if (!this.keys.jump && this.player.vy < -3.5) {
      this.player.vy *= 0.82;
    }

    // Move player vertically & track previous position for sweep collision
    const prevY = this.player.y;
    this.player.y += this.player.vy;
    this.player.isGrounded = false;
    this.standingPlatform = null;

    // Vertical Platform Collisions (AABB + Sweep detection)
    const px = this.player.x;
    const py = this.player.y;
    const pw = this.player.width;
    const ph = this.player.height;
    const prevBottom = prevY + ph;
    const currentBottom = py + ph;

    for (const plat of this.currentLevel.platforms) {
      if (plat.type === 'leaf_secret') continue; // Passable secret foliage

      // Horizontal overlap check with a forgiving 2px margin
      if (px + pw > plat.x + 2 && px < plat.x + plat.width - 2) {
        // Falling down or landing on platform
        if (this.player.vy >= 0) {
          const crossedTop = prevBottom <= plat.y + 8 && currentBottom >= plat.y;
          const insideTopEdge = currentBottom >= plat.y && currentBottom <= plat.y + Math.max(18, this.player.vy + 8);

          if (crossedTop || insideTopEdge) {
            this.player.y = plat.y - ph;
            this.player.vy = 0;
            this.player.isGrounded = true;
            this.standingPlatform = plat;

            // Spring mushroom bounce!
            if (plat.type === 'spring') {
              this.player.vy = -16.0;
              this.player.isGrounded = false;
              this.standingPlatform = null;
              audio.playJump();
              this.addParticles(plat.x + plat.width / 2, plat.y, '#ef4444', 12);
            }
            break; // Successfully landed on topmost platform
          }
        }
        // Head hitting bottom of solid ceiling (only for thick blocks, not thin planks)
        else if (this.player.vy < 0) {
          if (plat.height > 26 || plat.type === 'stone') {
            const platBottom = plat.y + plat.height;
            if (prevY >= platBottom - 8 && py <= platBottom) {
              this.player.y = platBottom;
              this.player.vy = 1;
            }
          }
        }
      }
    }

    // Surprise Box collisions
    for (const box of this.currentLevel.surpriseBoxes) {
      if (box.bumpOffsetY < 0) {
        box.bumpOffsetY += 1;
      }

      const bx = this.player.x;
      const by = this.player.y;
      const bw = this.player.width;
      const bh = this.player.height;

      if (bx + bw > box.x + 2 && bx < box.x + box.width - 2) {
        // Landing on top of box
        if (this.player.vy >= 0 && by + bh >= box.y && prevY + bh <= box.y + 10) {
          this.player.y = box.y - bh;
          this.player.vy = 0;
          this.player.isGrounded = true;
        }
        // Hitting box from below
        else if (this.player.vy < 0 && by <= box.y + box.height && prevY >= box.y + box.height - 12) {
          this.player.y = box.y + box.height;
          this.player.vy = 2; // Bounce back down
          this.openSurpriseBox(box);
        }
      }
    }

    // Absolute Ground Safeguard: Prevent any penetration into ground blocks
    for (const plat of this.currentLevel.platforms) {
      if (plat.type === 'leaf_secret') continue;
      if (plat.height >= 30) {
        if (
          this.player.x + this.player.width > plat.x + 2 &&
          this.player.x < plat.x + plat.width - 2 &&
          this.player.y + this.player.height > plat.y &&
          this.player.y < plat.y + plat.height
        ) {
          // If embedded inside a solid ground block, push right up to the ground surface
          if (this.player.y + this.player.height - plat.y < plat.height) {
            this.player.y = plat.y - this.player.height;
            this.player.vy = 0;
            this.player.isGrounded = true;
            this.standingPlatform = plat;
          }
        }
      }
    }

    // Pit fall check
    if (this.player.y > this.currentLevel.height) {
      this.respawnAtCheckpoint();
      return;
    }

    // Hazard collision (Spikes & Thorns)
    for (const h of this.currentLevel.hazards) {
      if (
        this.player.x + this.player.width > h.x &&
        this.player.x < h.x + h.width &&
        this.player.y + this.player.height > h.y &&
        this.player.y < h.y + h.height
      ) {
        if (h.type === 'pit') {
          this.respawnAtCheckpoint();
          return;
        } else {
          this.handlePlayerHurt();
        }
      }
    }

    // Collectibles pick up
    for (const col of this.currentLevel.collectibles) {
      if (!col.collected) {
        if (
          this.player.x + this.player.width > col.x &&
          this.player.x < col.x + col.width &&
          this.player.y + this.player.height > col.y &&
          this.player.y < col.y + col.height
        ) {
          col.collected = true;
          this.fruitsCollected++;
          this.score += 50;
          audio.playCoin();
          this.addParticles(col.x + 8, col.y + 8, '#facc15', 8);
          this.addFloatingText(col.x, col.y - 12, '+50', '#fef08a');
          this.callbacks.onScoreChange(this.score);
          this.callbacks.onFruitChange(this.fruitsCollected, this.totalFruits);
        }
      }
    }

    // Golden Fruit pick up
    const gf = this.currentLevel.goldenFruit;
    if (!gf.collected) {
      if (
        this.player.x + this.player.width > gf.x &&
        this.player.x < gf.x + gf.width &&
        this.player.y + this.player.height > gf.y &&
        this.player.y < gf.y + gf.height
      ) {
        gf.collected = true;
        this.goldenFruitFound = true;
        this.score += 500;
        audio.playGoldenFruit();
        this.addScreenShake(6);
        this.addParticles(gf.x + 12, gf.y + 12, '#fde047', 24);
        this.addFloatingText(gf.x - 20, gf.y - 20, 'GOLDEN FRUIT! +500', '#facc15');
        this.callbacks.onScoreChange(this.score);
        this.callbacks.onGoldenFruitChange(true);
      }
    }

    // Secret Area discovery check
    const secret = this.currentLevel.secretArea;
    if (!secret.discovered) {
      if (
        this.player.x + this.player.width > secret.x &&
        this.player.x < secret.x + secret.width &&
        this.player.y + this.player.height > secret.y &&
        this.player.y < secret.y + secret.height
      ) {
        secret.discovered = true;
        audio.playSecret();
        this.addScreenShake(5);
        this.addParticles(secret.x + secret.width / 2, secret.y + secret.height / 2, '#38bdf8', 20);
        this.addFloatingText(
          this.player.x - 40,
          this.player.y - 30,
          'SECRET AREA FOUND!',
          '#38bdf8'
        );
      }
    }

    // Checkpoint activation
    const cp = this.currentLevel.checkpoint;
    if (!cp.activated) {
      if (
        this.player.x + this.player.width > cp.x &&
        this.player.x < cp.x + cp.width &&
        this.player.y + this.player.height > cp.y &&
        this.player.y < cp.y + cp.height
      ) {
        cp.activated = true;
        audio.playLucky();
        this.addParticles(cp.x + cp.width / 2, cp.y + 10, '#facc15', 16);
        this.addFloatingText(cp.x - 20, cp.y - 15, 'CHECKPOINT!', '#facc15');
      }
    }

    // Finish Flag (Level 1 & 2)
    if (this.currentLevel.id < 3) {
      const fx = this.currentLevel.finishX;
      const fy = this.currentLevel.finishY;
      if (
        this.player.x + this.player.width > fx &&
        this.player.x < fx + 40 &&
        this.player.y + this.player.height > fy &&
        this.player.y < fy + 80
      ) {
        this.triggerLevelComplete();
      }
    }

    // 2. Enemy AI & Behaviors
    for (const enemy of this.currentLevel.enemies) {
      if (enemy.isDead) {
        enemy.deathTimer--;
        continue;
      }
      enemy.animFrame++;

      // Ground Worms (Green, Red, Blue, Purple, Stone)
      if (
        enemy.type === 'green_worm' ||
        enemy.type === 'red_worm' ||
        enemy.type === 'blue_worm' ||
        enemy.type === 'purple_worm' ||
        enemy.type === 'stone_worm'
      ) {
        // Purple worm predator chase logic
        if (enemy.type === 'purple_worm') {
          const dist = Math.abs(this.player.x - enemy.x);
          if (dist < 260) {
            enemy.facing = this.player.x > enemy.x ? 1 : -1;
            enemy.x += enemy.facing * (enemy.vx * 1.2);
          } else {
            enemy.x += enemy.vx * enemy.facing;
            if (Math.abs(enemy.x - enemy.startX) > enemy.patrolDistance) {
              enemy.facing = (enemy.facing * -1) as 1 | -1;
            }
          }
        }
        // Blue worm jumping ability
        else if (enemy.type === 'blue_worm') {
          enemy.jumpCooldown = (enemy.jumpCooldown || 90) - 1;
          if (enemy.jumpCooldown <= 0) {
            enemy.vy = -7.5;
            enemy.jumpCooldown = 100;
          }
          enemy.vy = (enemy.vy || 0) + 0.4;
          enemy.y += enemy.vy;
          if (enemy.y >= enemy.startY) {
            enemy.y = enemy.startY;
            enemy.vy = 0;
          }
          enemy.x += enemy.vx * enemy.facing;
          if (Math.abs(enemy.x - enemy.startX) > enemy.patrolDistance) {
            enemy.facing = (enemy.facing * -1) as 1 | -1;
          }
        }
        // Normal patrol
        else {
          enemy.x += enemy.vx * enemy.facing;
          if (Math.abs(enemy.x - enemy.startX) > enemy.patrolDistance) {
            enemy.facing = (enemy.facing * -1) as 1 | -1;
          }
        }
      }
      // Sky Worm (flies horizontally)
      else if (enemy.type === 'sky_worm') {
        enemy.x += enemy.vx * enemy.facing;
        enemy.y = enemy.startY + Math.sin(enemy.animFrame * 0.08) * 12;
        if (Math.abs(enemy.x - enemy.startX) > enemy.patrolDistance) {
          enemy.facing = (enemy.facing * -1) as 1 | -1;
        }
      }
      // Fruit Bat (flapping sine wave swoop)
      else if (enemy.type === 'fruit_bat') {
        enemy.x += enemy.vx * enemy.facing;
        enemy.y = enemy.startY + Math.sin(enemy.animFrame * 0.09) * 24;
        if (Math.abs(enemy.x - enemy.startX) > enemy.patrolDistance) {
          enemy.facing = (enemy.facing * -1) as 1 | -1;
        }
      }
      // Hanging Worm (dangles on thread, drops down on approach)
      else if (enemy.type === 'hanging_worm') {
        const distToPlayer = Math.abs(this.player.x - enemy.x);
        if (distToPlayer < 120 && enemy.diveState === 'hanging') {
          enemy.diveState = 'diving';
        }

        if (enemy.diveState === 'diving') {
          enemy.y += 3.5;
          if (enemy.y > (enemy.originalY || enemy.startY) + (enemy.hangLength || 80)) {
            enemy.diveState = 'returning';
          }
        } else if (enemy.diveState === 'returning') {
          enemy.y -= 1.8;
          if (enemy.y <= (enemy.originalY || enemy.startY)) {
            enemy.y = enemy.originalY || enemy.startY;
            enemy.diveState = 'hanging';
          }
        }
      }

      // Player vs Enemy Collision
      const px = this.player.x;
      const py = this.player.y;
      const pw = this.player.width;
      const ph = this.player.height;

      if (
        px + pw > enemy.x &&
        px < enemy.x + enemy.width &&
        py + ph > enemy.y &&
        py < enemy.y + enemy.height
      ) {
        // Player stomping from above!
        if (this.player.vy > 0 && py + ph - this.player.vy <= enemy.y + 14) {
          this.handleEnemyStomp(enemy);
        } else {
          // Player hit from side
          this.handlePlayerHurt();
        }
      }
    }

    // Clean up dead enemies after animation
    this.currentLevel.enemies = this.currentLevel.enemies.filter(
      (e) => !e.isDead || e.deathTimer > 0
    );

    // 3. Final Boss: GIGAWORM (Level 3)
    if (this.boss) {
      // Trigger boss when player enters arena (x >= 2200)
      if (!this.boss.active && this.player.x >= 2200) {
        this.boss.active = true;
        audio.playBGM('boss');
        audio.playBossSlam();
        this.addScreenShake(12);
        this.addFloatingText(this.boss.x, this.boss.y - 30, 'GIGAWORM AWAKENS!', '#ef4444');
      }

      if (this.boss.active && !this.boss.isDead) {
        this.callbacks.onBossStateChange({ ...this.boss });
        if (this.boss.flashTimer > 0) this.boss.flashTimer--;

        // Arena boundary containment
        const arenaLeft = 2220;
        const arenaRight = 3650;

        // Phase transitions
        if (this.boss.health <= 4 && this.boss.phase !== 3) {
          this.boss.phase = 3;
          this.addScreenShake(14);
          audio.playBossSlam();
          this.addFloatingText(this.boss.x, this.boss.y - 40, 'PHASE 3: ENRAGED!', '#ef4444');
        } else if (this.boss.health <= 8 && this.boss.phase === 1) {
          this.boss.phase = 2;
          this.addScreenShake(10);
          audio.playBossSlam();
          this.addFloatingText(this.boss.x, this.boss.y - 40, 'PHASE 2: FRENZY!', '#f59e0b');
        }

        // Stun recovery
        if (this.boss.isStunned) {
          this.boss.stunTimer--;
          if (this.boss.stunTimer <= 0) {
            this.boss.isStunned = false;
          }
        } else {
          // Boss AI Behavior
          this.boss.attackTimer++;

          const speed = (this.boss.phase === 3 ? 4.5 : this.boss.phase === 2 ? 3.2 : 2.2);

          // Horizontal slide & chase
          this.boss.x += this.boss.vx * (speed / 2.2);

          if (this.boss.x < arenaLeft) {
            this.boss.x = arenaLeft;
            this.boss.vx = Math.abs(this.boss.vx);
            this.boss.facing = 1;
            this.addScreenShake(4);
            audio.playBossSlam();
          } else if (this.boss.x > arenaRight - this.boss.width) {
            this.boss.x = arenaRight - this.boss.width;
            this.boss.vx = -Math.abs(this.boss.vx);
            this.boss.facing = -1;
            this.addScreenShake(4);
            audio.playBossSlam();
          }

          // Phase 2: Boss Leap & Minion Spawning
          if (this.boss.phase >= 2 && this.boss.attackTimer % 220 === 0) {
            this.boss.vy = -10;
            audio.playBossSlam();
            // Spawn a mini worm minion
            this.currentLevel.enemies.push({
              id: Math.random(),
              type: 'purple_worm',
              x: this.boss.x,
              y: this.boss.y,
              width: 28,
              height: 20,
              vx: 2.0,
              vy: 0,
              startX: this.boss.x - 100,
              startY: 470,
              patrolDistance: 200,
              facing: 1,
              isDead: false,
              deathTimer: 0,
              health: 1,
              maxHealth: 1,
              animFrame: 0,
              stateTimer: 0
            });
          }

          // Gravity on boss
          this.boss.vy += 0.4;
          this.boss.y += this.boss.vy;
          if (this.boss.y >= 440) {
            if (this.boss.vy > 4) {
              this.addScreenShake(8);
              audio.playBossSlam();
            }
            this.boss.y = 440;
            this.boss.vy = 0;
          }
        }

        // Boss Stomp Weak Point Detection
        const px = this.player.x;
        const py = this.player.y;
        const pw = this.player.width;
        const ph = this.player.height;

        // Head bounds
        const headX = this.boss.facing === 1 ? this.boss.x + this.boss.width * 0.7 : this.boss.x;
        const headW = this.boss.width * 0.35;

        if (
          px + pw > this.boss.x &&
          px < this.boss.x + this.boss.width &&
          py + ph > this.boss.y &&
          py < this.boss.y + this.boss.height
        ) {
          // Stomping head from above!
          if (this.player.vy > 0 && py + ph - this.player.vy <= this.boss.y + 24) {
            this.player.vy = -11; // High bounce
            this.boss.health--;
            this.boss.flashTimer = 20;
            this.boss.isStunned = true;
            this.boss.stunTimer = 60; // 1s stun
            audio.playBossHurt();
            this.addScreenShake(10);
            this.addParticles(headX + headW / 2, this.boss.y, '#ef4444', 18);
            this.addFloatingText(headX, this.boss.y - 20, 'CRITICAL HIT! -1', '#facc15');

            if (this.boss.health <= 0) {
              this.boss.isDead = true;
              this.boss.deathTimer = 120;
              this.addScreenShake(20);
              this.addParticles(this.boss.x + this.boss.width / 2, this.boss.y + 20, '#facc15', 50);
              this.addFloatingText(this.boss.x, this.boss.y - 40, 'GIGAWORM DEFEATED!', '#facc15');
              setTimeout(() => {
                this.triggerVictory();
              }, 2200);
            }
          } else {
            // Player hit by boss body
            this.handlePlayerHurt();
          }
        }
      }
    }

    // 4. Update Particles & Floating texts
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gentle particle gravity
      p.life--;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    for (const ft of this.floatingTexts) {
      ft.y -= 0.8;
      ft.life--;
    }
    this.floatingTexts = this.floatingTexts.filter((ft) => ft.life > 0);

    // 5. Camera Tracking with Smooth Lerp
    const targetCamX = this.player.x - 300;
    this.camera.x += (targetCamX - this.camera.x) * 0.12;
    if (this.camera.x < 0) this.camera.x = 0;
    if (this.camera.x > this.currentLevel.width - 800) {
      this.camera.x = this.currentLevel.width - 800;
    }

    // Player state determination
    if (this.player.invulnerableTimer > 70) {
      this.player.state = 'hurt';
    } else if (!this.player.isGrounded) {
      this.player.state = this.player.vy < 0 ? 'jump' : 'fall';
    } else if (Math.abs(this.player.vx) > 0.2) {
      this.player.state = 'run';
    } else {
      this.player.state = 'idle';
    }
  }

  // Render Frame to Canvas
  public render() {
    const ctx = this.ctx;
    const width = 800;
    const height = 600;

    // Apply Screen Shake
    ctx.save();
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(sx, sy);
    }

    // 1. Parallax Sky & Background according to timeOfDay
    const time = this.currentLevel.timeOfDay;
    let skyGradient = ctx.createLinearGradient(0, 0, 0, height);

    if (time === 'morning') {
      skyGradient.addColorStop(0, '#38bdf8'); // Sky blue
      skyGradient.addColorStop(0.7, '#bae6fd');
      skyGradient.addColorStop(1, '#fef08a'); // Warm morning horizon
    } else if (time === 'sunset') {
      skyGradient.addColorStop(0, '#c026d3'); // Fuchsia twilight
      skyGradient.addColorStop(0.5, '#f97316'); // Golden amber
      skyGradient.addColorStop(1, '#fef08a');
    } else {
      // Night
      skyGradient.addColorStop(0, '#0f172a'); // Deep midnight navy
      skyGradient.addColorStop(0.6, '#1e1b4b'); // Mystic indigo
      skyGradient.addColorStop(1, '#312e81');
    }

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Celestial body (Sun or Moon)
    if (time === 'morning' || time === 'sunset') {
      const sunY = time === 'morning' ? 90 : 200;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(680, sunY, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
      ctx.beginPath();
      ctx.arc(680, sunY, 48, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Crescent Moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(660, 90, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a'; // Moon cutout
      ctx.beginPath();
      ctx.arc(672, 86, 22, 0, Math.PI * 2);
      ctx.fill();

      // Twinkling stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 40; i++) {
        const starX = (i * 37 + 23) % 800;
        const starY = (i * 29 + 17) % 250;
        if ((this.frameCount + i * 5) % 40 < 30) {
          ctx.fillRect(starX, starY, 2, 2);
        }
      }
    }

    // Drifting Fluffy Clouds (Parallax Layer 1)
    ctx.fillStyle = time === 'night' ? 'rgba(75, 85, 99, 0.4)' : 'rgba(255, 255, 255, 0.85)';
    for (const c of this.clouds) {
      const cx = (c.x - this.camera.x * 0.15) % 1200;
      ctx.beginPath();
      ctx.arc(cx, c.y, 22 * c.scale, 0, Math.PI * 2);
      ctx.arc(cx + 20 * c.scale, c.y - 8 * c.scale, 28 * c.scale, 0, Math.PI * 2);
      ctx.arc(cx + 45 * c.scale, c.y, 22 * c.scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant Garden Hills & Orchard Silhouettes (Parallax Layer 2)
    const hillColor = time === 'morning' ? '#86efac' : time === 'sunset' ? '#84cc16' : '#065f46';
    ctx.fillStyle = hillColor;
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 40) {
      const hx = x + this.camera.x * 0.3;
      const hy = 380 + Math.sin(hx * 0.005) * 45;
      ctx.lineTo(x, hy);
    }
    ctx.lineTo(width, height);
    ctx.fill();

    // 2. World Space Layer (Offset by Camera)
    ctx.save();
    ctx.translate(-this.camera.x, 0);

    // Draw Platforms
    for (const plat of this.currentLevel.platforms) {
      SpriteRenderer.drawPlatform(ctx, plat, this.currentLevel.timeOfDay, this.frameCount);
    }

    // Draw Hazards
    for (const hazard of this.currentLevel.hazards) {
      SpriteRenderer.drawHazard(ctx, hazard, this.frameCount);
    }

    // Draw Checkpoint & Finish Flag
    SpriteRenderer.drawCheckpoint(ctx, this.currentLevel.checkpoint, this.frameCount);
    if (this.currentLevel.id < 3) {
      SpriteRenderer.drawFinishFlag(
        ctx,
        {
          x: this.currentLevel.finishX,
          y: this.currentLevel.finishY,
          width: 32,
          height: 80
        },
        this.frameCount
      );
    }

    // Draw Gardener NPC
    const isNearNpc = Math.abs(this.player.x - this.currentLevel.npc.x) < 100;
    SpriteRenderer.drawGardenerNPC(ctx, this.currentLevel.npc, this.frameCount, isNearNpc);

    // Draw Surprise Boxes
    for (const box of this.currentLevel.surpriseBoxes) {
      SpriteRenderer.drawSurpriseBox(ctx, box, this.frameCount);
    }

    // Draw Collectibles
    for (const col of this.currentLevel.collectibles) {
      if (!col.collected) {
        SpriteRenderer.drawCollectible(ctx, col, this.frameCount);
      }
    }

    // Draw Golden Fruit
    if (!this.currentLevel.goldenFruit.collected) {
      SpriteRenderer.drawGoldenFruit(ctx, this.currentLevel.goldenFruit, this.frameCount);
    }

    // Draw Enemies
    for (const enemy of this.currentLevel.enemies) {
      if (
        enemy.type === 'sky_worm' ||
        enemy.type === 'fruit_bat' ||
        enemy.type === 'hanging_worm'
      ) {
        SpriteRenderer.drawAirEnemy(ctx, enemy, this.frameCount);
      } else {
        SpriteRenderer.drawGroundWorm(
          ctx,
          enemy.x,
          enemy.y,
          enemy.width,
          enemy.height,
          enemy.type as 'green_worm' | 'red_worm' | 'blue_worm' | 'purple_worm' | 'stone_worm',
          enemy.facing,
          this.frameCount,
          enemy.isDead
        );
      }
    }

    // Draw Gigaworm Boss
    if (this.boss && this.boss.active && !this.boss.isDead) {
      SpriteRenderer.drawGigaworm(ctx, this.boss, this.frameCount);
    }

    // Draw Player ("Appley")
    SpriteRenderer.drawPlayer(
      ctx,
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height,
      this.player.state,
      this.player.facing,
      this.frameCount,
      this.player.invulnerableTimer > 0,
      this.player.hasGrapeShield,
      this.player.activePower?.type || null
    );

    // Draw Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    // Draw Floating Score & Combo Texts
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.fillStyle = ft.color;
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore(); // Restore Camera transform

    // 3. Screen Space Overlays (Rain & Weather)
    if (this.currentLevel.weather === 'rainy') {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
      ctx.lineWidth = 1.5;
      for (const r of this.rainDrops) {
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + 2, r.y + r.length);
        ctx.stroke();
      }
    }

    ctx.restore(); // Restore Screen Shake
  }

  // Start Main Loop
  public start() {
    const loop = () => {
      this.update();
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  // Stop Main Loop
  public stop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }
}
