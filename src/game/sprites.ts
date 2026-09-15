// Procedural 16-bit Retro Pixel Art Sprite & Tile Drawing System
// Renders directly to Canvas Context with crisp pixel aesthetics

export class SpriteRenderer {
  // Draw pixel grid helper: draws an array of rows of pixel strings
  public static drawPixelGrid(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    pixelSize: number,
    grid: string[],
    colorMap: Record<string, string>
  ) {
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        if (char !== ' ' && char !== '.' && colorMap[char]) {
          ctx.fillStyle = colorMap[char];
          ctx.fillRect(
            Math.round(x + c * pixelSize),
            Math.round(y + r * pixelSize),
            pixelSize,
            pixelSize
          );
        }
      }
    }
  }

  // Apple Hero ("Appley")
  public static drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    state: 'idle' | 'run' | 'jump' | 'fall' | 'hurt' | 'victory',
    facing: 1 | -1,
    frame: number,
    isInvulnerable: boolean,
    hasShield: boolean,
    powerType: string | null
  ) {
    if (isInvulnerable && Math.floor(frame / 3) % 2 === 0) {
      // Flashing invulnerability frames
      ctx.globalAlpha = 0.4;
    }

    ctx.save();
    // Center-based flip for facing direction
    const cx = x + width / 2;
    const cy = y + height / 2;
    ctx.translate(cx, cy);
    ctx.scale(facing, 1);

    const px = 2; // 2px per pixel art unit for crisp 16-bit detail
    const startX = -width / 2;
    const startY = -height / 2;

    // Power-up aura / glow underneath
    if (powerType === 'strawberry') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.7, 0, Math.PI * 2);
      ctx.fill();
    } else if (powerType === 'orange') {
      ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.75, 0, Math.PI * 2);
      ctx.fill();
    } else if (powerType === 'watermelon') {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.75, 0, Math.PI * 2);
      ctx.fill();
    }

    // Animation bobbing
    let bobY = 0;
    let legOffset = 0;
    if (state === 'idle') {
      bobY = Math.sin(frame * 0.1) * 1.5;
    } else if (state === 'run') {
      bobY = Math.abs(Math.sin(frame * 0.3)) * -2;
      legOffset = Math.sin(frame * 0.3) * 3;
    } else if (state === 'jump') {
      bobY = -3;
    } else if (state === 'fall') {
      bobY = 1;
    } else if (state === 'victory') {
      bobY = Math.abs(Math.sin(frame * 0.25)) * -6;
    }

    // Leaf and stem (Top)
    // Stem
    ctx.fillStyle = '#78350f'; // Dark wood
    ctx.fillRect(startX + 14 * px, startY + (1 + bobY) * px, 3 * px, 5 * px);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(startX + 15 * px, startY + (0 + bobY) * px, 2 * px, 2 * px);

    // Green Leaf
    const leafTilt = state === 'run' ? -1 : (state === 'jump' ? -2 : 0);
    ctx.fillStyle = '#15803d'; // Leaf green
    ctx.fillRect(startX + (17 + leafTilt) * px, startY + (1 + bobY) * px, 5 * px, 3 * px);
    ctx.fillStyle = '#22c55e'; // Bright leaf green
    ctx.fillRect(startX + (18 + leafTilt) * px, startY + (2 + bobY) * px, 3 * px, 1 * px);

    // Apple Body (16-bit rounded apple shape)
    // Dark outline
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(startX + 6 * px, startY + (4 + bobY) * px, 19 * px, 19 * px);
    // Indent at top and bottom
    ctx.clearRect(startX + 14 * px, startY + (4 + bobY) * px, 3 * px, 2 * px);

    // Main Red
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(startX + 7 * px, startY + (5 + bobY) * px, 17 * px, 17 * px);

    // Highlight top-left (specular 16-bit shine)
    ctx.fillStyle = '#f87171';
    ctx.fillRect(startX + 8 * px, startY + (6 + bobY) * px, 4 * px, 4 * px);
    ctx.fillStyle = '#fecaca'; // Pure bright gleam
    ctx.fillRect(startX + 9 * px, startY + (7 + bobY) * px, 2 * px, 2 * px);

    // Shadow bottom-right
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(startX + 16 * px, startY + (18 + bobY) * px, 7 * px, 3 * px);
    ctx.fillRect(startX + 19 * px, startY + (14 + bobY) * px, 4 * px, 5 * px);

    // Eyes and Facial Expressions
    if (state === 'hurt') {
      // Dizzy 'X' eyes
      ctx.fillStyle = '#1c1917';
      // Left eye X
      ctx.fillRect(startX + 13 * px, startY + (10 + bobY) * px, 1 * px, 3 * px);
      ctx.fillRect(startX + 12 * px, startY + (11 + bobY) * px, 3 * px, 1 * px);
      // Right eye X
      ctx.fillRect(startX + 19 * px, startY + (10 + bobY) * px, 1 * px, 3 * px);
      ctx.fillRect(startX + 18 * px, startY + (11 + bobY) * px, 3 * px, 1 * px);
      // Wavy open mouth
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(startX + 15 * px, startY + (15 + bobY) * px, 3 * px, 2 * px);
    } else {
      // Big expressive cute eyes
      const blink = frame % 120 > 115;
      if (blink) {
        // Blinking line
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(startX + 13 * px, startY + (11 + bobY) * px, 3 * px, 1 * px);
        ctx.fillRect(startX + 19 * px, startY + (11 + bobY) * px, 3 * px, 1 * px);
      } else {
        // Eye whites
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX + 12 * px, startY + (9 + bobY) * px, 4 * px, 5 * px);
        ctx.fillRect(startX + 18 * px, startY + (9 + bobY) * px, 4 * px, 5 * px);
        // Pupils looking forward
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(startX + 14 * px, startY + (10 + bobY) * px, 2 * px, 3 * px);
        ctx.fillRect(startX + 20 * px, startY + (10 + bobY) * px, 2 * px, 3 * px);
        // Eye shine
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX + 14 * px, startY + (10 + bobY) * px, 1 * px, 1 * px);
        ctx.fillRect(startX + 20 * px, startY + (10 + bobY) * px, 1 * px, 1 * px);
      }

      // Rosy Pink Cheeks
      ctx.fillStyle = 'rgba(251, 113, 133, 0.7)';
      ctx.fillRect(startX + 10 * px, startY + (13 + bobY) * px, 2 * px, 2 * px);
      ctx.fillRect(startX + 21 * px, startY + (13 + bobY) * px, 2 * px, 2 * px);

      // Cute Smile
      ctx.fillStyle = '#450a0a';
      if (state === 'victory') {
        // Big open happy smile
        ctx.fillRect(startX + 15 * px, startY + (14 + bobY) * px, 4 * px, 3 * px);
        ctx.fillStyle = '#fb7185';
        ctx.fillRect(startX + 16 * px, startY + (15 + bobY) * px, 2 * px, 1 * px);
      } else {
        ctx.fillRect(startX + 15 * px, startY + (15 + bobY) * px, 3 * px, 1 * px);
        ctx.fillRect(startX + 17 * px, startY + (14 + bobY) * px, 1 * px, 1 * px);
      }
    }

    // Hands (Cute white cartoon gloves)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    if (state === 'victory') {
      // Hands raised in celebration
      ctx.fillRect(startX + 5 * px, startY + (4 + bobY) * px, 4 * px, 4 * px);
      ctx.fillRect(startX + 22 * px, startY + (4 + bobY) * px, 4 * px, 4 * px);
    } else if (state === 'jump') {
      ctx.fillRect(startX + 4 * px, startY + (10 + bobY) * px, 3 * px, 3 * px);
      ctx.fillRect(startX + 23 * px, startY + (10 + bobY) * px, 3 * px, 3 * px);
    } else {
      // Walking or idle hands
      const armSwing = state === 'run' ? -legOffset * 0.8 : 0;
      ctx.fillRect(startX + (5 - armSwing) * px, startY + (13 + bobY) * px, 3 * px, 3 * px);
      ctx.fillRect(startX + (23 + armSwing) * px, startY + (13 + bobY) * px, 3 * px, 3 * px);
    }

    // Feet / Little Brown Boots
    ctx.fillStyle = '#78350f';
    if (state === 'jump' || state === 'fall') {
      // Tucked feet
      ctx.fillRect(startX + 9 * px, startY + 22 * px, 4 * px, 3 * px);
      ctx.fillRect(startX + 17 * px, startY + 22 * px, 4 * px, 3 * px);
    } else {
      // Walking legs
      ctx.fillRect(startX + (9 - legOffset) * px, startY + 23 * px, 4 * px, 3 * px);
      ctx.fillRect(startX + (17 + legOffset) * px, startY + 23 * px, 4 * px, 3 * px);
      // Boot soles
      ctx.fillStyle = '#451a03';
      ctx.fillRect(startX + (8 - legOffset) * px, startY + 25 * px, 5 * px, 1 * px);
      ctx.fillRect(startX + (16 + legOffset) * px, startY + 25 * px, 5 * px, 1 * px);
    }

    // Grape Shield Bubble (if active)
    if (hasShield) {
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.65, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Mini grape sphere sparkles
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(-width * 0.4, -height * 0.3, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.globalAlpha = 1.0;
  }

  // Worm Enemies (Ground)
  public static drawGroundWorm(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    type: 'green_worm' | 'red_worm' | 'blue_worm' | 'purple_worm' | 'stone_worm',
    facing: 1 | -1,
    frame: number,
    isDead: boolean
  ) {
    ctx.save();
    const cx = x + width / 2;
    const cy = y + height / 2;
    ctx.translate(cx, cy);
    ctx.scale(facing, 1);

    const px = 2;
    const startX = -width / 2;
    const startY = -height / 2;

    if (isDead) {
      // Flattened squash frame
      ctx.fillStyle = type === 'stone_worm' ? '#78716c' : '#84cc16';
      ctx.fillRect(startX, startY + height - 8, width, 6);
      ctx.restore();
      return;
    }

    // Crawling accordion squish animation
    const squish = Math.sin(frame * 0.25);
    const bodyW = width + squish * 4;
    const bodyH = height - Math.abs(squish) * 2;

    // Palette per worm type
    let mainColor = '#22c55e';
    let stripeColor = '#15803d';
    let highlightColor = '#86efac';
    let eyeColor = '#000000';

    if (type === 'red_worm') {
      mainColor = '#ef4444';
      stripeColor = '#b91c1c';
      highlightColor = '#fca5a5';
    } else if (type === 'blue_worm') {
      mainColor = '#3b82f6';
      stripeColor = '#1d4ed8';
      highlightColor = '#93c5fd';
    } else if (type === 'purple_worm') {
      mainColor = '#a855f7';
      stripeColor = '#7e22ce';
      highlightColor = '#e9d5ff';
      eyeColor = '#facc15'; // Glowing yellow predator eyes
    } else if (type === 'stone_worm') {
      mainColor = '#78716c';
      stripeColor = '#44403c';
      highlightColor = '#d6d3d1';
    }

    // Worm segments (3 undulating circles/blocks)
    // Segment 1: Tail
    ctx.fillStyle = stripeColor;
    ctx.fillRect(startX + 2 * px, startY + 6 * px, 6 * px, (bodyH / px - 6) * px);
    ctx.fillStyle = mainColor;
    ctx.fillRect(startX + 3 * px, startY + 7 * px, 4 * px, (bodyH / px - 8) * px);

    // Segment 2: Midsection
    const midY = startY + (4 - squish * 2) * px;
    ctx.fillStyle = stripeColor;
    ctx.fillRect(startX + 7 * px, midY, 7 * px, (bodyH / px - 4) * px);
    ctx.fillStyle = mainColor;
    ctx.fillRect(startX + 8 * px, midY + 1 * px, 5 * px, (bodyH / px - 6) * px);
    ctx.fillStyle = highlightColor;
    ctx.fillRect(startX + 9 * px, midY + 2 * px, 2 * px, 2 * px);

    // Segment 3: Head (Facing forward)
    const headX = startX + 13 * px;
    const headY = startY + (3 + squish * 1) * px;
    ctx.fillStyle = stripeColor;
    ctx.fillRect(headX, headY, 8 * px, (bodyH / px - 3) * px);
    ctx.fillStyle = mainColor;
    ctx.fillRect(headX + 1 * px, headY + 1 * px, 6 * px, (bodyH / px - 5) * px);

    // Stone Worm Armor Plates
    if (type === 'stone_worm') {
      ctx.fillStyle = '#a8a29e';
      ctx.fillRect(headX + 1 * px, headY - 2 * px, 6 * px, 3 * px);
      ctx.fillRect(startX + 7 * px, midY - 2 * px, 6 * px, 3 * px);
    }

    // Antennae on head
    ctx.fillStyle = stripeColor;
    ctx.fillRect(headX + 5 * px, headY - 4 * px, 1 * px, 4 * px);
    ctx.fillStyle = highlightColor;
    ctx.fillRect(headX + 4 * px, headY - 5 * px, 3 * px, 2 * px);

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(headX + 4 * px, headY + 3 * px, 3 * px, 3 * px);
    ctx.fillStyle = eyeColor;
    ctx.fillRect(headX + 5 * px, headY + 4 * px, 2 * px, 2 * px);

    ctx.restore();
  }

  // Aerial Enemies (Sky Worm, Fruit Bat, Hanging Worm)
  public static drawAirEnemy(
    ctx: CanvasRenderingContext2D,
    enemy: {
      type: string;
      x: number;
      y: number;
      width: number;
      height: number;
      facing: 1 | -1;
      hangLength?: number;
    },
    frame: number
  ) {
    const px = 2;
    const { x, y, width, height, facing, type } = enemy;

    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.scale(facing, 1);

    const startX = -width / 2;
    const startY = -height / 2;

    if (type === 'sky_worm') {
      // Cute winged caterpillar
      const wingFlap = Math.sin(frame * 0.4);
      // Wings
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(startX + 6 * px, startY - (4 + wingFlap * 4) * px, 6 * px, 4 * px);
      ctx.fillRect(startX + 4 * px, startY - (2 + wingFlap * 4) * px, 4 * px, 3 * px);

      // Body
      ctx.fillStyle = '#84cc16'; // Lime green
      ctx.fillRect(startX + 2 * px, startY + 4 * px, 12 * px, 8 * px);
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(startX + 5 * px, startY + 4 * px, 2 * px, 8 * px);
      ctx.fillRect(startX + 9 * px, startY + 4 * px, 2 * px, 8 * px);

      // Cute Eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(startX + 10 * px, startY + 5 * px, 3 * px, 3 * px);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(startX + 12 * px, startY + 6 * px, 1 * px, 2 * px);
    } else if (type === 'fruit_bat') {
      // Original cute Fruit Bat with plum-colored wings and fruit belly
      const wingSpread = Math.sin(frame * 0.3) * 6;
      // Bat Wings
      ctx.fillStyle = '#581c87';
      // Left Wing
      ctx.beginPath();
      ctx.moveTo(startX + 2 * px, startY + 6 * px);
      ctx.lineTo(startX - (4 + wingSpread), startY - 2 * px);
      ctx.lineTo(startX + 6 * px, startY + 8 * px);
      ctx.fill();

      // Right Wing
      ctx.beginPath();
      ctx.moveTo(startX + 14 * px, startY + 6 * px);
      ctx.lineTo(startX + width + (4 + wingSpread), startY - 2 * px);
      ctx.lineTo(startX + 10 * px, startY + 8 * px);
      ctx.fill();

      // Bat Body
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(startX + 4 * px, startY + 2 * px, 8 * px, 10 * px);
      // Fruit peach belly
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(startX + 6 * px, startY + 6 * px, 4 * px, 5 * px);

      // Big yellow bat eyes
      ctx.fillStyle = '#fde047';
      ctx.fillRect(startX + 5 * px, startY + 3 * px, 2 * px, 2 * px);
      ctx.fillRect(startX + 9 * px, startY + 3 * px, 2 * px, 2 * px);
      // Little pointy ears
      ctx.fillStyle = '#581c87';
      ctx.fillRect(startX + 4 * px, startY, 2 * px, 2 * px);
      ctx.fillRect(startX + 10 * px, startY, 2 * px, 2 * px);
    } else if (type === 'hanging_worm') {
      // Hanging thread from ceiling
      const hangLen = enemy.hangLength || 60;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -hangLen);
      ctx.lineTo(0, 0);
      ctx.stroke();

      // Dangling worm body
      ctx.fillStyle = '#10b981'; // Emerald worm
      ctx.fillRect(startX + 3 * px, startY + 2 * px, 8 * px, 11 * px);
      ctx.fillStyle = '#059669';
      ctx.fillRect(startX + 4 * px, startY + 4 * px, 6 * px, 2 * px);
      ctx.fillRect(startX + 4 * px, startY + 8 * px, 6 * px, 2 * px);

      // Eyes upside down / curious
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(startX + 4 * px, startY + 9 * px, 2 * px, 2 * px);
      ctx.fillRect(startX + 8 * px, startY + 9 * px, 2 * px, 2 * px);
      ctx.fillStyle = '#000000';
      ctx.fillRect(startX + 5 * px, startY + 10 * px, 1 * px, 1 * px);
      ctx.fillRect(startX + 9 * px, startY + 10 * px, 1 * px, 1 * px);
    }

    ctx.restore();
  }

  // Final Boss: GIGAWORM
  public static drawGigaworm(
    ctx: CanvasRenderingContext2D,
    boss: {
      x: number;
      y: number;
      width: number;
      height: number;
      facing: 1 | -1;
      phase: 1 | 2 | 3;
      health: number;
      maxHealth: number;
      isStunned: boolean;
      flashTimer: number;
    },
    frame: number
  ) {
    const { x, y, width, height, facing, phase, isStunned, flashTimer } = boss;

    if (flashTimer > 0 && Math.floor(frame / 2) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.scale(facing, 1);

    const startX = -width / 2;
    const startY = -height / 2;

    // Undulating segments (4 massive body segments + 1 huge head)
    const segmentCount = 4;
    const segWidth = width / (segmentCount + 1);

    // Color by phase
    let bodyColor = '#15803d'; // Deep green
    let spineColor = '#84cc16'; // Lime spines
    let headArmor = '#14532d';

    if (phase === 2) {
      bodyColor = '#b45309'; // Amber/rage
      spineColor = '#f59e0b';
      headArmor = '#78350f';
    } else if (phase === 3) {
      bodyColor = '#991b1b'; // Crimson fury
      spineColor = '#ef4444';
      headArmor = '#7f1d1d';
    }

    // Draw tail-to-neck segments
    for (let i = 0; i < segmentCount; i++) {
      const segX = startX + i * segWidth;
      const wave = Math.sin((frame * 0.15) + (i * 0.8)) * (8 + phase * 3);
      const segY = startY + 15 + wave;
      const h = height - 25;

      // Segment body
      ctx.fillStyle = bodyColor;
      ctx.fillRect(segX, segY, segWidth + 4, h);

      // Armor Spikes on top
      ctx.fillStyle = spineColor;
      ctx.beginPath();
      ctx.moveTo(segX + segWidth / 2, segY - 10);
      ctx.lineTo(segX + 4, segY);
      ctx.lineTo(segX + segWidth, segY);
      ctx.fill();

      // Segment stripe
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(segX + segWidth - 3, segY, 3, h);
    }

    // Giant Head segment (Front)
    const headWave = Math.sin(frame * 0.15 + segmentCount * 0.8) * 8;
    const headX = startX + segmentCount * segWidth;
    const headY = startY + headWave;
    const headW = segWidth * 1.5;
    const headH = height;

    // Head base
    ctx.fillStyle = headArmor;
    ctx.fillRect(headX, headY + 5, headW, headH - 10);

    // Crown / Boss Horns
    ctx.fillStyle = spineColor;
    ctx.beginPath();
    ctx.moveTo(headX + 10, headY - 14);
    ctx.lineTo(headX + 5, headY + 5);
    ctx.lineTo(headX + 25, headY + 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(headX + headW - 8, headY - 18);
    ctx.lineTo(headX + headW - 22, headY + 5);
    ctx.lineTo(headX + headW, headY + 5);
    ctx.fill();

    // Mandibles / Jaws
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(headX + headW - 2, headY + headH - 24, 12, 6);
    ctx.fillRect(headX + headW - 2, headY + headH - 14, 10, 6);

    // Boss Eyes (Menacing Glowing Eyes)
    if (isStunned) {
      // Swirling dizzy eyes when stunned (vulnerable!)
      ctx.fillStyle = '#fde047';
      ctx.fillRect(headX + 15, headY + 20, 10, 10);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(headX + 18, headY + 23, 4, 4);
      // Weak spot indicator: Glowing red weak crown
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.fillRect(headX + 10, headY - 6, 20, 8);
    } else {
      ctx.fillStyle = phase === 3 ? '#ef4444' : '#facc15';
      ctx.fillRect(headX + 14, headY + 16, 14, 10);
      ctx.fillStyle = '#000000';
      ctx.fillRect(headX + 22, headY + 18, 4, 6);

      // Eye glint
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(headX + 16, headY + 18, 2, 2);
    }

    ctx.restore();
    ctx.globalAlpha = 1.0;
  }

  // Surprise Box ("?")
  public static drawSurpriseBox(
    ctx: CanvasRenderingContext2D,
    box: { x: number; y: number; width: number; height: number; opened: boolean; bumpOffsetY: number; sparkleTimer: number },
    frame: number
  ) {
    const { x, width, height, opened, bumpOffsetY } = box;
    const y = box.y + bumpOffsetY;

    const px = 2;
    if (opened) {
      // Empty metallic / stone block after being opened
      ctx.fillStyle = '#78716c';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#57534e';
      ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
      // Rivets
      ctx.fillStyle = '#292524';
      ctx.fillRect(x + 2, y + 2, 2, 2);
      ctx.fillRect(x + width - 4, y + 2, 2, 2);
      ctx.fillRect(x + 2, y + height - 4, 2, 2);
      ctx.fillRect(x + width - 4, y + height - 4, 2, 2);
      return;
    }

    // Vivid Golden Question Box
    const vibrate = Math.sin(frame * 0.2) * 0.8;
    const drawY = y + vibrate;

    // Outline
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x, drawY, width, height);

    // Warm Gold Face
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 2, drawY + 2, width - 4, height - 4);

    // Corner highlights
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(x + 3, drawY + 3, 3, 3);
    ctx.fillRect(x + width - 6, drawY + 3, 3, 3);

    // Embossed "?" mark in pixel font
    ctx.fillStyle = '#451a03'; // Shadow
    ctx.fillRect(x + width / 2 - 3, drawY + 7, 8, 3);
    ctx.fillRect(x + width / 2 + 3, drawY + 9, 3, 5);
    ctx.fillRect(x + width / 2 - 1, drawY + 13, 4, 4);
    ctx.fillRect(x + width / 2 - 1, drawY + 19, 4, 4);

    ctx.fillStyle = '#ffffff'; // White "?"
    ctx.fillRect(x + width / 2 - 4, drawY + 6, 8, 3);
    ctx.fillRect(x + width / 2 + 2, drawY + 8, 3, 5);
    ctx.fillRect(x + width / 2 - 2, drawY + 12, 4, 4);
    ctx.fillRect(x + width / 2 - 2, drawY + 18, 4, 4);

    // Sparkle star on corners
    if (frame % 30 < 15) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + width - 4, drawY - 2, 3, 3);
      ctx.fillRect(x - 2, drawY + height - 4, 3, 3);
    }
  }

  // Golden Fruit (1 per level)
  public static drawGoldenFruit(
    ctx: CanvasRenderingContext2D,
    fruit: { x: number; y: number; width: number; height: number },
    frame: number
  ) {
    const { x, width, height } = fruit;
    const floatY = fruit.y + Math.sin(frame * 0.1) * 3;

    // Divine golden sparkle aura
    ctx.fillStyle = 'rgba(250, 204, 21, 0.3)';
    ctx.beginPath();
    ctx.arc(x + width / 2, floatY + height / 2, width * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Stem & Golden Leaf
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + width / 2 - 1, floatY - 4, 3, 5);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x + width / 2 + 2, floatY - 5, 6, 3);

    // Golden Apple body
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x + 2, floatY, width - 4, height);

    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + 3, floatY + 1, width - 6, height - 2);

    // Bright shiny specular gold
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 5, floatY + 3, 5, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6, floatY + 4, 3, 3);

    // Orbiting sparkle stars
    for (let i = 0; i < 3; i++) {
      const angle = (frame * 0.05) + (i * ((Math.PI * 2) / 3));
      const sx = x + width / 2 + Math.cos(angle) * (width * 0.7);
      const sy = floatY + height / 2 + Math.sin(angle) * (height * 0.7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx - 1, sy - 1, 3, 3);
    }
  }

  // Collectible items (Fruit Coin, Cherry, Seed)
  public static drawCollectible(
    ctx: CanvasRenderingContext2D,
    col: { x: number; y: number; width: number; height: number; type: string; animOffset: number },
    frame: number
  ) {
    const floatY = col.y + Math.sin((frame + col.animOffset) * 0.12) * 2.5;
    const { x, width, height, type } = col;

    if (type === 'fruit_coin') {
      // Rotating coin simulation (width scales with sine)
      const scaleX = Math.abs(Math.cos((frame + col.animOffset) * 0.1));
      const curW = Math.max(3, width * scaleX);
      const curX = x + (width - curW) / 2;

      ctx.fillStyle = '#eab308';
      ctx.fillRect(curX, floatY, curW, height);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(curX + 1, floatY + 1, Math.max(1, curW - 2), height - 2);
    } else if (type === 'cherry') {
      // Two cute cherries
      ctx.fillStyle = '#15803d'; // Green stem
      ctx.fillRect(x + 4, floatY, 8, 2);
      ctx.fillRect(x + 4, floatY + 2, 2, 6);
      ctx.fillRect(x + 10, floatY + 2, 2, 6);

      // Left cherry
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x + 1, floatY + 7, 7, 7);
      ctx.fillStyle = '#fecaca';
      ctx.fillRect(x + 2, floatY + 8, 2, 2);

      // Right cherry
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x + 8, floatY + 7, 7, 7);
      ctx.fillStyle = '#fecaca';
      ctx.fillRect(x + 9, floatY + 8, 2, 2);
    } else if (type === 'seed') {
      // Garden seed with sprout
      ctx.fillStyle = '#22c55e'; // Green sprout
      ctx.fillRect(x + 6, floatY, 4, 3);

      // Brown acorn / seed
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 3, floatY + 3, width - 6, height - 3);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(x + 4, floatY + 4, width - 8, height - 5);
    }
  }

  // NPC Tukang Kebun (Gardener with Straw Hat & Speech Bubble)
  public static drawGardenerNPC(
    ctx: CanvasRenderingContext2D,
    npc: { x: number; y: number; width: number; height: number; name: string; dialog: string; facing: 1 | -1 },
    frame: number,
    isNearPlayer: boolean
  ) {
    const { x, y, width, height, facing } = npc;
    const px = 2;

    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.scale(facing, 1);

    const startX = -width / 2;
    const startY = -height / 2;

    // Gentle breathing
    const bob = Math.sin(frame * 0.08) * 1;

    // Straw Hat
    ctx.fillStyle = '#ca8a04';
    // Brim
    ctx.fillRect(startX, startY + (3 + bob) * px, width, 3 * px);
    // Crown
    ctx.fillRect(startX + 4 * px, startY + bob * px, 10 * px, 4 * px);
    // Red ribbon band
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(startX + 4 * px, startY + (3 + bob) * px, 10 * px, 1 * px);

    // Gardener Face
    ctx.fillStyle = '#fed7aa'; // Skin tone
    ctx.fillRect(startX + 4 * px, startY + (6 + bob) * px, 10 * px, 6 * px);
    // Friendly eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(startX + 7 * px, startY + (7 + bob) * px, 2 * px, 2 * px);
    ctx.fillRect(startX + 11 * px, startY + (7 + bob) * px, 2 * px, 2 * px);
    // Cozy Mustache
    ctx.fillStyle = '#78350f';
    ctx.fillRect(startX + 6 * px, startY + (10 + bob) * px, 8 * px, 2 * px);

    // Denim Overalls & Plaid Shirt
    ctx.fillStyle = '#b91c1c'; // Red shirt sleeves
    ctx.fillRect(startX + 2 * px, startY + (12 + bob) * px, 14 * px, 4 * px);
    ctx.fillStyle = '#1d4ed8'; // Blue denim overalls
    ctx.fillRect(startX + 4 * px, startY + (13 + bob) * px, 10 * px, 8 * px);
    // Overalls straps
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(startX + 5 * px, startY + (12 + bob) * px, 2 * px, 4 * px);
    ctx.fillRect(startX + 11 * px, startY + (12 + bob) * px, 2 * px, 4 * px);
    // Yellow buttons
    ctx.fillStyle = '#facc15';
    ctx.fillRect(startX + 5 * px, startY + (14 + bob) * px, 2 * px, 1 * px);
    ctx.fillRect(startX + 11 * px, startY + (14 + bob) * px, 2 * px, 1 * px);

    // Boots
    ctx.fillStyle = '#451a03';
    ctx.fillRect(startX + 4 * px, startY + 22 * px, 4 * px, 3 * px);
    ctx.fillRect(startX + 10 * px, startY + 22 * px, 4 * px, 3 * px);

    // Watering can in hand
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(startX + 14 * px, startY + (15 + bob) * px, 5 * px, 4 * px);
    ctx.fillRect(startX + 18 * px, startY + (14 + bob) * px, 3 * px, 2 * px);

    ctx.restore();

    // Speech bubble above NPC if player is near
    if (isNearPlayer) {
      const bubbleW = 220;
      const bubbleH = 50;
      const bubbleX = x + width / 2 - bubbleW / 2;
      const bubbleY = y - bubbleH - 14 + Math.sin(frame * 0.1) * 2;

      // Pixel box bubble
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bubbleX, bubbleY, bubbleW, bubbleH);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.strokeRect(bubbleX, bubbleY, bubbleW, bubbleH);

      // Tail
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(x + width / 2 - 6, bubbleY + bubbleH);
      ctx.lineTo(x + width / 2 + 6, bubbleY + bubbleH);
      ctx.lineTo(x + width / 2, bubbleY + bubbleH + 8);
      ctx.fill();

      // Text inside bubble
      ctx.fillStyle = '#0f172a';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, bubbleX + bubbleW / 2, bubbleY + 16);

      ctx.fillStyle = '#334155';
      ctx.font = '8px "Press Start 2P", monospace';

      // Simple word wrap
      const words = npc.dialog.split(' ');
      let line1 = '';
      let line2 = '';
      for (const w of words) {
        if ((line1 + w).length < 24) {
          line1 += (line1 ? ' ' : '') + w;
        } else {
          line2 += (line2 ? ' ' : '') + w;
        }
      }
      ctx.fillText(line1, bubbleX + bubbleW / 2, bubbleY + 30);
      if (line2) {
        ctx.fillText(line2, bubbleX + bubbleW / 2, bubbleY + 42);
      }
    }
  }

  // Checkpoint & Finish Flag
  public static drawCheckpoint(
    ctx: CanvasRenderingContext2D,
    cp: { x: number; y: number; width: number; height: number; activated: boolean },
    frame: number
  ) {
    const { x, y, width, height, activated } = cp;
    // Pole
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + width / 2 - 2, y, 4, height);

    // Sunflower / Lantern on top
    const flowerY = y - 10;
    if (activated) {
      // Spinning blooming radiant sunflower
      const angle = frame * 0.08;
      ctx.save();
      ctx.translate(x + width / 2, flowerY);
      ctx.rotate(angle);
      ctx.fillStyle = '#facc15';
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.fillRect(-3, -12, 6, 8);
      }
      ctx.restore();

      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(x + width / 2, flowerY, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Unopened green bud
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(x + width / 2, flowerY, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  public static drawFinishFlag(
    ctx: CanvasRenderingContext2D,
    flag: { x: number; y: number; width: number; height: number },
    frame: number
  ) {
    const { x, y, width, height } = flag;
    // Pole
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 4, y, 4, height);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 2, y - 4, 8, 5); // Golden finial

    // Fluttering checkered/fruit flag
    const wave = Math.sin(frame * 0.15) * 4;
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 8, y + 2 + wave, 28, 18);
    // Red Apple emblem on flag
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 18, y + 6 + wave, 8, 8);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 19, y + 7 + wave, 2, 2);
  }

  // Platform rendering with theme adaptations
  public static drawPlatform(
    ctx: CanvasRenderingContext2D,
    plat: { x: number; y: number; width: number; height: number; type: string; phase?: number },
    theme: 'morning' | 'sunset' | 'night',
    frame: number
  ) {
    const { x, y, width, height, type } = plat;

    if (type === 'spring') {
      // Spring bounce mushroom
      ctx.fillStyle = '#ef4444'; // Mushroom cap
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width / 2, Math.PI, 0);
      ctx.fill();
      // White polka dots
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + width / 2 - 3, y + 3, 6, 4);
      ctx.fillRect(x + 6, y + 8, 4, 4);
      ctx.fillRect(x + width - 10, y + 8, 4, 4);
      // Stem
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(x + width / 2 - 4, y + height / 2, 8, height / 2);
      return;
    }

    if (type === 'moving') {
      // Wooden vine platform with mechanical gears/leaves
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
      // Hanging decorative vines
      ctx.fillStyle = '#15803d';
      ctx.fillRect(x + 6, y + height, 2, 8 + Math.sin(frame * 0.1) * 3);
      ctx.fillRect(x + width - 8, y + height, 2, 6 + Math.cos(frame * 0.1) * 3);
      return;
    }

    if (type === 'leaf_secret') {
      // Secret foliage false wall
      ctx.fillStyle = 'rgba(21, 128, 61, 0.85)';
      ctx.fillRect(x, y, width, height);
      // Leaves texture
      ctx.fillStyle = '#22c55e';
      for (let i = 0; i < width; i += 16) {
        ctx.fillRect(x + i, y + 4, 8, 6);
      }
      return;
    }

    // Default ground / platform
    let topColor = '#22c55e'; // Grass green
    let dirtColor = '#78350f'; // Rich garden soil
    let detailColor = '#15803d';

    if (theme === 'sunset') {
      topColor = '#84cc16';
      dirtColor = '#713f12';
      detailColor = '#4d7c0f';
    } else if (theme === 'night') {
      topColor = '#047857'; // Deep emerald night grass
      dirtColor = '#292524'; // Dark night soil
      detailColor = '#065f46';
    }

    if (type === 'stone') {
      topColor = theme === 'night' ? '#475569' : '#78716c';
      dirtColor = theme === 'night' ? '#1e293b' : '#44403c';
      detailColor = '#a8a29e';
    }

    // Dirt base
    ctx.fillStyle = dirtColor;
    ctx.fillRect(x, y, width, height);

    // Grass Top (4px thick with hanging grass blades)
    ctx.fillStyle = topColor;
    ctx.fillRect(x, y, width, 6);

    // Hanging grass blades
    ctx.fillStyle = detailColor;
    for (let gx = 0; gx < width; gx += 8) {
      const bladeH = ((gx / 8) % 2 === 0) ? 3 : 5;
      ctx.fillRect(x + gx, y + 6, 3, bladeH);
    }
  }

  // Hazards (Spikes & Thorn Bushes)
  public static drawHazard(
    ctx: CanvasRenderingContext2D,
    hazard: { x: number; y: number; width: number; height: number; type: string },
    frame: number
  ) {
    const { x, y, width, height, type } = hazard;
    if (type === 'spikes') {
      ctx.fillStyle = '#64748b';
      const spikeW = 12;
      const count = Math.ceil(width / spikeW);
      for (let i = 0; i < count; i++) {
        const sx = x + i * spikeW;
        ctx.beginPath();
        ctx.moveTo(sx + spikeW / 2, y);
        ctx.lineTo(sx, y + height);
        ctx.lineTo(sx + spikeW, y + height);
        ctx.fill();
      }
    } else if (type === 'thorns') {
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(x, y + 4, width, height - 4);
      // Sharp thorny brambles
      ctx.fillStyle = '#b91c1c';
      for (let i = 0; i < width; i += 8) {
        ctx.fillRect(x + i, y, 3, 6);
      }
    }
  }
}
