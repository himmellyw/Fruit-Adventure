import React from 'react';
import { Volume2, VolumeX, Pause, Sparkles, Heart } from 'lucide-react';
import { BossState, PowerUpState } from '../game/types';

interface HUDProps {
  score: number;
  lives: number;
  maxLives: number;
  fruitsCollected: number;
  totalFruits: number;
  goldenFruitCollected: boolean;
  levelName: string;
  levelSubtitle: string;
  comboCount: number;
  activePower: PowerUpState | null;
  boss: BossState | null;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  lives,
  maxLives,
  fruitsCollected,
  totalFruits,
  goldenFruitCollected,
  levelName,
  levelSubtitle,
  comboCount,
  activePower,
  boss,
  isMuted,
  onToggleMute,
  onPause
}) => {
  // Pad score with leading zeroes
  const formattedScore = score.toString().padStart(5, '0');

  return (
    <div id="game-hud" className="absolute top-0 left-0 right-0 p-3 pointer-events-none z-20 flex flex-col gap-2 font-pixel">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between bg-stone-900/85 backdrop-blur-xs border-2 border-stone-700 px-3 py-2 rounded-md text-[10px] md:text-xs text-stone-200 shadow-lg pointer-events-auto">
        {/* Left: Score & Lives */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400">SCORE:</span>
            <span className="text-white font-bold tracking-wider">{formattedScore}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-rose-400">LIVES:</span>
            <div className="flex gap-1 items-center">
              {Array.from({ length: maxLives }).map((_, i) => (
                <Heart
                  key={i}
                  size={14}
                  className={i < lives ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-stone-600'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Fruits & Golden Fruit */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400">FRUIT:</span>
            <span className="text-white">{fruitsCollected}/{totalFruits}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className={goldenFruitCollected ? 'text-yellow-400 fill-yellow-400 animate-spin' : 'text-stone-600'} />
            <span className={goldenFruitCollected ? 'text-yellow-400 font-bold' : 'text-stone-500'}>
              GOLDEN: {goldenFruitCollected ? '1/1' : '0/1'}
            </span>
          </div>
        </div>

        {/* Right: Level & Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-amber-300 font-bold text-[10px]">{levelName}</div>
            <div className="text-stone-400 text-[8px]">{levelSubtitle}</div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="hud-mute-btn"
              onClick={onToggleMute}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 active:scale-95 border border-stone-600 rounded text-stone-300 cursor-pointer"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <button
              id="hud-pause-btn"
              onClick={onPause}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 active:scale-95 border border-stone-600 rounded text-stone-300 cursor-pointer"
              title="Pause Game"
            >
              <Pause size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar for Mobile: Fruits Counter */}
      <div className="sm:hidden flex items-center justify-between px-2 text-[9px]">
        <span className="text-emerald-300 bg-stone-900/80 px-2 py-0.5 rounded border border-stone-700">
          FRUIT: {fruitsCollected}/{totalFruits}
        </span>
        <span className={`${goldenFruitCollected ? 'text-yellow-400' : 'text-stone-500'} bg-stone-900/80 px-2 py-0.5 rounded border border-stone-700 flex items-center gap-1`}>
          <Sparkles size={11} /> {goldenFruitCollected ? 'GOLDEN 1/1' : 'GOLDEN 0/1'}
        </span>
      </div>

      {/* Dynamic Floating Banners */}
      <div className="flex items-center justify-between pointer-events-none">
        {/* Active Power-up Badge */}
        {activePower && (
          <div className="bg-amber-900/90 border-2 border-amber-500 px-3 py-1.5 rounded text-[10px] text-amber-200 flex items-center gap-2 shadow-md animate-bounce">
            <Sparkles size={14} className="text-amber-300 animate-spin" />
            <span>POWER: {activePower.name}</span>
            <span className="text-white font-bold">({Math.ceil(activePower.duration)}s)</span>
          </div>
        )}

        {/* Combo Multiplier Animation */}
        {comboCount > 1 && (
          <div className="ml-auto bg-yellow-500/90 text-stone-950 px-3 py-1 rounded text-xs font-bold border-2 border-yellow-300 shadow-md animate-pulse">
            COMBO x{comboCount}!
          </div>
        )}
      </div>

      {/* Boss Health Bar (Level 3) */}
      {boss && boss.active && (
        <div className="mx-auto w-full max-w-md bg-stone-950/90 border-2 border-red-700 p-2 rounded shadow-2xl pointer-events-auto mt-1">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-red-400 font-bold tracking-widest">{boss.name}</span>
            <span className="text-amber-400">PHASE {boss.phase} / 3</span>
          </div>
          {/* Segmented health gauge */}
          <div className="w-full bg-stone-800 h-3.5 border border-stone-600 rounded-xs overflow-hidden flex gap-0.5 p-0.5">
            {Array.from({ length: boss.maxHealth }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full transition-all duration-200 ${
                  i < boss.health
                    ? boss.phase === 3
                      ? 'bg-rose-600'
                      : boss.phase === 2
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                    : 'bg-stone-900 opacity-40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
