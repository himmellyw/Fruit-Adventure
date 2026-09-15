// Web Audio API Retro 16-bit Synthesizer & Chiptune Player
// Completely self-contained, zero external asset dependencies

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private currentBgm: string | null = null;
  private bgmInterval: number | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // Lazy initialize on first user interaction
  }

  private init() {
    if (this.isInitialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.25;
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
    } catch {
      // AudioContext unavailable
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.25;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a simple synthesized tone
  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    startGain: number = 0.3,
    endGain: number = 0.001,
    timeOffset: number = 0
  ) {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + timeOffset;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(startGain, startTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(endGain, 0.0001), startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Ignore audio glitches
    }
  }

  // Retro sound effects
  public playJump() {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio catch
    }
  }

  public playStomp() {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // Low punch + chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio catch
    }
  }

  public playCoin() {
    this.playTone(987.77, 0.08, 'square', 0.25, 0.01, 0); // B5
    this.playTone(1318.51, 0.18, 'square', 0.25, 0.01, 0.06); // E6
  }

  public playGoldenFruit() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.2, 'triangle', 0.35, 0.01, idx * 0.07);
    });
  }

  public playSurpriseBox() {
    this.playTone(300, 0.08, 'sawtooth', 0.35, 0.05, 0);
    this.playTone(600, 0.1, 'square', 0.3, 0.01, 0.06);
    this.playTone(900, 0.2, 'triangle', 0.3, 0.01, 0.12);
  }

  public playLucky() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.18, 'square', 0.3, 0.01, idx * 0.08);
    });
  }

  public playSuperBonus() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.25, 'triangle', 0.4, 0.01, idx * 0.09);
    });
  }

  public playOhNo() {
    this.playTone(350, 0.15, 'sawtooth', 0.3, 0.01, 0);
    this.playTone(280, 0.15, 'sawtooth', 0.35, 0.01, 0.12);
    this.playTone(200, 0.3, 'sawtooth', 0.4, 0.01, 0.24);
  }

  public playPowerup() {
    const notes = [330, 392, 493.88, 587.33, 659.25];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.15, 'square', 0.3, 0.01, idx * 0.06);
    });
  }

  public playHurt() {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio catch
    }
  }

  public playSecret() {
    const notes = [392, 523.25, 659.25, 783.99, 987.77, 1174.66];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.2, 'sine', 0.3, 0.01, idx * 0.06);
    });
  }

  public playBossSlam() {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio catch
    }
  }

  public playBossHurt() {
    this.playTone(400, 0.1, 'sawtooth', 0.4, 0.01, 0);
    this.playTone(250, 0.15, 'sawtooth', 0.4, 0.01, 0.08);
  }

  public playVictory() {
    const melody = [
      { f: 523.25, d: 0.15, t: 0 },
      { f: 523.25, d: 0.15, t: 0.16 },
      { f: 523.25, d: 0.15, t: 0.32 },
      { f: 523.25, d: 0.35, t: 0.48 },
      { f: 415.30, d: 0.35, t: 0.85 },
      { f: 466.16, d: 0.35, t: 1.22 },
      { f: 523.25, d: 0.6, t: 1.6 }
    ];
    melody.forEach((n) => {
      this.playTone(n.f, n.d, 'square', 0.35, 0.01, n.t);
    });
  }

  public playGameOver() {
    const melody = [
      { f: 392.00, d: 0.25, t: 0 },
      { f: 349.23, d: 0.25, t: 0.26 },
      { f: 311.13, d: 0.25, t: 0.52 },
      { f: 261.63, d: 0.6, t: 0.8 }
    ];
    melody.forEach((n) => {
      this.playTone(n.f, n.d, 'triangle', 0.4, 0.01, n.t);
    });
  }

  public playLevelClear() {
    const melody = [
      { f: 440, d: 0.12, t: 0 },
      { f: 554.37, d: 0.12, t: 0.13 },
      { f: 659.25, d: 0.12, t: 0.26 },
      { f: 880, d: 0.3, t: 0.39 },
      { f: 659.25, d: 0.15, t: 0.72 },
      { f: 880, d: 0.5, t: 0.88 }
    ];
    melody.forEach((n) => {
      this.playTone(n.f, n.d, 'square', 0.3, 0.01, n.t);
    });
  }

  // Chiptune background music loop
  public playBGM(track: 'menu' | 'level1' | 'level2' | 'level3' | 'boss') {
    if (this.currentBgm === track) return;
    this.stopBGM();
    this.currentBgm = track;
    this.resume();

    // Base loop timings (in seconds)
    const stepTime = 0.16;
    let stepIndex = 0;

    // Pattern sequences for each track
    // (Frequencies in Hz)
    let melodyNotes: number[] = [];
    let bassNotes: number[] = [];

    if (track === 'menu') {
      // Bouncy cheerful garden waltz
      melodyNotes = [
        392, 0, 440, 523.25, 0, 440, 392, 0,
        329.63, 0, 349.23, 392, 0, 349.23, 329.63, 0,
        293.66, 0, 329.63, 349.23, 0, 392, 440, 0,
        523.25, 0, 440, 392, 349.23, 329.63, 293.66, 0
      ];
      bassNotes = [
        130.81, 130.81, 164.81, 196.00,
        130.81, 130.81, 174.61, 196.00,
        146.83, 146.83, 174.61, 220.00,
        130.81, 196.00, 130.81, 196.00
      ];
    } else if (track === 'level1') {
      // Sunny Garden - cheerful, upbeat retro melody
      melodyNotes = [
        523.25, 0, 523.25, 659.25, 0, 783.99, 659.25, 0,
        587.33, 0, 587.33, 698.46, 0, 880.00, 698.46, 0,
        659.25, 0, 783.99, 1046.50, 0, 880.00, 783.99, 0,
        587.33, 659.25, 587.33, 523.25, 0, 0, 0, 0
      ];
      bassNotes = [
        130.81, 196.00, 130.81, 196.00,
        146.83, 220.00, 146.83, 220.00,
        164.81, 246.94, 164.81, 246.94,
        130.81, 174.61, 196.00, 130.81
      ];
    } else if (track === 'level2') {
      // Deep Garden - mellow, rhythm twilight
      melodyNotes = [
        440, 0, 493.88, 523.25, 0, 587.33, 523.25, 493.88,
        440, 0, 392, 440, 0, 523.25, 493.88, 0,
        349.23, 0, 392, 440, 0, 523.25, 440, 0,
        329.63, 0, 392, 493.88, 0, 440, 0, 0
      ];
      bassNotes = [
        110.00, 164.81, 110.00, 164.81,
        130.81, 196.00, 130.81, 196.00,
        87.31, 130.81, 87.31, 130.81,
        98.00, 146.83, 110.00, 164.81
      ];
    } else if (track === 'level3') {
      // Forbidden Garden - suspenseful mystical night
      melodyNotes = [
        293.66, 0, 329.63, 349.23, 0, 440, 392, 349.23,
        329.63, 0, 293.66, 261.63, 0, 293.66, 349.23, 0,
        246.94, 0, 293.66, 349.23, 0, 392, 349.23, 0,
        220.00, 0, 261.63, 293.66, 0, 329.63, 293.66, 0
      ];
      bassNotes = [
        73.42, 110.00, 73.42, 110.00,
        65.41, 98.00, 65.41, 98.00,
        61.74, 92.50, 61.74, 92.50,
        55.00, 82.41, 73.42, 110.00
      ];
    } else if (track === 'boss') {
      // Gigaworm Boss - driving fast pace
      melodyNotes = [
        220, 220, 261.63, 220, 293.66, 220, 311.13, 293.66,
        220, 220, 261.63, 220, 329.63, 311.13, 293.66, 261.63,
        196, 196, 246.94, 196, 261.63, 196, 293.66, 261.63,
        185, 185, 220, 185, 246.94, 261.63, 293.66, 329.63
      ];
      bassNotes = [
        55, 110, 55, 110,
        55, 110, 55, 110,
        49, 98, 49, 98,
        46, 92, 55, 110
      ];
    }

    const intervalMs = (track === 'boss' ? 120 : 160);

    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted) return;

      const mNote = melodyNotes[stepIndex % melodyNotes.length];
      if (mNote > 0) {
        this.playTone(mNote, (track === 'boss' ? 0.09 : 0.12), 'square', 0.12, 0.01);
      }

      const bIndex = Math.floor(stepIndex / 2) % bassNotes.length;
      const bNote = bassNotes[bIndex];
      if (stepIndex % 2 === 0 && bNote > 0) {
        this.playTone(bNote, 0.15, 'triangle', 0.2, 0.01);
      }

      stepIndex++;
    }, intervalMs);
  }

  public stopBGM() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgm = null;
  }
}

export const audio = new SoundController();
