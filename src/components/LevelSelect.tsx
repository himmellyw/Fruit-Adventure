import React from 'react';
import { Lock, Play, ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import { ALL_LEVELS } from '../game/levels';
import { SaveProgress } from '../game/types';

interface LevelSelectProps {
  progress: SaveProgress;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  progress,
  onSelectLevel,
  onBack
}) => {
  return (
    <div id="level-select-overlay" className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 select-none bg-stone-950/85 backdrop-blur-xs pointer-events-auto">
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between">
        <button
          id="level-select-back-btn"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border-2 border-stone-600 rounded-lg font-pixel text-xs cursor-pointer transition-transform active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>BACK</span>
        </button>

        <h2 className="font-pixel text-lg md:text-xl text-amber-300 drop-shadow-[0_2px_0_#78350f]">
          SELECT LEVEL
        </h2>

        <div className="w-16" />
      </div>

      {/* Level Cards Grid */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-5 my-auto">
        {ALL_LEVELS.map((lvl) => {
          const isUnlocked = lvl.id <= progress.unlockedLevels;
          const goldenFruitFound = progress.goldenFruits[lvl.id - 1];
          const highScore = progress.highScores[lvl.id - 1];

          // Theme colors
          const headerBg =
            lvl.id === 1
              ? 'from-sky-600 to-emerald-600'
              : lvl.id === 2
              ? 'from-amber-600 to-fuchsia-700'
              : 'from-indigo-800 to-purple-900';

          return (
            <div
              key={lvl.id}
              id={`level-card-${lvl.id}`}
              className={`relative rounded-xl border-3 overflow-hidden flex flex-col transition-all duration-200 ${
                isUnlocked
                  ? 'border-stone-500 bg-stone-900 hover:border-amber-400 hover:scale-102 shadow-xl cursor-pointer'
                  : 'border-stone-800 bg-stone-950/90 opacity-60'
              }`}
              onClick={() => {
                if (isUnlocked) onSelectLevel(lvl.id);
              }}
            >
              {/* Card Banner */}
              <div className={`p-4 bg-gradient-to-r ${headerBg} text-white font-pixel flex items-center justify-between`}>
                <div>
                  <div className="text-xs text-amber-200">LEVEL {lvl.id}</div>
                  <div className="text-sm font-bold mt-0.5">{lvl.subtitle}</div>
                </div>
                {!isUnlocked && <Lock size={20} className="text-stone-300" />}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between font-silkscreen text-xs text-stone-300">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Difficulty:</span>
                    <span className={`font-pixel text-[10px] ${
                      lvl.id === 1 ? 'text-emerald-400' : lvl.id === 2 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {lvl.id === 1 ? 'EASY' : lvl.id === 2 ? 'MEDIUM' : 'HARD / BOSS'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Golden Fruit:</span>
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} className={goldenFruitFound ? 'text-yellow-400 fill-yellow-400' : 'text-stone-600'} />
                      <span className={goldenFruitFound ? 'text-yellow-400 font-pixel text-[9px]' : 'text-stone-500 font-pixel text-[9px]'}>
                        {goldenFruitFound ? 'FOUND' : 'MISSING'}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Best Score:</span>
                    <span className="text-amber-300 font-pixel text-[10px] flex items-center gap-1">
                      <Trophy size={11} /> {highScore.toString().padStart(5, '0')}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-stone-800">
                  {isUnlocked ? (
                    <button
                      id={`play-level-btn-${lvl.id}`}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs rounded-lg border-2 border-emerald-300 flex items-center justify-center gap-2 shadow-sm pixel-btn cursor-pointer"
                    >
                      <Play size={13} className="fill-white" />
                      <span>PLAY LEVEL</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-stone-500 font-pixel text-[10px]">
                      <Lock size={12} />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip footer */}
      <div className="text-xs text-stone-400 font-silkscreen text-center">
        Tip: Collect all 3 Golden Fruits across levels to restore the garden harvest!
      </div>
    </div>
  );
};
