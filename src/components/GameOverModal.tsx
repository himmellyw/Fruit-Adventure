import React from 'react';
import { RotateCcw, Home, Skull, Trophy, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  levelId: number;
  fruitsCollected: number;
  totalFruits: number;
  goldenFruit: boolean;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  levelId,
  fruitsCollected,
  totalFruits,
  goldenFruit,
  onRestart,
  onMainMenu
}) => {
  return (
    <div id="game-over-modal" className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none pointer-events-auto">
      <div className="w-full max-w-md bg-stone-900 border-4 border-rose-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {/* Skull Emblem */}
        <div className="w-16 h-16 bg-rose-950/80 border-2 border-rose-600 rounded-2xl flex items-center justify-center mb-3">
          <Skull size={32} className="text-rose-400" />
        </div>

        <h2 className="font-pixel text-2xl text-rose-500 tracking-wider drop-shadow-[0_2px_0_#450a0a] mb-1">
          GAME OVER
        </h2>
        <p className="font-silkscreen text-xs text-stone-400 mb-6">
          Appley ran out of garden lives! Try again?
        </p>

        {/* Stats Card */}
        <div className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-4 mb-6 space-y-2.5 font-pixel text-xs text-stone-300">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[10px]">FINAL SCORE:</span>
            <span className="text-amber-400 font-bold tracking-wider flex items-center gap-1">
              <Trophy size={13} /> {score.toString().padStart(5, '0')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[10px]">LEVEL REACHED:</span>
            <span className="text-white">LEVEL {levelId}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[10px]">FRUITS COLLECTED:</span>
            <span className="text-emerald-400">{fruitsCollected} / {totalFruits}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[10px]">GOLDEN FRUIT:</span>
            <span className={goldenFruit ? 'text-yellow-400 flex items-center gap-1' : 'text-stone-600'}>
              <Sparkles size={12} /> {goldenFruit ? '1/1 FOUND' : '0/1 MISSED'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            id="game-over-restart-btn"
            onClick={onRestart}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs rounded-xl border-2 border-emerald-300 shadow-lg flex items-center justify-center gap-2 pixel-btn cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>RESTART</span>
          </button>

          <button
            id="game-over-menu-btn"
            onClick={onMainMenu}
            className="flex-1 py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 font-pixel text-xs rounded-xl border-2 border-stone-600 shadow-md flex items-center justify-center gap-2 pixel-btn cursor-pointer"
          >
            <Home size={14} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
