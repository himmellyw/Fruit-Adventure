import React from 'react';
import { Play, HelpCircle, Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';
import { SaveProgress } from '../game/types';

interface MainMenuProps {
  progress: SaveProgress;
  isMuted: boolean;
  onStart: () => void;
  onHowToPlay: () => void;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  isMuted,
  onStart,
  onHowToPlay,
  onToggleMute
}) => {
  return (
    <div id="main-menu-overlay" className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 select-none bg-radial from-transparent via-stone-900/30 to-stone-950/80 pointer-events-auto">
      {/* Top Bar with Sound and Garden Status */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          {progress.gardenRestored ? (
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500 text-emerald-300 px-3 py-1 rounded-md text-[10px] font-pixel shadow-sm">
              <Sparkles size={13} className="text-emerald-400 animate-spin" />
              <span>GARDEN RESTORED!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-stone-900/80 border border-stone-700 text-stone-300 px-3 py-1 rounded-md text-[10px] font-pixel">
              <Trophy size={13} className="text-amber-400" />
              <span>UNLOCKED: LV {progress.unlockedLevels}/3</span>
            </div>
          )}
        </div>

        <button
          id="menu-mute-btn"
          onClick={onToggleMute}
          className="p-2.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border-2 border-stone-700 rounded-lg cursor-pointer transition-all active:scale-95"
          title={isMuted ? 'Unmute Chiptune Music' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Main Title Section */}
      <div className="text-center my-auto flex flex-col items-center">
        {/* Animated Cute Apple Mascot Emblem */}
        <div className="relative mb-3 animate-bounce">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 border-4 border-red-950 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
            {/* Glossy specular shine */}
            <div className="absolute top-2 left-2 w-5 h-5 bg-red-300 rounded-full opacity-80" />
            {/* Cute eyes */}
            <div className="flex gap-4 z-10">
              <div className="w-3.5 h-5 bg-stone-900 rounded-full relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 right-0.5" />
              </div>
              <div className="w-3.5 h-5 bg-stone-900 rounded-full relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
            {/* Cute smile */}
            <div className="absolute bottom-4 w-5 h-2.5 border-b-3 border-stone-900 rounded-full" />
            {/* Rosy cheeks */}
            <div className="absolute bottom-5 left-3 w-3 h-2 bg-rose-300 rounded-full opacity-70" />
            <div className="absolute bottom-5 right-3 w-3 h-2 bg-rose-300 rounded-full opacity-70" />
          </div>
          {/* Green Stem and Leaf */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center">
            <div className="w-2 h-4 bg-amber-900 rounded-xs" />
            <div className="w-5 h-3 bg-emerald-500 border border-emerald-800 rounded-full -ml-1 -mt-2" />
          </div>
        </div>

        {/* Game Title Typography */}
        <h1 className="font-pixel text-2xl md:text-4xl text-amber-300 tracking-wider drop-shadow-[0_4px_0_#78350f] mb-1">
          FRUIT GARDEN
        </h1>
        <h2 className="font-pixel text-xl md:text-3xl text-emerald-400 tracking-widest drop-shadow-[0_4px_0_#14532d] mb-4">
          ADVENTURE
        </h2>

        <p className="font-silkscreen text-xs md:text-sm text-stone-300 max-w-md mb-8 px-4 leading-relaxed">
          Stomp mischievous garden worms, discover secret groves, unlock Surprise Boxes, and defeat Gigaworm!
        </p>

        {/* Menu Action Buttons */}
        <div className="flex flex-col gap-3.5 w-full max-w-xs">
          <button
            id="menu-start-btn"
            onClick={onStart}
            className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-pixel text-sm tracking-wide rounded-xl border-3 border-emerald-300 shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer pixel-btn"
          >
            <Play size={18} className="fill-white" />
            <span>START GAME</span>
          </button>

          <button
            id="menu-how-to-play-btn"
            onClick={onHowToPlay}
            className="w-full py-3 px-6 bg-stone-800 hover:bg-stone-700 text-stone-200 font-pixel text-xs tracking-wide rounded-xl border-2 border-stone-600 shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer pixel-btn"
          >
            <HelpCircle size={16} />
            <span>HOW TO PLAY</span>
          </button>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="text-[10px] text-stone-400 font-silkscreen text-center">
        Controls: WASD / Arrow Keys / Space Bar & Touch D-pad
      </div>
    </div>
  );
};
