import React from 'react';
import { RotateCcw, Home, Sparkles, Trophy, Star, Heart } from 'lucide-react';

interface VictoryModalProps {
  score: number;
  allGoldenFruits: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  allGoldenFruits,
  onPlayAgain,
  onMainMenu
}) => {
  return (
    <div id="victory-modal" className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-xs select-none pointer-events-auto">
      <div className="w-full max-w-lg bg-stone-900 border-4 border-amber-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Confetti / Sparkle Rays */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Celebration Header */}
        <div className="flex items-center gap-2 mb-2">
          <Star className="text-yellow-400 fill-yellow-400 animate-spin" size={20} />
          <span className="font-pixel text-xs text-amber-300 uppercase tracking-widest">
            VICTORY ACHIEVED!
          </span>
          <Star className="text-yellow-400 fill-yellow-400 animate-spin" size={20} />
        </div>

        <h2 className="font-pixel text-xl sm:text-2xl text-emerald-400 tracking-wider drop-shadow-[0_2px_0_#14532d] mb-3">
          YOU SAVED THE GARDEN!
        </h2>

        {/* Garden Restored Illustration & Characters */}
        <div className="w-full bg-linear-to-b from-sky-400/20 to-emerald-600/30 border-2 border-emerald-500/50 rounded-2xl p-4 mb-5 relative flex items-center justify-around overflow-hidden">
          {/* Hero Apple */}
          <div className="flex flex-col items-center animate-bounce">
            <div className="w-14 h-14 bg-red-600 border-3 border-red-950 rounded-2xl relative flex items-center justify-center shadow-lg">
              <div className="w-2.5 h-3.5 bg-stone-900 rounded-full mr-2" />
              <div className="w-2.5 h-3.5 bg-stone-900 rounded-full" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-amber-900" />
              <div className="absolute -top-2.5 left-1/2 w-4 h-2 bg-emerald-400 rounded-full" />
            </div>
            <span className="font-pixel text-[9px] text-white mt-1">Appley</span>
          </div>

          {/* Cheerful Flowers & Fruit Icons */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-2">
              <span className="text-2xl animate-pulse">🌸</span>
              <span className="text-2xl animate-pulse delay-100">🍎</span>
              <span className="text-2xl animate-pulse delay-200">🌻</span>
            </div>
            <span className="font-silkscreen text-[10px] text-emerald-300">Garden Restored & Flourishing!</span>
          </div>

          {/* Friendly Gardener Bram */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-amber-200 border-3 border-stone-800 rounded-2xl relative flex flex-col items-center justify-center shadow-lg overflow-hidden">
              <div className="w-full h-3 bg-amber-600 absolute top-0" />
              <div className="w-3 h-1 bg-stone-900 rounded-full mb-1" />
              <div className="w-8 h-2 bg-amber-900 rounded-full" />
            </div>
            <span className="font-pixel text-[9px] text-white mt-1">Bram</span>
          </div>
        </div>

        {/* All Golden Fruits Found Bonus Badge */}
        {allGoldenFruits && (
          <div className="w-full bg-linear-to-r from-amber-600/30 via-yellow-500/40 to-amber-600/30 border-2 border-yellow-400 p-2.5 rounded-xl mb-4 flex items-center justify-center gap-2 animate-pulse">
            <Sparkles className="text-yellow-300" size={16} />
            <span className="font-pixel text-[11px] text-yellow-300 tracking-wider">
              ALL GOLDEN FRUITS FOUND! (+3000 BONUS)
            </span>
          </div>
        )}

        {/* Final Stats Summary */}
        <div className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-4 mb-6 space-y-2 font-pixel text-xs text-stone-300">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[10px]">TOTAL SCORE:</span>
            <span className="text-amber-400 text-sm font-bold flex items-center gap-1.5">
              <Trophy size={15} /> {score.toString().padStart(6, '0')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[10px]">LEVELS COMPLETED:</span>
            <span className="text-emerald-400">3 / 3 (FULL CLEARED)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[10px]">FINAL BOSS:</span>
            <span className="text-rose-400 font-bold">GIGAWORM DEFEATED</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            id="victory-play-again-btn"
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs rounded-xl border-2 border-emerald-300 shadow-lg flex items-center justify-center gap-2 pixel-btn cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>PLAY AGAIN</span>
          </button>

          <button
            id="victory-menu-btn"
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
